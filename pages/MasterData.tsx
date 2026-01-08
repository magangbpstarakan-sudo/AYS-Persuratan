
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Layers, Briefcase, Info, Hash, RefreshCw, AlertTriangle, Settings2 } from 'lucide-react';
import { getDivisions, saveDivision, deleteDivision, getLetterTemplates, saveLetterTemplate, deleteLetterTemplate } from '../services/masterDataStore';
import { getAllCounters, updateCounter, getGlobalSequence } from '../services/letterStore';
import { Division, LetterTemplate, LetterType } from '../types';

const MasterData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'types' | 'divisions' | 'counters'>('types');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [globalSeq, setGlobalSeq] = useState<number>(0);
  
  const [showModal, setShowModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form States
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [targetCounterType, setTargetCounterType] = useState('');
  const [counterValue, setCounterValue] = useState<number>(0);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setDivisions(getDivisions());
    setTemplates(getLetterTemplates());
    setCounters(getAllCounters());
    setGlobalSeq(getGlobalSequence());
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

  const handleEditCounter = (type: string, current: number) => {
    setTargetCounterType(type);
    setCounterValue(current);
    setShowCounterModal(true);
  };

  const handleSaveCounter = (e: React.FormEvent) => {
    e.preventDefault();
    updateCounter(targetCounterType, counterValue);
    setShowCounterModal(false);
    refreshData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data Master</h1>
          <p className="text-slate-500 text-sm">Kelola parameter Jenis Surat, Struktur Divisi, dan Sinkronisasi Nomor.</p>
        </div>
        {activeTab !== 'counters' && (
          <button 
            onClick={handleOpenAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Tambah {activeTab === 'types' ? 'Jenis Surat' : 'Divisi'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('types')}
          className={`px-6 md:px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'types' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Layers size={18} /> Jenis Surat
        </button>
        <button 
          onClick={() => setActiveTab('divisions')}
          className={`px-6 md:px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'divisions' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Briefcase size={18} /> Daftar Divisi
        </button>
        <button 
          onClick={() => setActiveTab('counters')}
          className={`px-6 md:px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'counters' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Hash size={18} /> Sinkron Nomor
        </button>
      </div>

      {activeTab === 'counters' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-1 bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Settings2 size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-600 rounded-2xl text-white">
                    <Hash size={24} />
                  </div>
                  <h3 className="text-xl font-black">Counter Global</h3>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Nomor Urut Sistem Saat Ini</p>
                  <p className="text-5xl font-black font-mono text-orange-500">{globalSeq.toString().padStart(3, '0')}</p>
                </div>
                <button 
                  onClick={() => handleEditCounter('GLOBAL_SYSTEM_SEQUENCE', globalSeq)}
                  className="w-full py-4 bg-white/10 hover:bg-orange-600 text-white border border-white/20 rounded-2xl transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Sesuaikan Urutan Global
                </button>
              </div>
           </div>
           
           <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center">
              <div className="flex items-start gap-4">
                 <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                    <AlertTriangle size={24} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-black text-slate-900">Penting: Sistem Berkelanjutan</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Sistem penomoran sekarang menggunakan <strong>Nomor Urut Global</strong>. Artinya, setiap surat baru yang terbit (apapun jenisnya) akan meningkatkan nomor urut di atas. 
                      <br /><br />
                      Format: <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs">[KODE].[URUT]/[DIV]/[ROMAN]/[YEAR]</code>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-5">No.</th>
              <th className="px-8 py-5">
                {activeTab === 'types' ? 'Nama Jenis' : activeTab === 'divisions' ? 'Nama Divisi' : 'Jenis Surat'}
              </th>
              <th className="px-8 py-5">
                {activeTab === 'counters' ? 'Total Terbit (Stats)' : 'Kode Identitas'}
              </th>
              <th className="px-8 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activeTab === 'counters' ? (
              templates.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5 text-xs font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="font-bold text-slate-900">{item.name}</span>
                       <span className="text-[10px] font-mono text-slate-400">Prefix Kode: {item.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-xl text-sm font-bold font-mono border border-slate-100 inline-flex items-center gap-2">
                      <Layers size={14} /> {counters[item.id] || 0} Kali
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => handleEditCounter(item.id, counters[item.id] || 0)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-slate-100"
                      >
                        <RefreshCw size={14} /> Reset Stats
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              (activeTab === 'types' ? templates : divisions).map((item, idx) => (
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
              ))
            )}
          </tbody>
        </table>
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

      {/* Counter Adjustment Modal */}
      {showCounterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-orange-50/50">
              <h3 className="text-xl font-black text-slate-900">Sinkronisasi Nomor</h3>
              <button onClick={() => setShowCounterModal(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCounter} className="p-8 space-y-6">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-800 leading-relaxed font-medium">
                {targetCounterType === 'GLOBAL_SYSTEM_SEQUENCE' ? (
                  <>Anda sedang menyesuaikan <strong>Nomor Urut Global</strong>. Surat berikutnya yang diterbitkan sistem (apapun jenisnya) akan menggunakan nomor urut <strong>{(counterValue || 0) + 1}</strong>.</>
                ) : (
                  <>Anda sedang menyesuaikan statistik internal untuk <strong>{targetCounterType}</strong>.</>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nomor Terakhir Terpakai</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  className="w-full p-6 bg-slate-100 border border-slate-100 rounded-3xl font-black text-3xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-center"
                  value={counterValue}
                  onChange={(e) => setCounterValue(parseInt(e.target.value) || 0)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all uppercase tracking-widest text-sm"
              >
                <RefreshCw size={18} className="inline mr-2" /> Perbarui Sequence
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
