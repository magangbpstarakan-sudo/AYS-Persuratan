
import { Letter, LetterType } from '../types';

const STORAGE_KEY = 'epersuratan_data_ays_v2';
const COUNTER_KEY = 'epersuratan_counters_ays_v2';

export const getLetters = (): Letter[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLetter = (letter: Letter) => {
  const letters = getLetters();
  // Check if ID already exists (for updates, though currently we only push)
  const index = letters.findIndex(l => l.id === letter.id);
  if (index >= 0) {
    letters[index] = letter;
  } else {
    letters.push(letter);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
};

export const getNextNumber = (type: LetterType, divisionCode: string): string => {
  const countersRaw = localStorage.getItem(COUNTER_KEY);
  const counters = countersRaw ? JSON.parse(countersRaw) : {};
  
  const currentCount = (counters[type] || 0) + 1;
  counters[type] = currentCount;
  localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  
  const serial = String(currentCount).padStart(3, '0');
  return `${type}.${serial}/${divisionCode}/${romanMonths[month-1]}/${year}`;
};

export const getLetterById = (id: string): Letter | undefined => {
  return getLetters().find(l => l.id === id);
};

export const getLetterByNumber = (number: string): Letter | undefined => {
  if (!number) return undefined;
  const cleanNumber = number.trim().toLowerCase();
  return getLetters().find(l => l.number.trim().toLowerCase() === cleanNumber);
};
