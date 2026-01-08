
import { Letter, LetterType } from '../types';

const STORAGE_KEY = 'epersuratan_data_ays_v2';
const COUNTER_KEY = 'epersuratan_counters_ays_v2';
const GLOBAL_SEQ_KEY = 'GLOBAL_SYSTEM_SEQUENCE';

export const getLetters = (): Letter[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLetter = (letter: Letter) => {
  const letters = getLetters();
  const index = letters.findIndex(l => l.id === letter.id);
  if (index >= 0) {
    letters[index] = letter;
  } else {
    letters.push(letter);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
};

/**
 * Gets all raw counters from storage
 */
export const getAllCounters = (): Record<string, number> => {
  const data = localStorage.getItem(COUNTER_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * Gets the current global sequence number
 */
export const getGlobalSequence = (): number => {
  const counters = getAllCounters();
  return counters[GLOBAL_SEQ_KEY] || 0;
};

/**
 * Manually updates a counter for a specific key (can be LetterType or GLOBAL_SEQ_KEY)
 */
export const updateCounter = (key: string, value: number) => {
  const counters = getAllCounters();
  counters[key] = value;
  localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));
};

/**
 * Generates the next continuous number based on a global system sequence.
 * Format: [KODE_SURAT].[SERIAL]/DIV-[KODE_DIVISI]/[BULAN_ROMAWI]/[TAHUN]
 * Example: 12.001/DIV-RIN/IX/2026
 */
export const getNextNumber = (type: string, divisionCode: string): string => {
  const counters = getAllCounters();
  
  // Use global sequence for continuous numbering across all types
  const currentCount = (counters[GLOBAL_SEQ_KEY] || 0) + 1;
  counters[GLOBAL_SEQ_KEY] = currentCount;
  
  // Also keep track per type for statistics
  counters[type] = (counters[type] || 0) + 1;
  
  localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  
  // Padding serial to 3 digits (e.g., 001)
  const serial = String(currentCount).padStart(3, '0');
  
  // Final Requested Format: [KODE_SURAT].[SERIAL]/DIV-[KODE_DIVISI]/[BULAN_ROMAWI]/[TAHUN]
  return `${type}.${serial}/DIV-${divisionCode}/${romanMonths[month-1]}/${year}`;
};

export const getLetterById = (id: string): Letter | undefined => {
  return getLetters().find(l => l.id === id);
};

export const getLetterByNumber = (number: string): Letter | undefined => {
  if (!number) return undefined;
  const cleanNumber = number.trim().toLowerCase();
  return getLetters().find(l => l.number.trim().toLowerCase() === cleanNumber);
};
