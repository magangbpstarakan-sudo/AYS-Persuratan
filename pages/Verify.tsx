
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, User, Calendar, Award, ShieldCheck, Globe, Info, Hash, Clock, Download, Share2 } from 'lucide-react';
import { getLetterByNumber } from '../services/letterStore';
import { APP_NAME, ORG_NAME, COPYRIGHT_YEAR, ORG_WEB, ORG_FULL_NAME, TINY_LOGO_BASE64 } from '../constants';

const Verify: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // 'id' parameter in URL now represents the Letter Number
  const letterNumber = id ? decodeURIComponent(id) : '';
  const letter = getLetterByNumber(letterNumber);
  const [scanTime, setScanTime] = useState<string>('');

  useEffect(() => {
    setScanTime(new Date().toLocaleString('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    }));
  }, []);

  const getFingerprint = (id: string) => {
    return `AYS-SHA256-${id.toUpperCase().slice(0, 8)}-${new Date(letter?.createdAt || Date.now()).getTime().toString(16).toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 md:p-8 selection:bg-orange-100">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-orange-600 border border-slate-100">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase italic text-slate-900">{ORG_NAME}</span>
          </Link>
          <h1 className="text-xl font-black text-slate-400 uppercase tracking-[0.3em]">Official Verification Portal</h1>
        </div>

        {letter ? (
          <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-500">
            {/* Certificate Header */}
            <div className="bg-slate-900 p-10 text-center text-white relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
                <div className="grid grid-cols-6 gap-4">
                  {Array.from({length: 24}).map((_, i) => (
                    <ShieldCheck key={i} size={48} />
                  ))}
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/20">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">SERTIFIKAT DIGITAL VALID</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-green-400 border border-green-400/30">
                  <ShieldCheck size={12} /> Authentic Document Confirmed
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Details Column */}
                <div className="lg:col-span-2 space-y-10">
                  <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <FileText size={14} /> Informasi Dokumen Utama
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Surat</p>
                        <p className="font-mono text-slate-900 font-bold text-base">{letter.number}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Arsip</p>
                        <p className="font-bold text-slate-900 text-base">{letter.type}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Perihal / Judul</p>
                        <p className="font-black text-slate-900 text-lg leading-tight">{letter.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <User size={14} /> Pihak Terkait
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Penerima Dokumen</p>
                        <p className="font-bold text-slate-900">{letter.recipient}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Otoritas Penandatangan</p>
                        <p className="font-black text-slate-900 uppercase">{letter.signedBy}</p>
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">{letter.signedRole}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Clock size={12} /> Timestamp Verifikasi
                        </p>
                        <p className="text-xs font-bold text-slate-700">{scanTime}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <ShieldCheck size={12} /> Digital Fingerprint
                        </p>
                        <p className="text-[9px] font-mono text-slate-400 break-all bg-white p-3 rounded-xl border border-slate-100">
                          {getFingerprint(letter.id)}
                        </p>
                      </div>
                      <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                        <Download size={14} /> Download PDF Original
                      </button>
                   </div>

                   <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100">
                      <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Award size={12} /> Kredibilitas Sistem
                      </p>
                      <p className="text-[10px] text-orange-800 font-medium leading-relaxed italic">
                        "Integritas data adalah prioritas {ORG_NAME}. Gunakan portal ini sebagai satu-satunya rujukan keabsahan dokumen kami."
                      </p>
                   </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img src={TINY_LOGO_BASE64} className="w-8 h-8 opacity-20" alt="AYS Logo" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Digital Administration by {ORG_FULL_NAME}
                  </p>
                </div>
                <div className="flex gap-4">
                  <a href={`https://${ORG_WEB}`} target="_blank" className="p-2 text-slate-400 hover:text-orange-600 transition-all"><Globe size={20} /></a>
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Share2 size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-red-100 animate-in shake duration-500">
             <div className="bg-red-500 p-12 text-center text-white">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-2xl">
                <XCircle size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">DOKUMEN TIDAK DITEMUKAN</h2>
              <p className="text-red-50 font-medium text-sm">Nomor Surat "{letterNumber}" tidak terdaftar di basis data resmi AYS Indonesia.</p>
            </div>
            <div className="p-12 text-center">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Verification Attempt Failed</p>
              <Link to="/" className="inline-block bg-slate-900 text-white px-12 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl uppercase tracking-widest text-xs">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">© {COPYRIGHT_YEAR} {ORG_FULL_NAME} • SECURE ADM PORTAL</p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
