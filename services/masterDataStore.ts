
import { LetterTemplate, Division, LetterType } from '../types';
import { LETTER_TEMPLATES, DIVISIONS } from '../constants';

const DIVISIONS_KEY = 'ays_dynamic_divisions_v1';
const TEMPLATES_KEY = 'ays_dynamic_templates_v1';

export const getDivisions = (): Division[] => {
  const data = localStorage.getItem(DIVISIONS_KEY);
  if (!data) {
    localStorage.setItem(DIVISIONS_KEY, JSON.stringify(DIVISIONS));
    return DIVISIONS;
  }
  return JSON.parse(data);
};

export const saveDivision = (division: Division) => {
  const divisions = getDivisions();
  const index = divisions.findIndex(d => d.code === division.code);
  if (index >= 0) {
    divisions[index] = division;
  } else {
    divisions.push(division);
  }
  localStorage.setItem(DIVISIONS_KEY, JSON.stringify(divisions));
};

export const deleteDivision = (code: string) => {
  const divisions = getDivisions().filter(d => d.code !== code);
  localStorage.setItem(DIVISIONS_KEY, JSON.stringify(divisions));
};

export const getLetterTemplates = (): LetterTemplate[] => {
  const data = localStorage.getItem(TEMPLATES_KEY);
  if (!data) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(LETTER_TEMPLATES));
    return LETTER_TEMPLATES;
  }
  return JSON.parse(data);
};

export const saveLetterTemplate = (template: LetterTemplate) => {
  const templates = getLetterTemplates();
  const index = templates.findIndex(t => t.id === template.id);
  if (index >= 0) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

export const deleteLetterTemplate = (id: string) => {
  const templates = getLetterTemplates().filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};
