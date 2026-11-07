import { AlgorithmId, AlgorithmMeta, CipherMode, TraceStep } from '../types';

export const ALGORITHM_REGISTRY: AlgorithmMeta[] = [
  {
    id: 'vigenere',
    nameAr: 'خوارزمية فيجينري (Vigenère)',
    nameEn: 'Vigenère Cipher',
    category: 'polyalphabetic',
    categoryAr: 'استبدال متعدد الأبجديات',
    descriptionAr: 'تستخدم مفتاحاً نصياً مكرراً لإزاحة كل حرف بقيمة مختلفة وفق جدول Tabula Recta.',
    descriptionEn: 'Uses a repeating keyword to shift each letter by different offsets using Tabula Recta.',
    formulaAr: 'C = (P + K) mod 26',
    formulaEn: 'C = (P + K) mod 26',
    defaultKey: 'LEMON',
    keyType: 'string',
  },
  {
    id: 'caesar',
    nameAr: 'شفرة قيصر (Caesar Shift)',
    nameEn: 'Caesar Cipher',
    category: 'monoalphabetic',
    categoryAr: 'استبدال أحادي الأبجدية',
    descriptionAr: 'أقدم شفرة تاريخية، تقوم بإزاحة كل حرف بمقدار ثابت (Shift) عبر الأبجدية.',
    descriptionEn: 'Classic historical cipher that shifts every letter forward by a fixed numeric key.',
    formulaAr: 'C = (P + shift) mod 26',
    formulaEn: 'C = (P + shift) mod 26',
    defaultKey: '3',
    keyType: 'number',
    minNumber: 1,
    maxNumber: 25,
  },
  {
    id: 'rot13',
    nameAr: 'شفرة روت 13 (ROT13)',
    nameEn: 'ROT13 Cipher',
    category: 'monoalphabetic',
    categoryAr: 'استبدال متناظر (Symmetric)',
    descriptionAr: 'حالة خاصة من قيصر بإزاحة 13. التشفير وفك التشفير متطابقان تماماً (دالة ذاتية الانعكاس).',
    descriptionEn: 'Special case of Caesar with shift 13. Encrypting twice yields the original text.',
    formulaAr: 'C = (P + 13) mod 26',
    formulaEn: 'C = (P + 13) mod 26',
    defaultKey: '13',
    keyType: 'none',
  },
  {
    id: 'atbash',
    nameAr: 'شفرة أتباش (Atbash Hebrew)',
    nameEn: 'Atbash Cipher',
    category: 'monoalphabetic',
    categoryAr: 'استبدال انعكاسي',
    descriptionAr: 'شفرة قديمة تعكس ترتيب الأبجدية تماماً: A تصبح Z، و B تصبح Y، وهكذا. لا تحتاج مفتاحاً.',
    descriptionEn: 'Substitution cipher where alphabet is reversed: A↔Z, B↔Y, C↔X. No secret key needed.',
    formulaAr: 'C = 25 - P',
    formulaEn: 'C = 25 - P',
    defaultKey: '',
    keyType: 'none',
  },
  {
    id: 'railfence',
    nameAr: 'شفرة سكة الحديد (Rail Fence)',
    nameEn: 'Rail Fence (Zig-Zag)',
    category: 'transposition',
    categoryAr: 'تشفير تبديلي (Transposition)',
    descriptionAr: 'تكتب الأحرف بشكل متعرج (Zig-Zag) على أسياخ وهمية ثم تُقرأ سطراً بسطر.',
    descriptionEn: 'Transposition cipher writing letters in a zigzag pattern across multiple rails.',
    formulaAr: 'إعادة ترتيب مواقع الأحرف قطرياً',
    formulaEn: 'Diagonal zigzag permutation',
    defaultKey: '3',
    keyType: 'number',
    minNumber: 2,
    maxNumber: 10,
  },
  {
    id: 'xor',
    nameAr: 'تشفير XOR الثنائي (Bitwise XOR)',
    nameEn: 'XOR Stream Cipher',
    category: 'binary',
    categoryAr: 'تشفير رقمي للبايتات',
    descriptionAr: 'التشفير المفضل لطلاب علوم الحاسوب للملفات! يطبق عملية XOR الرياضية بين كل بايت والمفتاح.',
    descriptionEn: 'Computer science staple for file encryption using bitwise XOR: (Byte ^ Key).',
    formulaAr: 'C = Byte ⊕ Key',
    formulaEn: 'C = Byte ⊕ Key',
    defaultKey: 'SECRET',
    keyType: 'string',
  },
];

