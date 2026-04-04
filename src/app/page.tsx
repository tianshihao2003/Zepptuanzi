'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Footprints, 
  Lock, 
  User, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Zap, 
  Clock, 
  Sun,
  Info,
  Activity,
  Gift,
  Shield,
  Moon,
  History,
  Dices,
  Mail,
  MessageSquare,
  Phone,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'update' | 'about' | 'contact'>('update');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [steps, setSteps] = useState(26105);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ date: string; steps: number }[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Load saved data and theme from localStorage on mount
  useEffect(() => {
    const savedBirthday = localStorage.getItem('zepp_birthday');
    const savedUsername = localStorage.getItem('zepp_username');
    const savedPassword = localStorage.getItem('zepp_password');
    const savedSteps = localStorage.getItem('zepp_steps');
    const savedHistory = localStorage.getItem('zepp_history');
    const savedTheme = localStorage.getItem('zepp_theme');

    if (savedBirthday) setBirthday(savedBirthday);
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
    if (savedSteps) setSteps(Number(savedSteps) || 26105);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
        setHistory([]);
      }
    }
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  // Update theme class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zepp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zepp_theme', 'light');
    }
  }, [isDarkMode]);

  // Auto-hide status after 5 seconds
  useEffect(() => {
    if (status.type) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleBirthdayChange = (val: string) => {
    setBirthday(val);
    localStorage.setItem('zepp_birthday', val);
  };

  const handleUsernameChange = (val: string) => {
    setUsername(val);
    localStorage.setItem('zepp_username', val);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    localStorage.setItem('zepp_password', val);
  };

  const handleStepsChange = (val: number) => {
    const safeVal = Math.min(Math.max(val, 1), 98800);
    setSteps(safeVal);
    localStorage.setItem('zepp_steps', safeVal.toString());
  };

  const setRandomSteps = () => {
    const random = Math.floor(Math.random() * (28000 - 18000 + 1)) + 18000;
    handleStepsChange(random);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify birthday before submission
    if (birthday !== '0824') {
      setStatus({ type: 'error', message: '生日错误，请确认后再试' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await axios.post('/api/steps', {
        username,
        password,
        steps,
      });

      if (response.data.success) {
        setStatus({ type: 'success', message: '步数同步成功！' });
        
        // Update history
        const newEntry = { date: new Date().toLocaleString(), steps };
        const newHistory = [newEntry, ...history].slice(0, 3);
        setHistory(newHistory);
        localStorage.setItem('zepp_history', JSON.stringify(newHistory));
      } else {
        setStatus({ type: 'error', message: response.data.message || '同步失败，请重试' });
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || '同步过程中发生错误，请检查账号密码',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={cn(
        "min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased transition-colors duration-300",
        isDarkMode ? "text-slate-100" : "text-slate-900"
      )}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundImage: "url(https://re.tsh520.cn/img/005.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {isDarkMode && (
        <div
          className="fixed inset-0 bg-slate-950/75"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2,6,23,0.75)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}
      <div
        className="relative w-full max-w-[480px]"
        style={{ position: 'relative', width: '100%', maxWidth: 480 }}
      >
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="flex items-center space-x-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            <div className={cn("flex items-center px-2 py-1 rounded-full border shadow-sm", isDarkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-100")}>
              <Database size={10} className="mr-1" />
              <span>API v1.0</span>
            </div>
            <div className={cn("flex items-center px-2 py-1 rounded-full border shadow-sm", isDarkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-100")}>
              <Activity size={10} className="mr-1 text-emerald-500" />
              <span>可用性 99.9%</span>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={cn(
              "p-1.5 rounded-full border shadow-sm transition-all active:scale-95",
              isDarkMode ? "bg-slate-900/70 border-slate-800 text-yellow-400" : "bg-white border-slate-100 text-slate-400 hover:text-slate-600"
            )}
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div
          className={cn(
            "flex p-1 rounded-xl border shadow-sm mb-4",
            isDarkMode ? "backdrop-blur-md bg-slate-900/75 border-slate-800" : "bg-white border-slate-100"
          )}
        >
          <button 
            onClick={() => setActiveTab('update')}
            className={cn(
              "flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-lg transition-all",
              activeTab === 'update' 
                ? (isDarkMode ? "bg-slate-800/80 text-white shadow-sm" : "bg-[#F8F9FA] text-slate-900 shadow-sm") 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Zap size={14} className="mr-2" />
            步数更新
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={cn(
              "flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-lg transition-all",
              activeTab === 'about' 
                ? (isDarkMode ? "bg-slate-800/80 text-white shadow-sm" : "bg-[#F8F9FA] text-slate-900 shadow-sm") 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Info size={14} className="mr-2" />
            关于工具
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={cn(
              "flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-lg transition-all",
              activeTab === 'contact' 
                ? (isDarkMode ? "bg-slate-800/80 text-white shadow-sm" : "bg-[#F8F9FA] text-slate-900 shadow-sm") 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <MessageSquare size={14} className="mr-2" />
            联系我
          </button>
        </div>

        {/* Main Content Card */}
        <div className={cn(
          "rounded-[24px] border shadow-xl transition-all duration-300 overflow-hidden",
          isDarkMode ? "backdrop-blur-md bg-slate-900/75 border-slate-800 shadow-black/40" : "bg-white border-slate-100 shadow-slate-200/50"
        )}>
          {activeTab === 'update' ? (
            <div className="p-8">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className={cn("text-xl font-bold flex items-center", isDarkMode ? "text-white" : "text-slate-900")}>
                    <Footprints className={cn("mr-2", isDarkMode ? "text-emerald-400" : "text-slate-900")} size={24} />
                    团子也要跑步
                  </h2>
                  <p className="text-slate-400 text-[11px] mt-1 font-medium">更新您的运动步数数据</p>
                </div>
                <div className={cn("flex items-center px-2 py-1 border rounded-md", isDarkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
                  <span className={cn("text-[10px] font-bold", isDarkMode ? "text-emerald-400" : "text-emerald-600")}>API 在线</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  {/* Birthday Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center">
                      <Gift size={12} className="mr-1.5 text-pink-400" />
                      团子和蛋糕的生日
                    </label>
                    <input
                      type="text"
                      placeholder="请输入生日 (如: 0101)"
                      maxLength={4}
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm placeholder:text-slate-300",
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-[#F8F9FA] border-slate-100 text-slate-900"
                      )}
                      value={birthday}
                      onChange={(e) => handleBirthdayChange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Username Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center">
                      <User size={12} className="mr-1.5" />
                      账号
                    </label>
                    <input
                      type="text"
                      placeholder="请输入账号"
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm placeholder:text-slate-300",
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-[#F8F9FA] border-slate-100 text-slate-900"
                      )}
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center">
                      <Lock size={12} className="mr-1.5" />
                      密码
                    </label>
                    <input
                      type="password"
                      placeholder="请输入密码"
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm placeholder:text-slate-300",
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-[#F8F9FA] border-slate-100 text-slate-900"
                      )}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Steps Input with Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center">
                        <Footprints size={12} className="mr-1.5" />
                        步数
                      </label>
                      <input 
                        type="number"
                        value={steps}
                        onChange={(e) => handleStepsChange(Number(e.target.value))}
                        className={cn("w-20 text-right bg-transparent border-none p-0 focus:ring-0 text-sm font-bold", isDarkMode ? "text-white" : "text-slate-900")}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {[10000, 20000, 30000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleStepsChange(val)}
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95",
                            steps === val 
                              ? "bg-slate-900 text-white" 
                              : (isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")
                          )}
                        >
                          {val/1000}K
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={setRandomSteps}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold flex items-center transition-all active:scale-95",
                          isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        <Dices size={12} className="mr-1" />
                        随机
                      </button>
                    </div>

                    <div className="space-y-1">
                      <input 
                        type="range"
                        min="1"
                        max="98800"
                        value={steps}
                        onChange={(e) => handleStepsChange(Number(e.target.value))}
                        className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", isDarkMode ? "bg-slate-800 accent-emerald-500" : "bg-slate-100 accent-slate-900")}
                      />
                      <div className="flex justify-between text-[10px] font-medium text-slate-300">
                        <span>1</span>
                        <span>98,800</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                {status.type && (
                  <div className={cn(
                    "flex items-center p-3 rounded-xl text-[11px] font-medium transition-all animate-in fade-in slide-in-from-top-2",
                    status.type === 'success' 
                      ? (isDarkMode ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-100") 
                      : (isDarkMode ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-700 border border-red-100")
                  )}>
                    {status.type === 'success' ? (
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="mr-2 h-3.5 w-3.5 shrink-0" />
                    )}
                    {status.message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
                    isDarkMode ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/10" : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10"
                  )}
                >
                  {loading ? (
                    <RefreshCw className="animate-spin h-4 w-4" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span>动动吧</span>
                </button>

                {/* History Section */}
                {history.length > 0 && (
                  <div className={cn("pt-6 border-t mt-6", isDarkMode ? "border-slate-800" : "border-slate-50")}>
                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      <History size={12} className="mr-1.5" />
                      最近同步
                    </div>
                    <div className="space-y-2">
                      {history.map((item, idx) => (
                        <div key={idx} className={cn("flex justify-between items-center p-2 rounded-lg text-[10px]", isDarkMode ? "bg-slate-800/50" : "bg-slate-50")}>
                          <span className="text-slate-400">{item.date}</span>
                          <span className={cn("font-bold", isDarkMode ? "text-emerald-400" : "text-slate-900")}>{item.steps.toLocaleString()} 步</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : activeTab === 'contact' ? (
            <div className="p-8 space-y-8 overflow-y-auto max-h-[500px]">
              {/* Contact Header */}
              <div className="flex items-start space-x-3">
                <div className={cn("p-2 rounded-lg", isDarkMode ? "bg-slate-800" : "bg-slate-50")}>
                  <MessageSquare size={20} className={isDarkMode ? "text-emerald-400" : "text-slate-900"} />
                </div>
                <div>
                  <h2 className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-slate-900")}>联系我</h2>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">如有问题或建议，欢迎联系</p>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className={cn("p-5 rounded-xl border transition-all hover:shadow-md", isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-750" : "bg-[#F8F9FA] border-slate-100 hover:bg-slate-50")}>
                  <div className="flex items-start space-x-4">
                    <div className={cn("p-2 rounded-lg", isDarkMode ? "bg-blue-500/10" : "bg-blue-50")}>
                      <Mail size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("text-sm font-bold mb-1", isDarkMode ? "text-slate-200" : "text-slate-900")}>邮箱</h3>
                      <p className="text-slate-400 text-xs">3109581507@qq.com</p>
                      <button 
                        onClick={() => window.location.href = 'mailto:3109581507@qq.com'}
                        className={cn("mt-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95", isDarkMode ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-100 text-blue-700 hover:bg-blue-200")}
                      >
                        发送邮件
                      </button>
                    </div>
                  </div>
                </div>

                <div className={cn("p-5 rounded-xl border transition-all hover:shadow-md", isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-750" : "bg-[#F8F9FA] border-slate-100 hover:bg-slate-50")}>
                  <div className="flex items-start space-x-4">
                    <div className={cn("p-2 rounded-lg", isDarkMode ? "bg-green-500/10" : "bg-green-50")}>
                      <MessageSquare size={18} className={isDarkMode ? "text-green-400" : "text-green-600"} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("text-sm font-bold mb-1", isDarkMode ? "text-slate-200" : "text-slate-900")}>QQ</h3>
                      <p className="text-slate-400 text-xs">3109581507</p>
                      <button 
                        onClick={() => window.open('https://wpa.qq.com/msgrd?v=3&uin=3109581507&site=qq&menu=yes')}
                        className={cn("mt-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95", isDarkMode ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-green-100 text-green-700 hover:bg-green-200")}
                      >
                        打开QQ
                      </button>
                    </div>
                  </div>
                </div>

                <div className={cn("p-5 rounded-xl border transition-all hover:shadow-md", isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-750" : "bg-[#F8F9FA] border-slate-100 hover:bg-slate-50")}>
                  <div className={cn("flex items-start space-x-4")}>
                    <div className={cn("p-2 rounded-lg", isDarkMode ? "bg-green-500/10" : "bg-green-50")}>
                      <Phone size={18} className={isDarkMode ? "text-green-400" : "text-green-600"} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("text-sm font-bold mb-1", isDarkMode ? "text-slate-200" : "text-slate-900")}>微信</h3>
                      <p className="text-slate-400 text-xs">dumplingandcake</p>
                      <div className={cn("mt-2 px-3 py-2 rounded-lg text-[10px] font-medium", isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700")}>
                        请手动添加微信号
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cn("p-5 rounded-xl border transition-all hover:shadow-md", isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-750" : "bg-[#F8F9FA] border-slate-100 hover:bg-slate-50")}>
                  <div className="flex items-start space-x-4">
                    <div className={cn("p-2 rounded-lg", isDarkMode ? "bg-purple-500/10" : "bg-purple-50")}>
                      <Globe size={18} className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("text-sm font-bold mb-1", isDarkMode ? "text-slate-200" : "text-slate-900")}>博客</h3>
                      <p className="text-slate-400 text-xs">blog.tsh520.cn</p>
                      <button 
                        onClick={() => window.open('https://blog.tsh520.cn/', '_blank')}
                        className={cn("mt-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95", isDarkMode ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" : "bg-purple-100 text-purple-700 hover:bg-purple-200")}
                      >
                        访问博客
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Note */}
              <div className={cn("p-4 rounded-xl border", isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100")}>
                <p className="text-slate-400 text-xs leading-relaxed">
                  欢迎对工具提出建议或反馈问题，我会尽快回复您。
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-8 overflow-y-auto max-h-[500px]">
              {/* About Header */}
              <div className="flex items-start space-x-3">
                <div className={cn("p-2 rounded-lg", isDarkMode ? "bg-slate-800" : "bg-slate-50")}>
                  <Info size={20} className={isDarkMode ? "text-emerald-400" : "text-slate-900"} />
                </div>
                <div>
                  <h2 className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-slate-900")}>关于 团子也要跑步</h2>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">工具说明与使用方法</p>
                </div>
              </div>

              {/* Function Intro */}
              <div className="space-y-3">
                <h3 className={cn("text-sm font-bold", isDarkMode ? "text-slate-200" : "text-slate-900")}>功能介绍</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  本工具用于更新您的运动应用中的步数数据，通过API接口直接提交您的账号、密码和目标步数。
                </p>
              </div>

              {/* Usage Method */}
              <div className="space-y-3">
                <h3 className={cn("text-sm font-bold", isDarkMode ? "text-slate-200" : "text-slate-900")}>使用方法</h3>
                <ol className="space-y-2 text-slate-500 text-xs list-decimal list-inside ml-1">
                  <li>输入您的账号（通常是注册时使用的邮箱）</li>
                  <li>输入您的账号密码</li>
                  <li>通过输入框或滑块设置目标步数</li>
                  <li>点击“动动吧”按钮提交</li>
                </ol>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <h3 className={cn("text-sm font-bold", isDarkMode ? "text-slate-200" : "text-slate-900")}>服务指标</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn("p-4 rounded-xl border space-y-2", isDarkMode ? "bg-slate-800 border-slate-700" : "bg-[#F8F9FA] border-slate-100")}>
                    <div className={cn("flex items-center space-x-2", isDarkMode ? "text-emerald-400" : "text-slate-900")}>
                      <Shield size={14} />
                      <span className="text-[11px] font-bold">可用性</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium tracking-tight">99.9%</p>
                  </div>
                  <div className={cn("p-4 rounded-xl border space-y-2", isDarkMode ? "bg-slate-800 border-slate-700" : "bg-[#F8F9FA] border-slate-100")}>
                    <div className={cn("flex items-center space-x-2", isDarkMode ? "text-emerald-400" : "text-slate-900")}>
                      <Clock size={14} />
                      <span className="text-[11px] font-bold">响应时间</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium tracking-tight">≤ 2秒</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className={cn("space-y-3 pt-4 border-t", isDarkMode ? "border-slate-800" : "border-slate-50")}>
                <h3 className={cn("text-sm font-bold", isDarkMode ? "text-slate-200" : "text-slate-900")}>注意事项</h3>
                <ul className="space-y-2 text-slate-500 text-xs list-disc list-inside ml-1">
                  <li>本工具仅用于学习和测试用途</li>
                  <li>请不要设置过高的步数，以免被系统判定为异常数据</li>
                  <li>账号信息仅保存在本地浏览器，请放心使用</li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="space-y-3">
                <h3 className={cn("text-sm font-bold", isDarkMode ? "text-slate-200" : "text-slate-900")}>免责声明</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed italic">
                  本工具仅供学习交流使用，使用本工具所产生的一切后果由用户自行承担。使用者应遵守相关法律法规，不得将本工具用于任何非法用途。开发者不对因使用本工具而导致的任何直接或间接损失负责。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-8 text-center space-y-1.5">
        <p className="text-[10px] font-medium text-slate-400">© 2026 团子也要跑步</p>
      </footer>

      {/* Global Range Input Styling */}
      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: ${isDarkMode ? '#10b981' : '#0f172a'};
          border-radius: 50%;
          border: 2px solid ${isDarkMode ? '#0f172a' : 'white'};
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>
    </main>
  );
}
