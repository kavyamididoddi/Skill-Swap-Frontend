import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, LogIn, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || import.meta.env.DEV;

  const demoAccounts = [
    { name: 'Alex Chen', email: 'alex@skillswap.edu', dept: 'CS • React & Java', avatar: 'Alex' },
    { name: 'Sophia Martinez', email: 'sophia@skillswap.edu', dept: 'Design • UI/UX & Figma', avatar: 'Sophia' },
    { name: 'Rahul Sharma', email: 'rahul@skillswap.edu', dept: 'IT • Python & SQL', avatar: 'Rahul' },
    { name: 'Elena Rossi', email: 'elena@skillswap.edu', dept: 'Languages • Spanish', avatar: 'Elena' },
  ];

  const handleQuickDemo = async (demoEmail) => {
    if (!isDemoMode) return;
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError('');
    try {
      await login(demoEmail, 'password123');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to SkillSwap
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              create a new student profile
            </Link>
          </p>
        </div>

        {/* Quick Demo Login Cards */}
        {isDemoMode && (
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-4 rounded-2xl border border-indigo-100 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick 1-Click Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemo(acc.email)}
                  disabled={loading}
                  className="text-left p-2.5 rounded-xl bg-white border border-indigo-100/80 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center space-x-2.5 group"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.avatar}`}
                    alt={acc.name}
                    className="w-7 h-7 rounded-full bg-slate-100 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{acc.dept}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Standard Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@skillswap.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50 mt-2"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