// Helper: Vigenere
function processVigenere(text: string, key: string, mode: CipherMode, preserveCase = true) {
  const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase() || 'A';
  let result = '';
  const steps: TraceStep[] = [];
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isUpper = ch >= 'A' && ch <= 'Z';
    const isLower = ch >= 'a' && ch <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const pVal = ch.charCodeAt(0) - base;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const kVal = kChar.charCodeAt(0) - 65;

      const cVal = mode === 'encrypt' ? (pVal + kVal) % 26 : (pVal - kVal + 26) % 26;
      const resChar = String.fromCharCode((preserveCase ? base : 65) + cVal);
      result += resChar;

      steps.push({
        index: i,
        plainChar: ch,
        plainCode: pVal,
        keyChar: kChar,
        keyCode: kVal,
        shift: kVal,
        cipherChar: resChar,
        cipherCode: cVal,
        formula: mode === 'encrypt' ? `(${pVal} + ${kVal}) mod 26 = ${cVal}` : `(${pVal} - ${kVal} + 26) mod 26 = ${cVal}`,
        isPreserved: false,
      });
      keyIndex++;
    } else {
      result += ch;
      steps.push({
        index: i,
        plainChar: ch,
        plainCode: ch.charCodeAt(0),
        keyChar: '-',
        keyCode: 0,
        shift: 0,
        cipherChar: ch,
        cipherCode: ch.charCodeAt(0),
        formula: 'محفوظ كما هو',
        isPreserved: true,
      });
    }
  }

  return { result, steps };
}

// Helper: Caesar
function processCaesar(text: string, shiftStr: string, mode: CipherMode, preserveCase = true) {
  let shift = parseInt(shiftStr, 10);
  if (isNaN(shift)) shift = 3;
  shift = ((shift % 26) + 26) % 26;
  if (mode === 'decrypt') shift = (26 - shift) % 26;

  let result = '';
  const steps: TraceStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isUpper = ch >= 'A' && ch <= 'Z';
    const isLower = ch >= 'a' && ch <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const pVal = ch.charCodeAt(0) - base;
      const cVal = (pVal + shift) % 26;
      const resChar = String.fromCharCode((preserveCase ? base : 65) + cVal);
      result += resChar;

      steps.push({
        index: i,
        plainChar: ch,
        plainCode: pVal,
        keyChar: `+${shift}`,
        keyCode: shift,
        shift,
        cipherChar: resChar,
        cipherCode: cVal,
        formula: `(${pVal} + ${shift}) mod 26 = ${cVal}`,
        isPreserved: false,
      });
    } else {
      result += ch;
      steps.push({
        index: i,
        plainChar: ch,
        plainCode: ch.charCodeAt(0),
        keyChar: '-',
        keyCode: 0,
        shift: 0,
        cipherChar: ch,
        cipherCode: ch.charCodeAt(0),
        formula: 'محفوظ',
        isPreserved: true,
      });
    }
  }

  return { result, steps };
}

// Helper: Atbash
function processAtbash(text: string, preserveCase = true) {
  let result = '';
  const steps: TraceStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isUpper = ch >= 'A' && ch <= 'Z';
    const isLower = ch >= 'a' && ch <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const pVal = ch.charCodeAt(0) - base;
      const cVal = 25 - pVal;
      const resChar = String.fromCharCode((preserveCase ? base : 65) + cVal);
      result += resChar;

      steps.push({
        index: i,
        plainChar: ch,
        plainCode: pVal,
        keyChar: 'REV',
        keyCode: 25,
        shift: 25 - pVal,
        cipherChar: resChar,
        cipherCode: cVal,
        formula: `25 - ${pVal} = ${cVal}`,
        isPreserved: false,
      });
    } else {
      result += ch;
      steps.push({
        index: i,
        plainChar: ch,
        plainCode: ch.charCodeAt(0),
        keyChar: '-',
        keyCode: 0,
        shift: 0,
        cipherChar: ch,
        cipherCode: ch.charCodeAt(0),
        formula: 'محفوظ',
        isPreserved: true,
      });
    }
  }

  return { result, steps };
}

// Helper: Rail Fence
function processRailFence(text: string, railsStr: string, mode: CipherMode) {
  let rails = parseInt(railsStr, 10);
  if (isNaN(rails) || rails < 2) rails = 3;
  if (rails >= text.length) {
    return {
      result: text,
      steps: text.split('').map((c, i) => ({
        index: i,
        plainChar: c,
        plainCode: c.charCodeAt(0),
        keyChar: `${rails}`,
        keyCode: rails,
        shift: 0,
        cipherChar: c,
        cipherCode: c.charCodeAt(0),
        formula: 'النص أقصر من عدد القضبان',
        isPreserved: true,
      })),
    };
  }

  let result = '';
  const steps: TraceStep[] = [];

  if (mode === 'encrypt') {
    const fence: string[][] = Array.from({ length: rails }, () => []);
    let rail = 0;
    let direction = 1;

    for (let i = 0; i < text.length; i++) {
      fence[rail].push(text[i]);
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      rail += direction;
    }

    result = fence.flat().join('');
  } else {
    // Decrypt Rail Fence
    const fence: (string | null)[][] = Array.from({ length: rails }, () => Array(text.length).fill(null));
    let rail = 0;
    let direction = 1;

    for (let i = 0; i < text.length; i++) {
      fence[rail][i] = '*';
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      rail += direction;
    }

    let charIdx = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (fence[r][c] === '*' && charIdx < text.length) {
          fence[r][c] = text[charIdx++];
        }
      }
    }

    rail = 0;
    direction = 1;
    for (let i = 0; i < text.length; i++) {
      result += fence[rail][i] || '';
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      rail += direction;
    }
  }

  for (let i = 0; i < result.length; i++) {
    steps.push({
      index: i,
      plainChar: text[i] || '',
      plainCode: (text[i] || '').charCodeAt(0),
      keyChar: `${rails} قضبان`,
      keyCode: rails,
      shift: 0,
      cipherChar: result[i] || '',
      cipherCode: (result[i] || '').charCodeAt(0),
      formula: `تبديل في السكة #${rails}`,
      isPreserved: false,
    });
  }

  return { result, steps };
}

