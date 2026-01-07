
export enum LetterType {
  SK = '01',
  SU = '02',
  SPm = '03',
  SPb = '04',
  SPp = '05',
  SPn = '06',
  SM = '07',
  ST = '08',
  SKet = '09',
  SR = '10',
  SB = '11',
  SPPD = '12',
  SRT = '13',
  PK = '14',
  SPeng = '15',
  Kwitansi = '16',
  BAST = '17'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Division {
  name: string;
  code: string;
}

export interface Attachment {
  name: string;
  data: string;
  type: string;
  fileExtension?: string;
}

export interface Letter {
  id: string;
  number: string;
  type: LetterType;
  divisionCode: string;
  title: string;
  date: string;
  sender: string;
  recipient: string;
  content: string;
  attachmentCount: number;
  attachments?: Attachment[];
  signedBy: string;
  signedRole: string;
  qrCodeUrl: string;
  createdAt: string;
  isNumberOnly?: boolean; // Flag for quick number acquisition
}

export interface LetterTemplate {
  id: LetterType;
  name: string;
  code: string;
  fields: string[];
}

export interface BrandingAssets {
  header: string | null;
  footer: string | null;
  watermark: string | null;
}
