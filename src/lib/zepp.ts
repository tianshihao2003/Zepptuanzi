import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { DATA_JSON_TEMPLATE } from './template';

const HM_AES_KEY = CryptoJS.enc.Utf8.parse('xeNtBVqzDc6tuNTh');
const HM_AES_IV = CryptoJS.enc.Utf8.parse('MAAAYAAAAAAAAABg');

export async function loginAccessToken(user: string, pass: string) {
  const headers = {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'user-agent': 'MiFit6.14.0 (M2007J1SC; Android 12; Density/2.75)',
    'app_name': 'com.xiaomi.hm.health',
    'appname': 'com.xiaomi.hm.health',
    'appplatform': 'android_phone',
    'x-hm-ekv': '1',
    'hm-privacy-ceip': 'false',
  };

  const loginData = {
    'emailOrPhone': user,
    'password': pass,
    'state': 'REDIRECTION',
    'client_id': 'HuaMi',
    'country_code': 'CN',
    'token': 'access',
    'redirect_uri': 'https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html',
  };

  const query = new URLSearchParams(loginData).toString();
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(query), HM_AES_KEY, {
    iv: HM_AES_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // CryptoJS ciphertext to Buffer
  const cipherBuffer = Buffer.from(encrypted.ciphertext.toString(CryptoJS.enc.Hex), 'hex');

  try {
    const response = await axios.post('https://api-user.zepp.com/v2/registrations/tokens', cipherBuffer, {
      headers,
      maxRedirects: 0,
      validateStatus: (status) => status === 303,
    });

    const location = response.headers.location;
    if (!location) throw new Error('No location header in 303 response');
    const codeMatch = location.match(/access=([^&]*)/);
    if (!codeMatch) {
      throw new Error('Failed to get access token');
    }
    return codeMatch[1];
  } catch (error: any) {
    if (error.response && error.response.headers.location) {
        const location = error.response.headers.location;
        const codeMatch = location.match(/access=([^&]*)/);
        if (codeMatch) return codeMatch[1];
    }
    throw error;
  }
}

export async function grantLoginTokens(accessToken: string, deviceId: string, isPhone: boolean) {
  const url = 'https://account.huami.com/v2/client/login';
  const headers = {
    'app_name': 'com.xiaomi.hm.health',
    'x-request-id': uuidv4(),
    'accept-language': 'zh-CN',
    'appname': 'com.xiaomi.hm.health',
    'cv': '50818_6.14.0',
    'v': '2.0',
    'appplatform': 'android_phone',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };

  const data = new URLSearchParams({
    'app_name': 'com.xiaomi.hm.health',
    'app_version': '6.14.0',
    'code': accessToken,
    'country_code': 'CN',
    'device_id': deviceId,
    'device_model': 'android_phone',
    'grant_type': 'access_token',
    'third_name': isPhone ? 'huami_phone' : 'email',
  });

  const response = await axios.post(url, data.toString(), { headers });
  const result = response.data;

  if (result.result !== 'ok') {
    throw new Error(`Login failed: ${result.result}`);
  }

  return {
    loginToken: result.token_info.login_token,
    appToken: result.token_info.app_token,
    userId: result.token_info.user_id,
  };
}

export async function postSteps(steps: number, appToken: string, userId: string) {
  const t = Math.floor(Date.now() / 1000).toString();
  const today = new Date().toISOString().split('T')[0];
  const deviceId = 'DA932FFFFE8816E7';

  // Using template replacement logic from original Python code
  let dataJson = DATA_JSON_TEMPLATE;

  // Find and replace date and steps in the URL-encoded string
  const datePattern = /date%22%3A%22(.*?)%22%2C%22data/;
  const stepPattern = /ttl%5C%22%3A(.*?)%2C%5C%22dis/;

  const dateMatch = dataJson.match(datePattern);
  if (dateMatch) {
    dataJson = dataJson.split(dateMatch[1]).join(today);
  }

  const stepMatch = dataJson.match(stepPattern);
  if (stepMatch) {
    dataJson = dataJson.split(stepMatch[1]).join(steps.toString());
  }

  const url = `https://api-mifit-cn.huami.com/v1/data/band_data.json?t=${t}&r=${uuidv4()}`;
  const headers = {
    'apptoken': appToken,
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'MiFit6.14.0 (M2007J1SC; Android 12; Density/2.75)',
  };

  // Use current time for sync
  const syncTime = Math.floor(Date.now() / 1000) - 3600;

  // 关键修复：不要使用 URLSearchParams 自动编码，因为 dataJson 已经是编码过的字符串
  const body = `userid=${encodeURIComponent(userId)}&last_sync_data_time=${syncTime}&device_type=0&last_deviceid=${encodeURIComponent(deviceId)}&data_json=${dataJson}`;

  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error: any) {
    console.error('Zepp API postSteps error:', error.response?.data || error.message);
    throw error;
  }
}