// Helper: Bitwise XOR
function processXORText(text: string, key: string) {
  if (!key) key = 'KEY';
  let result = '';
  const steps: TraceStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const kChar = key[i % key.length];
    const pCode = text.charCodeAt(i);
    const kCode = kChar.charCodeAt(0);
    const xCode = pCode ^ kCode;
    const cChar = String.fromCharCode(xCode);
    result += cChar;

    steps.push({
      index: i,
      plainChar: text[i],
      plainCode: pCode,
      keyChar: kChar,
      keyCode: kCode,
      shift: 0,
      cipherChar: xCode >= 32 && xCode <= 126 ? cChar : `\\x${xCode.toString(16).padStart(2, '0')}`,
      cipherCode: xCode,
      formula: `${pCode} ⊕ ${kCode} = ${xCode}`,
      isPreserved: false,
    });
  }

  return { result, steps };
}

/**
 * Universal text cipher dispatcher
 */
export function executeCipher(
  algo: AlgorithmId,
  text: string,
  key: string,
  mode: CipherMode,
  preserveCase = true
): { result: string; steps: TraceStep[] } {
  switch (algo) {
    case 'vigenere':
      return processVigenere(text, key, mode, preserveCase);
    case 'caesar':
      return processCaesar(text, key, mode, preserveCase);
    case 'rot13':
      return processCaesar(text, '13', mode, preserveCase);
    case 'atbash':
      return processAtbash(text, preserveCase);
    case 'railfence':
      return processRailFence(text, key, mode);
    case 'xor':
      return processXORText(text, key);
    default:
      return processVigenere(text, key, mode, preserveCase);
  }
}

/**
 * Universal file processor for Uint8Array across all algorithms
 */
export function executeFileCipher(
  algo: AlgorithmId,
  data: Uint8Array,
  key: string,
  mode: CipherMode,
  isBinaryMode: boolean,
  onProgress?: (percent: number) => void
): Uint8Array {
  const result = new Uint8Array(data.length);
  const total = data.length;
  const step = Math.max(1, Math.floor(total / 20));

  if (algo === 'xor') {
    // Pure fast XOR
    const keyBytes = new TextEncoder().encode(key || 'SECRET');
    const kLen = keyBytes.length;
    for (let i = 0; i < total; i++) {
      result[i] = data[i] ^ keyBytes[i % kLen];
      if (onProgress && i % step === 0) onProgress(Math.floor((i / total) * 100));
    }
  } else if (algo === 'vigenere' && isBinaryMode) {
    // Byte-level Vigenère mod 256
    const keyBytes = new TextEncoder().encode(key || 'LEMON');
    const kLen = keyBytes.length;
    for (let i = 0; i < total; i++) {
      const k = keyBytes[i % kLen];
      const b = data[i];
      result[i] = mode === 'encrypt' ? (b + k) & 0xff : (b - k + 256) & 0xff;
      if (onProgress && i % step === 0) onProgress(Math.floor((i / total) * 100));
    }
  } else if (algo === 'caesar' && isBinaryMode) {
    let shift = parseInt(key, 10);
    if (isNaN(shift)) shift = 3;
    shift = ((shift % 256) + 256) % 256;
    for (let i = 0; i < total; i++) {
      const b = data[i];
      result[i] = mode === 'encrypt' ? (b + shift) & 0xff : (b - shift + 256) & 0xff;
      if (onProgress && i % step === 0) onProgress(Math.floor((i / total) * 100));
    }
  } else if (algo === 'atbash' && isBinaryMode) {
    for (let i = 0; i < total; i++) {
      result[i] = 255 - data[i];
      if (onProgress && i % step === 0) onProgress(Math.floor((i / total) * 100));
    }
  } else {
    // Text-based fallback for text mode
    const text = new TextDecoder().decode(data);
    const { result: textRes } = executeCipher(algo, text, key, mode, true);
    return new TextEncoder().encode(textRes);
  }

  if (onProgress) onProgress(100);
  return result;
}
