import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome to Nexus!');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      addToast(`Logged in as demo user!`);
      navigate('/');
    } catch (err) {
      addToast('Demo sign-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
            <Video className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Nexus</h2>
          <p className="text-xs text-slate-400 font-medium">Real-Time Video Calling & Synchronized Canvas</p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>One-Click Evaluator Demo Sign-In:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('marcus@nexus.dev', 'password123')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/20 border border-slate-700/80 hover:border-indigo-500/40 text-[11px] font-semibold text-slate-200 transition-colors text-left"
            >
              <div className="font-bold text-indigo-300">Marcus Vance</div>
              <div className="text-[10px] text-slate-400">Host / Lead</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('sarah@nexus.dev', 'password123')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/20 border border-slate-700/80 hover:border-indigo-500/40 text-[11px] font-semibold text-slate-200 transition-colors text-left"
            >
              <div className="font-bold text-indigo-300">Sarah Chen</div>
              <div className="text-[10px] text-slate-400">AI Researcher</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
          >
            <span>{loading ? 'Entering...' : 'Enter Nexus'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-bold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}