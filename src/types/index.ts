export type CipherMode = 'encrypt' | 'decrypt';
export type AlgorithmType = 'standard' | 'binary';

export type AlgorithmId = 'vigenere' | 'caesar' | 'atbash' | 'rot13' | 'railfence' | 'xor';

export interface AlgorithmMeta {
  id: AlgorithmId;
  nameAr: string;
  nameEn: string;
  category: 'polyalphabetic' | 'monoalphabetic' | 'transposition' | 'binary';
  categoryAr: string;
  descriptionAr: string;
  descriptionEn: string;
  formulaAr: string;
  formulaEn: string;
  defaultKey: string;
  keyType: 'string' | 'number' | 'none';
  minNumber?: number;
  maxNumber?: number;
}

export interface TraceStep {
  index: number;
  plainChar: string;
  plainCode: number;
  keyChar: string;
  keyCode: number;
  shift: number;
  cipherChar: string;
  cipherCode: number;
  formula: string;
  isPreserved: boolean;
}

export interface ProcessedFile {
  name: string;
  size: number;
  type: string;
  originalData: Uint8Array;
  processedData: Uint8Array;
  mode: CipherMode;
  algorithmId: AlgorithmId;
  key: string;
  isBinary: boolean;
  timeMs: number;
  sha256Hash?: string;
}

export interface CppSourceFile {
  name: string;
  path: string;
  language: string;
  content: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface StudentDevLog {
  titleAr: string;
  titleEn: string;
  date: string;
  contentAr: string;
  contentEn: string;
  codeSnippet?: string;
}
