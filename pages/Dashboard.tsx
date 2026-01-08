
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, Send, CheckCircle, Clock, Archive as ArchiveIcon, Plus, Hash, X, Info, User, AlignLeft, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLetters, saveLetter, getNextNumber } from '../services/letterStore';
import { getCurrentUser } from '../services/userStore';
import { getDivisions, getLetterTemplates } from '../services/masterDataStore';
import { draftLetterContent } from '../services/geminiService';
import { ORG_NAME, DEFAULT_SIGNER, DEFAULT_ROLE } from '../constants';
import { LetterType, Letter } from '../types';

const Dashboard: React.FC = () => {
  const letters = getLetters();
  const user = getCurrentUser();
  
  const [dynamicDivs, setDynamicDivs] = useState(getDivisions());
  const [dynamicTemplates, setDynamicTemplates] = useState(getLetterTemplates());

  const [showQuickNumber, setShowQuickNumber] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(dynamicTemplates[0]?.id || '01');
  const [selectedDiv, setSelectedDiv] = useState(dynamicDivs[0]?.code || 'DIV');
  
  const [quickTitle, setQuickTitle] = useState('');
  const [quickRecipient, setQuickRecipient] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [generatedNumber, setGeneratedNumber] = useState<string | null>(null);

  useEffect(() => {
    setDynamicDivs(getDivisions());
    setDynamicTemplates(getLetterTemplates());
  }, []);

  const handleAIComposeQuick = async () => {
    if (!quickTitle) {
      alert("Harap isi Perihal/Judul surat terlebih dahulu agar AI memahami konteks.");
      return;
    }
    setLoadingAI(true);
    const result = await draftLetterContent(selectedType, quickTitle);
    setQuickContent(result || '');
    setLoadingAI(false);
  };

  const handleCopyNumber = () => {
    if (generatedNumber) {
      navigator.clipboard.writeText(generatedNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGetNumber = () => {
    const num = getNextNumber(selectedType, selectedDiv);
    setGeneratedNumber(num);
    
    const newRecord: Letter = {
      id: Math.random().toString(36).substr(2, 9),
      number: num,
      type: selectedType as LetterType,
      divisionCode: selectedDiv,
      title: quickTitle.trim() || `(Reservasi Nomor - ${selectedType})`,
      date: new Date().toISOString().split('T')[0],
      sender: ORG_NAME,
      recipient: quickRecipient.trim() || "(Penerima Belum Ditentukan)",
      content: quickContent.trim() || "Nomor ini telah direservasi melalui sistem Ambil Nomor Cepat.",
      attachmentCount: 0,
      signedBy: DEFAULT_SIGNER,
      signedRole: DEFAULT_ROLE,
      qrCodeUrl: '', 
      createdAt: new Date().toISOString(),
      isNumberOnly: quickContent.trim() === ''
    };
    saveLetter(newRecord);
  };

  const resetQuickForm = () => {
    setShowQuickNumber(false);
    setGeneratedNumber(null);
    setQuickTitle('');
    setQuickRecipient('');
    setQuickContent('');
    setCopied(false);
  };

  const stats = [
    { name: 'Total Arsip', value: letters.length, icon: ArchiveIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Surat Terbit', value: letters.filter(l => !l.isNumberOnly).length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Bulan Ini', value: letters.filter(l => new Date(l.date).getMonth() === new Date().getMonth()).length, icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Menunggu', value: 0, icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50' },
  ];

  const chartData = dynamicTemplates.map(t => ({
    name: t.id,
    total: letters.filter(l => l.type === t.id).length
  })).filter(d => d.total > 0);

  const displayData = chartData.length > 0 ? chartData : [{ name: 'N/A', total: 0 }];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quick Number Modal */}
      {showQuickNumber && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 my-auto">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-600/20">
                  <Hash size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Ambil Nomor Cepat</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gunakan untuk reservasi nomor secara instan</p>
                </div>
              </div>
              <button onClick={resetQuickForm} className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {!generatedNumber ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FileText size={12} /> Jenis Surat
                      </label>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        {dynamicTemplates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Info size={12} /> Divisi Pengirim
                      </label>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                        value={selectedDiv}
                        onChange={(e) => setSelectedDiv(e.target.value)}
                      >
                        {dynamicDivs.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <AlignLeft size={12} /> Perihal <span className="text-slate-300 font-normal ml-1">(Opsional)</span>
                    </label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                      placeholder="Contoh: Undangan Kerjasama Riset..."
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <User size={12} /> Tujuan <span className="text-slate-300 font-normal ml-1">(Opsional)</span>
                    </label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                      placeholder="Contoh: Kepala Dinas Pemuda dan Olahraga..."
                      value={quickRecipient}
                      onChange={(e) => setQuickRecipient(e.target.value)}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                    <Info size={18} className="text-blue-600 mt-0.5" />
                    <p className="text-[11px] text-blue-800 leading-relaxed">Penerbitan nomor instan. Anda dapat melengkapi konten surat nanti melalui menu Arsip Surat.</p>
                  </div>

                  <button 
                    onClick={handleGetNumber}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-[20px] shadow-xl hover:bg-orange-600 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Terbitkan Nomor Sekarang
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-8 py-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <CheckCircle size={48} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Nomor Surat Berhasil Terbit</p>
                    <div className="relative group">
                      <h4 className="text-3xl font-black text-slate-900 font-mono tracking-tight break-all border-y border-slate-100 py-8 px-4 bg-slate-50/50">
                        {generatedNumber}
                      </h4>
                      <button 
                        onClick={handleCopyNumber}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest ${copied ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:text-orange-600 shadow-sm border border-slate-200'}`}
                      >
                        {copied ? <><Check size={16} /> Tersalin</> : <><Copy size={16} /> Salin Nomor</>}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={resetQuickForm}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                    >
                      Selesai
                    </button>
                    <Link 
                      to="/archive"
                      className="flex-1 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                    >
                      Buka Arsip <Plus size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Halo, {user?.name || 'Administrator'}
            <span className="text-[10px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase font-black tracking-widest">{user?.role}</span>
          </h1>
          <p className="text-slate-500 text-sm">Monitor seluruh aktivitas administrasi digital.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowQuickNumber(true)}
            className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm text-sm"
          >
            <Hash size={20} className="text-orange-500" /> Ambil Nomor Cepat
          </button>
          <Link 
            to="/create" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95 text-sm"
          >
            <Plus size={20} /> Buat Surat Baru
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            Volume Distribusi Surat
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}}
                />
                <Bar dataKey="total" radius={[12, 12, 0, 0]}>
                  {displayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#f97316', '#3b82f6', '#10b981', '#6366f1'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Arsip Terbaru</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 no-scrollbar">
            {letters.slice(-6).reverse().map((letter) => (
              <div key={letter.id} className="flex gap-4 group cursor-default items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${letter.isNumberOnly ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                  {letter.isNumberOnly ? <Hash size={18} /> : <FileText size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 line-clamp-1 leading-tight mb-1">{letter.title}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{letter.number}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/archive" className="mt-8 text-center text-[10px] font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest border-t border-slate-50 pt-6">
            Eksplorasi Arsip Lengkap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
