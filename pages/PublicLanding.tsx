
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, FileText, Lock, Search, CheckCircle, Globe, ChevronRight, AlertCircle } from 'lucide-react';
import { ORG_NAME, APP_NAME, ORG_FULL_NAME, COPYRIGHT_YEAR } from '../constants';
import { getLetterByNumber } from '../services/letterStore';

const PublicLanding: React.FC = () => {
  const navigate = useNavigate();
  const [verifyId, setVerifyId] = useState('');
  const [error, setError] = useState(false);

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyId.trim()) {
      const exists = getLetterByNumber(verifyId);
      if (exists) {
        navigate(`/verify/${encodeURIComponent(verifyId.trim())}`);
      } else {
        setError(true);
        setTimeout(() => setError(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="h-20 border-b border-slate-100 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
            <FileText size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">{ORG_NAME}</span>
        </div>
        <Link to="/login" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/10">
          <Lock size={16} /> Admin Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Official Verification Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Transparansi <br /> 
            <span className="text-orange-600">Administrasi</span> Digital.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
            Sistem persuratan resmi {ORG_FULL_NAME} yang menjamin otentisitas dokumen melalui verifikasi nomor surat terpadu.
          </p>
          
          <div className="space-y-4">
            <form onSubmit={handleQuickVerify} className="relative max-w-md group">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-orange-600'}`} size={20} />
              <input 
                type="text" 
                placeholder="Masukkan Nomor Surat Resmi..."
                className={`w-full pl-14 pr-32 py-5 bg-slate-50 border rounded-[24px] outline-none transition-all text-sm font-bold shadow-sm ${error ? 'border-red-500 ring-4 ring-red-100 animate-shake' : 'border-slate-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-600'}`}
                value={verifyId}
                onChange={(e) => {setVerifyId(e.target.value); setError(false);}}
              />
              <button 
                type="submit"
                className="absolute right-2.5 top-2.5 bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
              >
                Cek Validasi
              </button>
            </form>
            {error && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} /> Nomor surat tidak ditemukan dalam arsip resmi.
              </p>
            )}
          </div>
        </div>

        <div className="relative animate-in zoom-in duration-1000">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="bg-slate-50 rounded-[48px] p-8 border border-slate-100 shadow-2xl relative overflow-hidden group">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <CheckCircle className="text-green-500" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Trust Score</p>
                      <p className="font-bold text-slate-900">100% Authenticated</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300" />
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Arsip</p>
                      <p className="text-xl font-black text-slate-900">Valid & Secure</p>
                   </div>
                   <div className="bg-white p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mekanisme</p>
                      <p className="text-xl font-black text-slate-900">Real-time</p>
                   </div>
                </div>
                <div className="p-6 bg-slate-900 rounded-3xl text-white">
                   <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2">Security Protocol</p>
                   <p className="text-[10px] font-mono opacity-50 break-all leading-relaxed">SISTEM-VALIDASI-E-SURAT-AYS-INDONESIA-SECURE-2026</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-slate-50 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <FileText size={16} />
              </div>
              <span className="font-black uppercase italic tracking-tighter text-slate-900">{ORG_NAME}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs">
              Membangun integritas melalui teknologi administrasi yang transparan dan akuntabel bagi seluruh pemangku kepentingan.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Navigasi</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-600">
              <li><Link to="/login" className="hover:text-orange-600 transition-colors">Masuk Petugas</Link></li>
              <li><Link to="/" className="hover:text-orange-600 transition-colors">Cara Verifikasi</Link></li>
              <li><a href={`https://${ORG_NAME.toLowerCase()}.id`} target="_blank" className="hover:text-orange-600 transition-colors">Website Utama</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Keamanan Dokumen</h4>
            <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase">
              <ShieldCheck size={16} /> QR-Verified SHA-256 System
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 pt-10 border-t border-slate-200/50 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">© {COPYRIGHT_YEAR} {APP_NAME} | Developed by {ORG_NAME}</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
