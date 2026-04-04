import { NextRequest, NextResponse } from 'next/server';
import { loginAccessToken, grantLoginTokens, postSteps } from '../../../lib/zepp';

export async function POST(req: NextRequest) {
  try {
    const { username, password, steps } = await req.json();

    if (!username || !password || steps === undefined) {
      return NextResponse.json({ success: false, message: '参数缺失' }, { status: 400 });
    }

    let user = username;
    let isPhone = false;
    if (!user.startsWith('+86') && !user.includes('@')) {
      user = '+86' + user;
    }
    if (user.startsWith('+86')) {
      isPhone = true;
    }

    // 1. 获取 Access Token
    const accessToken = await loginAccessToken(user, password);
    
    // 2. 获取 Login Tokens
    const { appToken, userId } = await grantLoginTokens(accessToken, 'DA932FFFFE8816E7', isPhone);

    // 3. 提交步数
    const result = await postSteps(Number(steps), appToken, userId);

    if (result.message === 'success' || result.code === 1 || result.message === 'ok') {
      return NextResponse.json({ success: true, message: '步数更新成功' });
    } else {
      console.error('Zepp postSteps failed:', result);
      return NextResponse.json({ success: false, message: result.message || '更新失败' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return NextResponse.json({ 
      success: false, 
      message: error.response?.data?.message || error.message || '服务器内部错误' 
    }, { status: 500 });
  }
}
