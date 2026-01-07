
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, Printer, Eye, ChevronLeft, HelpCircle, Upload, X, FileText, File as FileIcon, Plus, Download } from 'lucide-react';
import { LetterType, Letter, Attachment, Division, LetterTemplate } from '../types';
import { ORG_NAME, DEFAULT_SIGNER, DEFAULT_ROLE } from '../constants';
import { getNextNumber, saveLetter } from '../services/letterStore';
import { getDivisions, getLetterTemplates } from '../services/masterDataStore';
import { draftLetterContent } from '../services/geminiService';
import LetterCanvas from '../components/LetterCanvas';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CreateLetter: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showReference, setShowReference] = useState(false);
  
  const [dynamicDivs, setDynamicDivs] = useState<Division[]>(getDivisions());
  const [dynamicTemplates, setDynamicTemplates] = useState<LetterTemplate[]>(getLetterTemplates());

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const [formData, setFormData] = useState({
    type: dynamicTemplates[0]?.id || LetterType.SU,
    divisionCode: dynamicDivs[0]?.code || 'DIV',
    title: 'Perihal Surat Resmi',
    sender: ORG_NAME,
    recipient: 'Yth. Penerima',
    date: new Date().toISOString().split('T')[0],
    content: '',
    signedBy: DEFAULT_SIGNER,
    signedRole: DEFAULT_ROLE,
    attachmentCount: 0
  });

  const [previewLetter, setPreviewLetter] = useState<Letter | null>(null);

  useEffect(() => {
    const divs = getDivisions();
    const temps = getLetterTemplates();
    setDynamicDivs(divs);
    setDynamicTemplates(temps);
    
    setFormData(prev => ({
      ...prev,
      type: prev.type || (temps[0]?.id as LetterType),
      divisionCode: prev.divisionCode || divs[0]?.code
    }));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAttachment: Attachment = {
            name: file.name,
            data: event.target.result as string,
            type: file.type,
            fileExtension: ext
          };
          setAttachments(prev => {
            const updated = [...prev, newAttachment];
            setFormData(f => ({ ...f, attachmentCount: updated.length }));
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData(f => ({ ...f, attachmentCount: updated.length }));
      return updated;
    });
  };

  const handleAICompose = async () => {
    if (!formData.title) {
      alert("Harap isi Perihal/Judul surat terlebih dahulu agar AI bisa merumuskan isi.");
      return;
    }
    setLoadingAI(true);
    const result = await draftLetterContent(formData.type, formData.title);
    setFormData({ ...formData, content: result || '' });
    setLoadingAI(false);
  };

  const handlePreview = () => {
    const nextNumber = getNextNumber(formData.type, formData.divisionCode);
    const newLetter: Letter = {
      id: Math.random().toString(36).substr(2, 9),
      number: nextNumber,
      ...formData,
      attachments,
      qrCodeUrl: '',
      createdAt: new Date().toISOString()
    };
    setPreviewLetter(newLetter);
    setStep(2);
  };

  const handleDownloadPDF = async () => {
    if (!previewLetter) return;
    setDownloading(true);
    
    try {
      const input = document.getElementById('printable-letter');
      if (!input) return;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const attachmentElements = document.querySelectorAll('.break-after-page');
      for (let i = 0; i < attachmentElements.length; i++) {
        pdf.addPage();
        const attCanvas = await html2canvas(attachmentElements[i] as HTMLElement, { 
          scale: 2, 
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        const attImgData = attCanvas.toDataURL('image/png');
        pdf.addImage(attImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Surat_AYS_${previewLetter.number.replace(/\//g, '-')}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Gagal mengunduh PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const handleFinalSave = () => {
    if (previewLetter) {
      saveLetter(previewLetter);
      alert("Surat berhasil disimpan dan diarsipkan!");
      navigate('/archive');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-12 flex items-center justify-center gap-6 no-print">
        <div className="flex flex-col items-center gap-2">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step === 1 ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'bg-slate-200 text-slate-400'}`}>1</div>
           <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 1 ? 'text-orange-600' : 'text-slate-400'}`}>DRAFT</span>
        </div>
        <div className="w-16 h-px bg-slate-200 mt-[-20px]"></div>
        <div className="flex flex-col items-center gap-2">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step === 2 ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'bg-slate-200 text-slate-400'}`}>2</div>
           <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 2 ? 'text-orange-600' : 'text-slate-400'}`}>TERBIT</span>
        </div>
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 no-print animate-in slide-in-from-bottom duration-500">
          <div className="xl:col-span-3 space-y-8">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Formulir Persuratan</h3>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setShowReference(!showReference)}
                    className="p-3 bg-white text-slate-500 rounded-xl hover:bg-slate-100 transition-colors shadow-sm border border-slate-100"
                  >
                    <HelpCircle size={20} />
                  </button>
                  <button 
                    onClick={handleAICompose}
                    disabled={loadingAI}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/10"
                  >
                    {loadingAI ? 'Merangkai...' : <><Sparkles size={18} /> Compose with AI</>}
                  </button>
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Jenis Surat</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as LetterType})}
                      >
                        {dynamicTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Divisi</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                        value={formData.divisionCode}
                        onChange={(e) => setFormData({...formData, divisionCode: e.target.value})}
                      >
                        {dynamicDivs.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                      </select>
                    </div>
                  </div>
                  {/* ... rest of the fields ... */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Perihal</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tujuan / Penerima</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" value={formData.recipient} onChange={(e) => setFormData({...formData, recipient: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tanggal Surat</label>
                      <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Penandatangan</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold" value={formData.signedBy} onChange={(e) => setFormData({...formData, signedBy: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 h-full flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Konten Surat</label>
                  <textarea className="w-full flex-1 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-sans text-sm leading-relaxed" placeholder="Tulis isi surat..." value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                </div>
              </div>
            </div>
            {/* ... attachment section ... */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  Lampiran Dokumen
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <label className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-orange-200 transition-all group">
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors mb-4"><Plus size={24} /></div>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-widest">Unggah File</span>
                </label>
                {attachments.map((file, idx) => (
                  <div key={idx} className="relative group aspect-square border border-slate-100 rounded-3xl overflow-hidden bg-white flex flex-col p-4">
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4"><FileIcon size={32} /></div>
                      <p className="text-[10px] font-black text-slate-900 truncate w-full">{file.name}</p>
                    </div>
                    <button onClick={() => removeAttachment(idx)} className="absolute top-3 right-3 p-2 text-red-500 rounded-xl hover:bg-red-50"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={handlePreview} className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-orange-700 shadow-xl shadow-orange-600/20 transition-all active:scale-95 text-sm uppercase tracking-widest">
                <Eye size={20} className="inline mr-2" /> Preview & Publish
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            {showReference && (
              <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-orange-500 border-b border-white/10 pb-4">Daftar Referensi</h4>
                <div className="space-y-6">
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Jenis Surat</h5>
                    <div className="space-y-2">
                      {dynamicTemplates.map(t => (
                        <div key={t.id} className="text-[10px] flex justify-between border-b border-white/5 py-1.5">
                          <span className="text-slate-400">{t.name}</span>
                          <span className="font-black text-orange-500">{t.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur p-6 rounded-[32px] shadow-sm border border-slate-100 no-print">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(1)} className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 transition-all active:scale-95">
                <ChevronLeft />
              </button>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p className="font-black text-slate-900">Final Preview</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownloadPDF} disabled={downloading} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50">
                {downloading ? 'Generating...' : <><Download size={18} className="inline mr-2" /> Unduh PDF</>}
              </button>
              <button onClick={() => window.print()} className="bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                <Printer size={18} className="inline mr-2" /> Cetak
              </button>
              <button onClick={handleFinalSave} className="bg-orange-600 text-white px-10 py-3 rounded-2xl font-black hover:bg-orange-700 shadow-xl shadow-orange-600/20 transition-all">
                <Save size={18} className="inline mr-2" /> Simpan Permanen
              </button>
            </div>
          </div>
          {previewLetter && (
            <div className="flex justify-center py-8 no-scrollbar bg-slate-200/50 rounded-[48px] overflow-auto print:p-0 print:bg-white">
              <LetterCanvas letter={previewLetter} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateLetter;
