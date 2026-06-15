'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { init } from '@waline/client';
import '@waline/client/waline.css';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const PIXEL_BORDER = '3px solid';
const PIXEL_SHADOW = '4px 4px 0px';

function PixelIcon({ type, size = 16 }: { type: string; size?: number }) {
  const s = size;
  const icons: Record<string, JSX.Element> = {
    footprints: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="3" y="0" width="4" height="2" />
        <rect x="2" y="2" width="6" height="2" />
        <rect x="2" y="4" width="6" height="4" />
        <rect x="3" y="8" width="4" height="2" />
        <rect x="9" y="6" width="4" height="2" />
        <rect x="8" y="8" width="6" height="2" />
        <rect x="9" y="10" width="4" height="4" />
        <rect x="10" y="14" width="2" height="2" />
      </svg>
    ),
    lock: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="4" y="2" width="8" height="4" />
        <rect x="3" y="6" width="10" height="8" />
        <rect x="6" y="4" width="4" height="2" fill="var(--bg-primary)" />
        <rect x="7" y="8" width="2" height="4" fill="var(--bg-primary)" />
      </svg>
    ),
    user: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="5" y="1" width="6" height="6" />
        <rect x="4" y="7" width="8" height="2" />
        <rect x="3" y="9" width="10" height="6" />
        <rect x="6" y="3" width="1" height="2" fill="var(--bg-primary)" />
        <rect x="9" y="3" width="1" height="2" fill="var(--bg-primary)" />
        <rect x="6" y="5" width="4" height="1" fill="var(--bg-primary)" />
      </svg>
    ),
    refresh: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="4" y="1" width="8" height="2" />
        <rect x="2" y="3" width="4" height="2" />
        <rect x="2" y="5" width="2" height="4" />
        <rect x="4" y="9" width="8" height="2" />
        <rect x="10" y="7" width="4" height="2" />
        <rect x="12" y="3" width="2" height="4" />
        <rect x="6" y="3" width="1" height="1" />
        <rect x="9" y="12" width="1" height="1" />
      </svg>
    ),
    dice: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="14" height="14" />
        <rect x="3" y="3" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="7" y="3" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="11" y="3" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="7" y="7" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="3" y="11" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="7" y="11" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="11" y="11" width="2" height="2" fill="var(--bg-primary)" />
      </svg>
    ),
    gift: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="6" width="14" height="9" />
        <rect x="0" y="5" width="16" height="2" />
        <rect x="7" y="5" width="2" height="10" />
        <rect x="5" y="2" width="6" height="4" />
        <rect x="4" y="3" width="2" height="2" />
        <rect x="10" y="3" width="2" height="2" />
      </svg>
    ),
    info: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="14" height="14" />
        <rect x="3" y="3" width="10" height="10" fill="var(--bg-primary)" />
        <rect x="7" y="4" width="2" height="2" />
        <rect x="7" y="7" width="2" height="5" />
        <rect x="5" y="10" width="2" height="2" />
      </svg>
    ),
    mail: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="3" width="14" height="10" />
        <rect x="3" y="5" width="4" height="2" />
        <rect x="9" y="5" width="4" height="2" />
        <rect x="5" y="7" width="6" height="2" />
        <rect x="7" y="9" width="2" height="2" />
      </svg>
    ),
    chat: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="14" height="10" />
        <rect x="3" y="11" width="4" height="4" />
        <rect x="4" y="4" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="7" y="4" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="10" y="4" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="4" y="7" width="8" height="2" fill="var(--bg-primary)" />
      </svg>
    ),
    phone: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="4" y="1" width="8" height="14" />
        <rect x="5" y="3" width="6" height="8" fill="var(--bg-primary)" />
        <rect x="7" y="12" width="2" height="2" fill="var(--bg-primary)" />
      </svg>
    ),
    globe: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="7" />
        <rect x="7" y="1" width="2" height="14" fill="var(--bg-primary)" />
        <rect x="1" y="7" width="14" height="2" fill="var(--bg-primary)" />
        <rect x="3" y="3" width="10" height="10" fill="var(--bg-primary)" />
        <rect x="4" y="4" width="8" height="8" />
        <rect x="7" y="4" width="2" height="8" fill="var(--bg-primary)" />
        <rect x="4" y="7" width="8" height="2" fill="var(--bg-primary)" />
      </svg>
    ),
    sun: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="6" y="0" width="4" height="2" />
        <rect x="6" y="14" width="4" height="2" />
        <rect x="0" y="6" width="2" height="4" />
        <rect x="14" y="6" width="2" height="4" />
        <rect x="2" y="2" width="2" height="2" />
        <rect x="12" y="2" width="2" height="2" />
        <rect x="2" y="12" width="2" height="2" />
        <rect x="12" y="12" width="2" height="2" />
        <rect x="4" y="4" width="8" height="8" />
      </svg>
    ),
    moon: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="4" y="1" width="8" height="2" />
        <rect x="2" y="3" width="4" height="2" />
        <rect x="2" y="5" width="2" height="6" />
        <rect x="4" y="11" width="4" height="2" />
        <rect x="8" y="13" width="4" height="2" />
        <rect x="12" y="5" width="2" height="8" />
        <rect x="10" y="3" width="2" height="2" />
      </svg>
    ),
    history: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="2" y="1" width="12" height="14" />
        <rect x="4" y="3" width="8" height="10" fill="var(--bg-primary)" />
        <rect x="6" y="5" width="2" height="4" />
        <rect x="8" y="7" width="2" height="2" />
        <rect x="5" y="11" width="6" height="2" />
      </svg>
    ),
    check: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="12" y="2" width="2" height="2" />
        <rect x="10" y="4" width="2" height="2" />
        <rect x="8" y="6" width="2" height="2" />
        <rect x="6" y="8" width="2" height="2" />
        <rect x="4" y="6" width="2" height="2" />
        <rect x="2" y="4" width="2" height="2" />
      </svg>
    ),
    alert: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="7" y="1" width="2" height="2" />
        <rect x="5" y="3" width="6" height="2" />
        <rect x="4" y="5" width="8" height="2" />
        <rect x="3" y="7" width="10" height="2" />
        <rect x="2" y="9" width="12" height="2" />
        <rect x="1" y="11" width="14" height="4" />
        <rect x="7" y="6" width="2" height="4" fill="var(--bg-primary)" />
        <rect x="7" y="12" width="2" height="2" fill="var(--bg-primary)" />
      </svg>
    ),
    clock: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor">
        <rect x="3" y="1" width="10" height="2" />
        <rect x="1" y="3" width="2" height="10" />
        <rect x="13" y="3" width="2" height="10" />
        <rect x="3" y="13" width="10" height="2" />
        <rect x="7" y="4" width="2" height="5" />
        <rect x="9" y="7" width="2" height="2" />
        <rect x="3" y="1" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="11" y="1" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="1" y="3" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="13" y="3" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="1" y="11" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="13" y="11" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="3" y="13" width="2" height="2" fill="var(--bg-primary)" />
        <rect x="11" y="13" width="2" height="2" fill="var(--bg-primary)" />
      </svg>
    ),
  };
  return icons[type] || null;
}

function WalineComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || instanceRef.current) return;

    instanceRef.current = init({
      el: containerRef.current,
      serverURL: 'https://co.tsh520.cn',
      path: '/auto',
      dark: 'html.dark',
      lang: 'zh-CN',
    });

    return () => {
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={containerRef} />;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'update' | 'about' | 'contact' | 'auto'>('update');
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
        setHistory([]);
      }
    }
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('zepp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('zepp_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (status.type) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 4000);
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

  const tabs = [
    { id: 'update' as const, label: '步数更新', icon: 'footprints' },
    { id: 'auto' as const, label: '自动化', icon: 'clock' },
    { id: 'about' as const, label: '关于工具', icon: 'info' },
    { id: 'contact' as const, label: '讨论', icon: 'chat' },
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Noto+Sans+SC:wght@400;700;900&display=swap');

        :root {
          --bg-primary: #0c1929;
          --bg-secondary: #132744;
          --bg-card: #1a3a5c;
          --accent-pink: #38bdf8;
          --accent-cyan: #7dd3fc;
          --accent-yellow: #f0f9ff;
          --text-primary: #f0f9ff;
          --text-secondary: #94a3b8;
          --border-pixel: #38bdf8;
          --shadow-pixel: #0a1628;
        }

        html.light {
          --bg-primary: #e0f2fe;
          --bg-secondary: #bae6fd;
          --bg-card: #ffffff;
          --accent-pink: #0369a1;
          --accent-cyan: #0284c7;
          --accent-yellow: #075985;
          --text-primary: #0c4a6e;
          --text-secondary: #475569;
          --border-pixel: #0369a1;
          --shadow-pixel: #93c5fd;
        }

        * {
          image-rendering: pixelated;
        }

        body {
          font-family: 'Noto Sans SC', sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .pixel-font {
          font-family: 'Press Start 2P', cursive;
          letter-spacing: 1px;
        }

        .pixel-border {
          border: 3px solid var(--border-pixel);
          box-shadow: 4px 4px 0px var(--shadow-pixel);
        }

        .pixel-border-sm {
          border: 2px solid var(--border-pixel);
          box-shadow: 2px 2px 0px var(--shadow-pixel);
        }

        .pixel-btn {
          border: 3px solid var(--border-pixel);
          box-shadow: 4px 4px 0px var(--shadow-pixel);
          transition: all 0.1s ease;
          position: relative;
        }

        .pixel-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0px var(--shadow-pixel);
        }

        .pixel-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px var(--shadow-pixel);
        }

        .pixel-input {
          border: 3px solid var(--border-pixel);
          box-shadow: inset 2px 2px 0px rgba(0,0,0,0.2);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: 'Noto Sans SC', sans-serif;
          transition: all 0.2s ease;
        }

        .pixel-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
          box-shadow: inset 2px 2px 0px rgba(0,0,0,0.2), 0 0 0 2px var(--accent-cyan);
        }

        .pixel-input::placeholder {
          color: var(--text-secondary);
          opacity: 0.6;
        }

        .crt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 3px
          );
        }

        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9998;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bounce-in {
          animation: bounceIn 0.4s ease-out;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }

        .pixel-pulse {
          animation: pixelPulse 2s infinite;
        }

        @keyframes pixelPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .tab-active {
          background: var(--accent-pink) !important;
          color: white !important;
          border-color: var(--accent-pink) !important;
        }

        .step-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 12px;
          background: var(--bg-secondary);
          border: 2px solid var(--border-pixel);
          outline: none;
        }

        .step-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 24px;
          background: var(--accent-pink);
          border: 2px solid var(--text-primary);
          cursor: pointer;
        }

        .step-slider::-moz-range-thumb {
          width: 20px;
          height: 24px;
          background: var(--accent-pink);
          border: 2px solid var(--text-primary);
          cursor: pointer;
          border-radius: 0;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .loading-glitch {
          animation: glitch 0.3s infinite;
        }
      `}</style>

      <div>
        <div className="crt-overlay" />
        <div className="noise-overlay" />
        
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
          {/* Pixel art background pattern */}
          <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, var(--accent-pink) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />

          <div className="relative w-full max-w-[520px] slide-in">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className="pixel-border-sm px-2 py-1 bg-[var(--bg-card)]">
                  <span className="pixel-font text-[8px] text-[var(--accent-cyan)]">API v1.0</span>
                </div>
                <div className="pixel-border-sm px-2 py-1 bg-[var(--bg-card)] flex items-center gap-1">
                  <div className="w-2 h-2 bg-[var(--accent-cyan)] pixel-pulse" />
                  <span className="pixel-font text-[8px] text-[var(--accent-cyan)]">ONLINE</span>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="pixel-btn p-2 bg-[var(--bg-card)] hover:bg-[var(--accent-yellow)] hover:text-[var(--bg-primary)] transition-colors"
              >
                <PixelIcon type={isDarkMode ? 'sun' : 'moon'} size={14} />
              </button>
            </div>

            {/* Main title */}
            <div className="text-center mb-6 bounce-in">
              <h1 className="pixel-font text-[var(--accent-pink)] text-2xl md:text-3xl mb-2">
                团子也要跑步
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">
                ▸ 一键同步运动步数 ◂
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 pixel-border bg-[var(--bg-card)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center py-2.5 px-2 transition-all',
                    activeTab === tab.id ? 'tab-active pixel-font text-[9px]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  <PixelIcon type={tab.icon} size={12} />
                  <span className="ml-2 text-xs">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Card */}
            <div className="pixel-border bg-[var(--bg-card)] bounce-in">
              {activeTab === 'update' ? (
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="font-bold text-lg flex items-center gap-2">
                        <PixelIcon type="footprints" size={20} />
                        步数更新
                      </h2>
                      <p className="text-[var(--text-secondary)] text-[11px] mt-1">更新您的运动步数数据</p>
                    </div>
                    <div className="pixel-border-sm px-2 py-1 bg-[var(--bg-secondary)]">
                      <span className="pixel-font text-[7px] text-[var(--accent-cyan)] flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-[var(--accent-cyan)] pixel-pulse" />
                        就绪
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Birthday */}
                    <div className="space-y-2">
                      <label className="pixel-font text-[11px] text-[var(--accent-yellow)] flex items-center gap-1.5">
                        <PixelIcon type="gift" size={12} />
                        团子和蛋糕的生日
                      </label>
                      <input
                        type="text"
                        placeholder="使用文档中有写"
                        maxLength={4}
                        className="pixel-input w-full px-4 py-3 text-sm"
                        value={birthday}
                        onChange={(e) => handleBirthdayChange(e.target.value)}
                        required
                      />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label className="pixel-font text-[11px] text-[var(--accent-yellow)] flex items-center gap-1.5">
                        <PixelIcon type="user" size={12} />
                        账号
                      </label>
                      <input
                        type="text"
                        placeholder="请输入账号"
                        className="pixel-input w-full px-4 py-3 text-sm"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="pixel-font text-[11px] text-[var(--accent-yellow)] flex items-center gap-1.5">
                        <PixelIcon type="lock" size={12} />
                        密码
                      </label>
                      <input
                        type="password"
                        placeholder="请输入密码"
                        className="pixel-input w-full px-4 py-3 text-sm"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                      />
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="pixel-font text-[11px] text-[var(--accent-yellow)] flex items-center gap-1.5">
                          <PixelIcon type="footprints" size={12} />
                          步数
                        </label>
                        <div className="pixel-border-sm px-1 py-1 bg-[var(--bg-secondary)]">
                          <input
                            type="number"
                            value={steps}
                            onChange={(e) => handleStepsChange(Number(e.target.value))}
                            className="w-24 text-right bg-transparent border-none p-0 focus:ring-0 text-sm font-bold pixel-font text-[10px]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[10000, 20000, 30000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleStepsChange(val)}
                            className={cn(
                              'pixel-btn px-3 py-1.5 text-[10px] font-bold transition-all',
                              steps === val
                                ? 'bg-[var(--accent-pink)] text-white'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            )}
                          >
                            {val / 1000}K
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={setRandomSteps}
                          className="pixel-btn px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[10px] font-bold flex items-center gap-1"
                        >
                          <PixelIcon type="dice" size={10} />
                          随机
                        </button>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="98800"
                        value={steps}
                        onChange={(e) => handleStepsChange(Number(e.target.value))}
                        className="step-slider w-full cursor-pointer"
                      />
                      <div className="flex justify-between pixel-font text-[7px] text-[var(--text-secondary)]">
                        <span>1</span>
                        <span>98,800</span>
                      </div>
                    </div>

                    {/* Status */}
                    {status.type && (
                      <div
                        className={cn(
                          'flex items-center p-3 pixel-border-sm text-[11px] font-medium slide-in',
                          status.type === 'success'
                            ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border-[var(--accent-cyan)]'
                            : 'bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] border-[var(--accent-pink)]'
                        )}
                      >
                        <PixelIcon type={status.type === 'success' ? 'check' : 'alert'} size={14} />
                        <span className="ml-2">{status.message}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        'pixel-btn w-full font-bold py-3.5 text-sm flex items-center justify-center gap-2 transition-all',
                        'bg-[var(--accent-pink)] text-white hover:bg-[var(--accent-yellow)] hover:text-[var(--bg-primary)]',
                        loading && 'loading-glitch opacity-70'
                      )}
                    >
                      <span className={loading ? 'animate-spin' : ''}>
                        <PixelIcon type="refresh" size={14} />
                      </span>
                      <span className="pixel-font text-[10px]">{loading ? '同步中...' : '动动吧'}</span>
                    </button>

                    {/* History */}
                    {history.length > 0 && (
                      <div className="pt-5 border-t-2 border-[var(--border-pixel)]">
                        <div className="pixel-font text-[8px] text-[var(--accent-yellow)] flex items-center gap-1.5 mb-3">
                          <PixelIcon type="history" size={10} />
                          最近同步
                        </div>
                        <div className="space-y-2">
                          {history.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-2 pixel-border-sm bg-[var(--bg-secondary)] text-[10px]"
                            >
                              <span className="text-[var(--text-secondary)]">{item.date}</span>
                              <span className="pixel-font text-[9px] text-[var(--accent-cyan)]">
                                {item.steps.toLocaleString()} 步
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              ) : activeTab === 'auto' ? (
                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                  <div className="flex items-center gap-3">
                    <div className="pixel-border-sm p-2 bg-[var(--bg-secondary)]">
                      <PixelIcon type="clock" size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">自动化刷步数</h2>
                      <p className="text-[var(--text-secondary)] text-[11px]">无需每天手动操作，自动同步步数</p>
                    </div>
                  </div>

                  <div className="pixel-border-sm p-4 bg-[var(--bg-secondary)] space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">服务说明</h3>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      本服务可以帮您实现每日自动刷步数，无需每天手动操作。只需提供一次账号密码，即可享受持续的自动同步服务。
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">开通方式（任选其一）</h3>
                    <div className="space-y-3">
                      <div className="pixel-border-sm p-3 bg-[var(--bg-secondary)]">
                        <div className="flex items-start gap-2">
                          <span className="pixel-font text-[8px] text-[var(--accent-pink)] mt-0.5">1.</span>
                          <div>
                            <p className="text-xs font-bold mb-1">邮件发送账号密码</p>
                            <p className="text-[var(--text-secondary)] text-xs">
                              将您的 Zepp Life（Zepp）账号和密码发送至邮箱：
                            </p>
                            <button
                              onClick={() => window.location.href = 'mailto:3109581507@qq.com?subject=申请自动刷步数服务&body=账号：%0A密码：%0A每日目标步数：'}
                              className="pixel-btn mt-2 px-3 py-1.5 bg-[var(--bg-card)] text-[var(--accent-cyan)] hover:text-[var(--accent-yellow)] text-[10px] font-bold"
                            >
                              发送邮件至 3109581507@qq.com →
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pixel-border-sm p-3 bg-[var(--bg-secondary)]">
                        <div className="flex items-start gap-2">
                          <span className="pixel-font text-[8px] text-[var(--accent-pink)] mt-0.5">2.</span>
                          <div>
                            <p className="text-xs font-bold mb-1">在下方评论区留言</p>
                            <p className="text-[var(--text-secondary)] text-xs">
                              在本页下方的评论区留下您的联系方式，留言时请填写昵称和正确的邮箱，我会主动联系您。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pixel-border-sm p-3 bg-[var(--bg-secondary)]">
                        <div className="flex items-start gap-2">
                          <span className="pixel-font text-[8px] text-[var(--accent-pink)] mt-0.5">3.</span>
                          <div>
                            <p className="text-xs font-bold mb-1">赞助 5 元</p>
                            <p className="text-[var(--text-secondary)] text-xs">
                              通过下方链接赞助 5 元，并附上您的账号信息。
                            </p>
                            <button
                              onClick={() => window.open('https://blog.tsh520.cn/sponsor/', '_blank')}
                              className="pixel-btn mt-2 px-3 py-1.5 bg-[var(--bg-card)] text-[var(--accent-cyan)] hover:text-[var(--accent-yellow)] text-[10px] font-bold"
                            >
                              前往赞助页面 →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pixel-border-sm p-4 bg-[var(--bg-secondary)]">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)] mb-2">服务承诺</h3>
                    <ul className="space-y-1.5 text-[var(--text-secondary)] text-xs">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent-pink)]">▸</span>
                        <span>账号信息仅用于自动刷步数，不会泄露给第三方</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent-pink)]">▸</span>
                        <span>每日自动同步，步数随机生成，避免被检测</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent-pink)]">▸</span>
                        <span>如遇问题可随时联系处理</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">评论区</h3>
                    <p className="text-[var(--text-secondary)] text-xs">
                      如有问题或想开通服务，可在下方留言：
                    </p>
                    <div id="waline-container" className="pixel-border-sm bg-[var(--bg-secondary)] p-2 min-h-[200px]">
                      <WalineComponent />
                    </div>
                  </div>
                </div>
              ) : activeTab === 'contact' ? (
                <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="flex items-center gap-3">
                    <div className="pixel-border-sm p-2 bg-[var(--bg-secondary)]">
                      <PixelIcon type="chat" size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">讨论</h2>
                      <p className="text-[var(--text-secondary)] text-[11px]">加入群聊，交流讨论</p>
                    </div>
                  </div>

                  <div className="pixel-border-sm p-4 bg-[var(--bg-secondary)] space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">QQ 群</h3>
                    <p className="text-[var(--text-secondary)] text-xs">
                      扫描下方二维码加入 QQ 群，与其他用户交流讨论。
                    </p>
                    <div className="flex justify-center py-4">
                      <img
                        src="/qrcode.jpg"
                        alt="QQ群二维码"
                        className="pixel-border-sm max-w-[200px] h-auto"
                      />
                    </div>
                  </div>

                  <div className="pixel-border-sm p-3 bg-[var(--bg-secondary)]">
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      欢迎在群内提出建议、反馈问题或分享使用心得。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="flex items-center gap-3">
                    <div className="pixel-border-sm p-2 bg-[var(--bg-secondary)]">
                      <PixelIcon type="info" size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">关于 团子也要跑步</h2>
                      <p className="text-[var(--text-secondary)] text-[11px]">工具说明与使用方法</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">功能介绍</h3>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      本工具用于更新您的运动应用中的步数数据，通过API接口直接提交您的Zepp Life（Zepp）账号、密码和目标步数。
                    </p>
                    <button
                      onClick={() => window.open('https://blog.tsh520.cn/posts/技术分享/zepplife刷步数全教程/', '_blank')}
                      className="pixel-btn px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--accent-cyan)] hover:text-[var(--accent-yellow)] text-[10px] font-bold"
                    >
                      查看使用文档 →
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">使用方法</h3>
                    <ol className="space-y-2 text-[var(--text-secondary)] text-xs">
                      {['输入生日（详见使用文档）', '输入您的Zepp Life（Zepp）账号密码', '通过输入框或滑块设置目标步数', '点击"动动吧"按钮提交'].map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="pixel-font text-[8px] text-[var(--accent-pink)] mt-0.5">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">服务指标</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="pixel-border-sm p-3 bg-[var(--bg-secondary)]">
                        <div className="pixel-font text-[7px] text-[var(--accent-cyan)] mb-1">可用性</div>
                        <div className="font-bold">99.9%</div>
                      </div>
                      <div className="pixel-border-sm p-3 bg-[var(--bg-secondary)]">
                        <div className="pixel-font text-[7px] text-[var(--accent-cyan)] mb-1">响应时间</div>
                        <div className="font-bold">≤ 2秒</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t-2 border-[var(--border-pixel)]">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">注意事项</h3>
                    <ul className="space-y-2 text-[var(--text-secondary)] text-xs">
                      {['本工具仅用于学习和测试用途', '请不要设置过高的步数，以免被系统判定为异常数据', '账号信息仅保存在本地浏览器，请放心使用'].map((note, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[var(--accent-pink)]">▸</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="pixel-font text-[9px] text-[var(--accent-yellow)]">免责声明</h3>
                    <p className="text-[var(--text-secondary)] text-[10px] leading-relaxed">
                      本工具仅供学习交流使用，使用本工具所产生的一切后果由用户自行承担。使用者应遵守相关法律法规，不得将本工具用于任何非法用途。开发者不对因使用本工具而导致的任何直接或间接损失负责。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="mt-6 text-center">
              <p className="pixel-font text-[7px] text-[var(--text-secondary)]">
                © 2026 团子也要跑步
              </p>
              <p className="text-[var(--text-secondary)] text-[10px] mt-1">
                ▃▄▅▆▇█ 像素风格 █▇▆▅▄▃
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
