
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, FileIcon } from 'lucide-react';
import { Letter, BrandingAssets } from '../types';
import { ORG_NAME, DEFAULT_SIGNER, DEFAULT_ROLE, LEGAL_DISCLAIMER, COPYRIGHT_YEAR, TINY_LOGO_BASE64, ORG_FULL_NAME, DEFAULT_HEADER_SVG, DEFAULT_FOOTER_SVG, DEFAULT_WATERMARK_SVG } from '../constants';
import { getBrandingAssets } from '../services/assetStore';

interface LetterCanvasProps {
  letter: Letter;
  isPrint?: boolean;
}

const LetterCanvas: React.FC<LetterCanvasProps> = ({ letter, isPrint = false }) => {
  const [branding] = useState<BrandingAssets>(getBrandingAssets());

  const getFingerprint = (id: string) => {
    return `AYS-SHA256-${id.toUpperCase().slice(0, 8)}-${new Date(letter.createdAt).getTime().toString(16).toUpperCase()}`;
  };

  /**
   * QR Code link to the official public portal verification page.
   */
  const verifyUrl = `${window.location.origin}/#/verify/${encodeURIComponent(letter.number)}`;

  // Use permanent branding assets provided
  const headerImg = DEFAULT_HEADER_SVG;
  const footerImg = DEFAULT_FOOTER_SVG;
  const watermarkImg = DEFAULT_WATERMARK_SVG;

  return (
    <div className="flex flex-col gap-10 print:gap-0 bg-slate-200/30 p-10 print:p-0 items-center">
      {/* Page 1: Main Letter */}
      <div 
        className="bg-white text-black shadow-2xl relative flex flex-col print:shadow-none font-formal"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '0',
          boxSizing: 'border-box',
          fontSize: '12pt',
          lineHeight: '1.5'
        }}
        id="printable-letter"
      >
        {/* HEADER AREA (Permanent) */}
        <div className="w-full flex justify-center pt-8 pb-4 px-12 relative z-10">
          <img 
            src={headerImg} 
            alt="AYS Header Logo" 
            className="w-full h-auto block object-contain"
            crossOrigin="anonymous"
          />
        </div>

        {/* WATERMARK (Permanent) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0">
          <img 
            src={watermarkImg} 
            alt="Watermark" 
            className="w-[450px] grayscale"
            crossOrigin="anonymous"
          />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col px-[25mm] py-6 relative z-10">
          <div className="mb-8 space-y-0.5">
            <div className="flex">
              <span className="w-24 font-bold">Nomor</span>
              <span className="font-mono text-[11pt]"> : {letter.number}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-bold">Lampiran</span>
              <span> : {letter.attachmentCount === 0 ? '-' : `${letter.attachmentCount} Berkas`}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-bold">Perihal</span>
              <span className="flex-1 font-bold"> : {letter.title}</span>
            </div>
          </div>

          <div className="mb-8 leading-normal">
            <p>Yth.</p>
            <p className="font-bold">{letter.recipient}</p>
            <p>di Tempat</p>
          </div>

          <div className="flex-1 text-justify space-y-4 leading-relaxed">
            <p>Dengan hormat,</p>
            <div className="whitespace-pre-wrap">
              {letter.content || "Isi surat resmi AYS Indonesia..."}
            </div>
          </div>

          <div className="mt-12 flex justify-between items-end border-t border-slate-50 pt-8">
            <div className="flex flex-col gap-2 max-w-[45%]">
               <div className="flex items-center gap-2 text-green-600 mb-2">
                  <ShieldCheck size={16} />
                  <span className="text-[8pt] font-sans font-black uppercase tracking-widest">Verified Digital Document</span>
               </div>
               <p className="text-[7pt] font-sans font-bold text-slate-400 leading-tight">
                  {LEGAL_DISCLAIMER}
               </p>
               <p className="text-[6pt] font-mono text-slate-300 mt-1">
                  SHA-FINGERPRINT: {getFingerprint(letter.id)}
               </p>
            </div>

            <div className="text-center w-64 flex flex-col items-center">
              <p className="mb-1 font-bold">Tarakan, {new Date(letter.date).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
              <p className="mb-4 font-bold uppercase">{ORG_NAME}</p>
              
              <div className="p-2 border-2 border-slate-900 rounded-xl bg-white mb-2 shadow-sm relative group">
                 {/* This QR code represents the signature and points to the public verification portal */}
                 <QRCodeSVG 
                    value={verifyUrl} 
                    size={90}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: TINY_LOGO_BASE64,
                      x: undefined,
                      y: undefined,
                      height: 20,
                      width: 20,
                      excavate: true,
                    }}
                  />
              </div>
              <p className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4 font-sans">Scan to Verify Authenticity</p>
              
              <div className="space-y-0">
                <p className="font-bold underline uppercase">{letter.signedBy || DEFAULT_SIGNER}</p>
                <p className="text-[10pt] font-bold text-orange-600 uppercase tracking-tight">{letter.signedRole || DEFAULT_ROLE}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER AREA (Permanent) */}
        <div className="w-full mt-auto relative z-10 flex flex-col items-center font-sans">
          <div className="px-12 pb-4 w-full flex justify-center">
            <img 
              src={footerImg} 
              alt="AYS Footer" 
              className="w-full h-auto block object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <div className="w-full bg-slate-900 py-3 px-12 text-center text-[7pt] font-black text-white/50 uppercase tracking-[0.4em]">
            © {COPYRIGHT_YEAR} {ORG_FULL_NAME} • ALL RIGHTS RESERVED
          </div>
        </div>
      </div>

      {/* Attachment Pages */}
      {letter.attachments?.map((attachment, index) => (
        <div 
          key={index}
          className="bg-white text-black shadow-2xl relative flex flex-col items-center justify-center break-after-page print:shadow-none font-formal"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            pageBreakBefore: 'always' 
          }}
        >
          <div className="absolute top-12 px-16 w-full flex justify-between items-center opacity-20 grayscale pointer-events-none font-sans">
             <img src={headerImg} alt="Header" className="max-h-12 object-contain" crossOrigin="anonymous" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Lampiran {index + 1}</span>
          </div>
          <div className="p-20 w-full flex flex-col items-center justify-center">
            {['jpg', 'jpeg', 'png', 'gif'].includes(attachment.fileExtension || '') ? (
              <img 
                src={attachment.data} 
                alt={attachment.name}
                className="max-w-full max-h-[220mm] object-contain shadow-lg border-2 border-slate-100"
              />
            ) : (
              <div className="flex flex-col items-center gap-6 p-16 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50 w-full font-sans">
                <div className="w-20 h-20 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
                   <FileIcon size={32} />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-black text-slate-900 mb-1">{attachment.name}</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Digital Asset Attachment</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-12 right-16 text-slate-200 text-[8px] font-bold uppercase tracking-widest font-sans">
            Ref: {letter.number} • Fingerprint: {getFingerprint(letter.id).slice(0, 16)}...
          </div>
        </div>
      ))}
    </div>
  );
};

export default LetterCanvas;
