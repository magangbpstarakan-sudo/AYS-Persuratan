
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Layers, Briefcase, Info, AlertCircle } from 'lucide-react';
import { getDivisions, saveDivision, deleteDivision, getLetterTemplates, saveLetterTemplate, deleteLetterTemplate } from '../services/masterDataStore';
import { Division, LetterTemplate, LetterType } from '../types';

const MasterData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'types' | 'divisions'>('types');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form States
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setDivisions(getDivisions());
    setTemplates(getLetterTemplates());
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormCode('');
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCode(item.id || item.code);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      if (activeTab === 'types') deleteLetterTemplate(id);
      else deleteDivision(id);
      refreshData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'types') {
      saveLetterTemplate({
        id: (formCode as LetterType),
        name: formName,
        code: formCode,
        fields: []
      });
    } else {
      saveDivision({
        name: formName,
        code: formCode
      });
    }
    setShowModal(false);
    refreshData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data Master</h1>
          <p className="text-slate-500 text-sm">Kelola parameter Jenis Surat dan struktur Divisi.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Tambah {activeTab === 'types' ? 'Jenis Surat' : 'Divisi'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button 
          onClick={() => setActiveTab('types')}
          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'types' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Layers size={18} /> Jenis Surat
        </button>
        <button 
          onClick={() => setActiveTab('divisions')}
          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'divisions' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Briefcase size={18} /> Daftar Divisi
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-5">No.</th>
              <th className="px-8 py-5">Nama {activeTab === 'types' ? 'Jenis' : 'Divisi'}</th>
              <th className="px-8 py-5">Kode Identitas</th>
              <th className="px-8 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(activeTab === 'types' ? templates : divisions).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-5 text-xs font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</td>
                <td className="px-8 py-5">
                  <span className="font-bold text-slate-900">{item.name}</span>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black font-mono">
                    {activeTab === 'types' ? (item as LetterTemplate).id : (item as Division).code}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(activeTab === 'types' ? (item as LetterTemplate).id : (item as Division).code)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
        <Info className="text-blue-600 flex-shrink-0" size={24} />
        <div className="space-y-1">
          <h4 className="font-bold text-blue-900 text-sm">Penting untuk Penomoran</h4>
          <p className="text-xs text-blue-800 leading-relaxed">
            Perubahan kode pada Jenis Surat atau Divisi akan mempengaruhi format nomor surat yang akan diterbitkan selanjutnya. Gunakan kode yang unik dan konsisten sesuai standar organisasi.
          </p>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900">
                {editingItem ? 'Edit' : 'Tambah'} {activeTab === 'types' ? 'Jenis Surat' : 'Divisi'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama {activeTab === 'types' ? 'Jenis' : 'Divisi'}</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                  placeholder={activeTab === 'types' ? "Contoh: Surat Tugas" : "Contoh: Keuangan"}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kode Identitas (Unique)</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-mono"
                  placeholder={activeTab === 'types' ? "Contoh: 08" : "Contoh: KEU"}
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  disabled={editingItem !== null}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
              >
                <Save size={18} className="inline mr-2" /> Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
