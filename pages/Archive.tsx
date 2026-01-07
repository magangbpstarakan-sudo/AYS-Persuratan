
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Trash2, ExternalLink, Hash, FileText, Archive as ArchiveIcon, X, Printer, Loader2 } from 'lucide-react';
import { getLetters } from '../services/letterStore';
import { Letter } from '../types';
import LetterCanvas from '../components/LetterCanvas';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Archive: React.FC = () => {
  const letters = getLetters().reverse();
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewingLetter, setViewingLetter] = useState<Letter | null>(null);

  const filteredLetters = letters.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async (letter: Letter) => {
    if (downloadingId) return;
    setDownloadingId(letter.id);
    
    // Create a temporary container to render the letter for capturing
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    document.body.appendChild(container);

    try {
      const root = (await import('react-dom/client')).createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<LetterCanvas letter={letter} isPrint={true} />);
        // Wait for fonts and images to render
        setTimeout(resolve, 1800);
      });

      const letterEl = container.querySelector('#printable-letter') as HTMLElement;
      if (!letterEl) throw new Error("Document element not rendered correctly.");

      const canvas = await html2canvas(letterEl, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Attachments logic
      const attachmentElements = container.querySelectorAll('.break-after-page');
      for (let i = 0; i < attachmentElements.length; i++) {
        pdf.addPage();
        const attCanvas = await html2canvas(attachmentElements[i] as HTMLElement, { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          logging: false
        });
        const attImgData = attCanvas.toDataURL('image/png');
        pdf.addImage(attImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Surat_AYS_${letter.number.replace(/[\/\\:*?"<>|]/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF Generation failed:", err);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    } finally {
      document.body.removeChild(container);
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari perihal, nomor, atau penerima..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-widest transition-all">
            <Filter size={18} /> Filter Arsip
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Identitas</th>
                <th className="px-8 py-5">Nomor Surat</th>
                <th className="px-8 py-5">Perihal</th>
                <th className="px-8 py-5">Tujuan</th>
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLetters.map((letter) => (
                <tr key={letter.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${letter.isNumberOnly ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                      {letter.isNumberOnly ? <Hash size={18} /> : <FileText size={18} />}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-mono text-xs font-black text-slate-900 tracking-tighter">{letter.number}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{letter.divisionCode}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 line-clamp-1 mb-1 text-sm">{letter.title}</p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${letter.isNumberOnly ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {letter.isNumberOnly ? 'Hanya Nomor' : 'Dokumen Terbit'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{letter.recipient}</td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-400">{new Date(letter.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      {!letter.isNumberOnly && (
                        <>
                          <button 
                            onClick={() => setViewingLetter(letter)}
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Pratinjau Dokumen"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(letter)}
                            disabled={!!downloadingId}
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-30"
                            title="Unduh Dokumen"
                          >
                            {downloadingId === letter.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => window.open(`/#/verify/${encodeURIComponent(letter.number)}`, '_blank')}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        title="Link Verifikasi Publik"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLetters.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <ArchiveIcon size={64} strokeWidth={1} />
                      <p className="font-bold uppercase tracking-widest text-sm">Arsip Kosong atau Tidak Ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Document View Modal */}
      {viewingLetter && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10 no-print animate-in fade-in zoom-in duration-300">
           <div className="bg-slate-100 w-full max-w-5xl h-full flex flex-col rounded-[48px] overflow-hidden shadow-2xl">
              {/* Modal Header/Toolbar */}
              <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-600/20">
                       <FileText size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">Dokumen Digital</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{viewingLetter.number}</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button 
                       onClick={() => handleDownloadPDF(viewingLetter)}
                       disabled={!!downloadingId}
                       className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                    >
                       {downloadingId === viewingLetter.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} Unduh PDF
                    </button>
                    <button 
                       onClick={() => window.print()}
                       className="px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 border border-slate-200"
                    >
                       <Printer size={18} /> Cetak
                    </button>
                    <button 
                       onClick={() => setViewingLetter(null)}
                       className="p-2.5 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
                    >
                       <X size={24} />
                    </button>
                 </div>
              </div>

              {/* Document Rendering Area */}
              <div className="flex-1 overflow-auto p-10 flex justify-center bg-slate-200/50 no-scrollbar">
                 <div className="transform origin-top scale-[0.7] md:scale-90 lg:scale-100 mb-20">
                    <LetterCanvas letter={viewingLetter} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Archive;
