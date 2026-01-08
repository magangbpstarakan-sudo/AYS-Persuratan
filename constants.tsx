
import { LetterType, LetterTemplate, Division } from './types';

export const LETTER_TEMPLATES: LetterTemplate[] = [
  { id: LetterType.SK, name: 'Surat Keputusan', code: '01', fields: [] },
  { id: LetterType.SU, name: 'Surat Undangan', code: '02', fields: [] },
  { id: LetterType.SPm, name: 'Surat Permohonan', code: '03', fields: [] },
  { id: LetterType.SPb, name: 'Surat Pemberitahuan', code: '04', fields: [] },
  { id: LetterType.SPp, name: 'Surat Peminjaman', code: '05', fields: [] },
  { id: LetterType.SPn, name: 'Surat Pernyataan', code: '06', fields: [] },
  { id: LetterType.SM, name: 'Surat Mandat', code: '07', fields: [] },
  { id: LetterType.ST, name: 'Surat Tugas', code: '08', fields: [] },
  { id: LetterType.SKet, name: 'Surat Keterangan', code: '09', fields: [] },
  { id: LetterType.SR, name: 'Surat Rekomendasi', code: '10', fields: [] },
  { id: LetterType.SB, name: 'Surat Balasan', code: '11', fields: [] },
  { id: LetterType.SPPD, name: 'Surat Perintah Perjalanan Dinas', code: '12', fields: [] },
  { id: LetterType.SRT, name: 'Sertifikat', code: '13', fields: [] },
  { id: LetterType.PK, name: 'Perjanjian Kerja Sama', code: '14', fields: [] },
  { id: LetterType.SPeng, name: 'Surat Pengantar', code: '15', fields: [] },
  { id: LetterType.Kwitansi, name: 'Kwitansi', code: '16', fields: [] },
  { id: LetterType.BAST, name: 'BAST', code: '17', fields: [] },
];

export const DIVISIONS: Division[] = [
  { name: 'Riset dan Inovasi', code: 'RIN' },
  { name: 'Lingkungan dan Ekonomi Kreatif', code: 'LIH' },
  { name: 'Pendidikan dan Kesehatan', code: 'DIS' },
  { name: 'Media dan Kreatif', code: 'MKR' },
  { name: 'Kemitraan dan Hubungan Eksternal', code: 'EKS' },
  { name: 'SDM dan Keanggotaan', code: 'SDK' },
  { name: 'MOU BNN', code: 'MBN' },
  { name: 'Kaltimtara', code: 'KLR' },
  { name: 'ECo Chic', code: 'ECH' },
];

export const APP_NAME = "E-Surat AYS Indonesia";
export const ORG_NAME = "AYS Indonesia";
export const ORG_FULL_NAME = "Action of Youth for Sustainability";

export const DEFAULT_SIGNER = "M. Abrar Siregar";
export const DEFAULT_ROLE = "Founder AYS Indonesia";

export const ORG_ADDRESS = "Jl. Pulau Ligitan No.01 Pamusian, Tarakan Tengah, Kalimantan Utara";
export const ORG_PHONE = "0813-1037-2077";
export const ORG_WEB = "www.aysindonesia.id";
export const ORG_EMAIL = "aysindonesia@gmail.com";
export const COPYRIGHT_YEAR = "2026";

export const LEGAL_DISCLAIMER = "Dokumen ini diterbitkan secara elektronik melalui sistem administrasi resmi AYS Indonesia. Keaslian dokumen dapat divalidasi dengan memindai QR Code yang tertera. Penggunaan tanpa hak atas dokumen ini dapat dikenakan sanksi sesuai UU ITE yang berlaku.";

/** 
 * PORTAL URL (User Provided)
 */
export const PUBLIC_PORTAL_URL = "https://aistudio.google.com/apps/drive/1iRYMxheb_qpCLToqXijmjnPiIgk-MAP5?showAssistant=true&showPreview=true";

/** 
 * PERMANENT BRANDING ASSETS (Official direct links provided)
 */
export const DEFAULT_HEADER_SVG = `https://i.ibb.co.com/Fb7RyYgm/Header.png`;
export const DEFAULT_FOOTER_SVG = `https://i.ibb.co.com/0jj3MffR/Footer.png`;
export const DEFAULT_WATERMARK_SVG = `https://i.ibb.co.com/BVCc8BJN/Watermark.png`;

export const TINY_LOGO_BASE64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAbElEQVR4nO2WwQmAMBAE96IDK7AnD9KCO7AHLXid8mADduAhfIghCP5EAnF/fNisMLuzA/AArXN0m80CQA/QOkc3m7UD8ACtc3SzeDsAD9A6RzeLuQPwAK1zdLO4PwAP0DpHN4vj7gAsOru9nEAdwAO0ztFfE6hHvwAAAABJRU5ErkJggg==`;
