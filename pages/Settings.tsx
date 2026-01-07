
import React, { useState, useEffect } from 'react';
import { Upload, Trash2, CheckCircle, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { BrandingAssets } from '../types';
import { getBrandingAssets, saveBrandingAssets } from '../services/assetStore';
import { DEFAULT_HEADER_SVG, DEFAULT_FOOTER_SVG, DEFAULT_WATERMARK_SVG } from '../constants';

const Settings: React.FC = () => {
  const [assets, setAssets] = useState<BrandingAssets>(getBrandingAssets());
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleUpload = (type: keyof BrandingAssets, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAssets(prev => ({ ...prev, [type]: event.target?.result as string }));
        setSaveStatus(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveBrandingAssets(assets);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm("Reset branding ke desain standar AYS Indonesia?")) {
      const defaults = {
        header: DEFAULT_HEADER_SVG,
        footer: DEFAULT_FOOTER_SVG,
        watermark: DEFAULT_WATERMARK_SVG
      };
      setAssets(defaults);
      saveBrandingAssets(defaults);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleRemove = (type: keyof BrandingAssets) => {
    setAssets(prev => ({ ...prev, [type]: null }));
    setSaveStatus(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan Branding</h1>
          <p className="text-slate-500 text-sm">Sesuaikan identitas resmi AYS Indonesia.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleResetToDefault}
            className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={20} /> Reset Default
          </button>
          <button 
            onClick={handleSave}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
          >
            {saveStatus === 'success' ? <><CheckCircle size={20} /> Tersimpan</> : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Header Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Header Surat</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Utama (Default Aktif)</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {assets.header ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-100">
                <img src={assets.header} alt="Header Preview" className="w-full object-contain max-h-48" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => handleRemove('header')} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-orange-200 transition-all group">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload('header', e)} />
                <Upload className="text-slate-300 group-hover:text-orange-500 mb-4" size={40} />
                <span className="text-xs font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-widest text-center">
                  Ganti Header Kustom
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Footer Surat</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Informasi Kontak</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {assets.footer ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-100">
                <img src={assets.footer} alt="Footer Preview" className="w-full object-contain max-h-48" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => handleRemove('footer')} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-orange-200 transition-all group">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload('footer', e)} />
                <Upload className="text-slate-300 group-hover:text-orange-500 mb-4" size={40} />
                <span className="text-xs font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-widest text-center">
                  Ganti Footer Kustom
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Watermark Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Watermark Tengah</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Logo Keaslian</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {assets.watermark ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-8">
                <img src={assets.watermark} alt="Watermark Preview" className="max-h-48 object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => handleRemove('watermark')} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-orange-200 transition-all group">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload('watermark', e)} />
                <Upload className="text-slate-300 group-hover:text-orange-500 mb-4" size={40} />
                <span className="text-xs font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-widest text-center">
                  Ganti Watermark Kustom
                </span>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
        <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-blue-900">Informasi Branding Permanen</h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            Sistem ini kini dilengkapi dengan desain branding permanen **AYS Indonesia**. Meskipun Anda tidak mengunggah gambar apa pun atau membersihkan cache browser, surat akan tetap muncul dengan Header, Footer, dan Watermark resmi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
