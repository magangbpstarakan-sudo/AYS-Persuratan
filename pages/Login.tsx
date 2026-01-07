
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, FileText, AlertCircle, ArrowRight, ArrowLeft, Globe } from 'lucide-react';
import { ORG_NAME, COPYRIGHT_YEAR, APP_NAME } from '../constants';
import { getUsers } from '../services/userStore';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_auth_user', JSON.stringify(foundUser));
      navigate('/dashboard');
    } else {
      setError('Username atau Password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-all font-black text-[10px] uppercase tracking-widest">
            <Globe size={14} /> Ke Portal Publik
          </Link>
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Secure Access</p>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600 rounded-2xl shadow-xl shadow-orange-900/20 mb-6">
            <FileText size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{ORG_NAME}</h1>
          <p className="text-slate-400 font-medium">Panel Administrasi Internal</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-[40px] shadow-2xl border border-slate-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-600"
                  placeholder="Username admin..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              Masuk Dashboard <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-4">Butuh akses?</p>
            <Link 
              to="/register" 
              className="inline-block text-orange-500 font-bold hover:text-orange-400 transition-colors"
            >
              Daftar Akun Petugas
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; {COPYRIGHT_YEAR} {APP_NAME}
        </p>
      </div>
    </div>
  );
};

export default Login;
