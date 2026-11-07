import { CipherMode, TraceStep } from '../types';

/**
 * Standard Classical Vigenère cipher for Latin text (A-Z, a-z).
 * Letters are shifted modulo 26.
 * Non-alphabetic characters (spaces, punctuation, digits) can be preserved as standard.
 */
export function processVigenereText(
  input: string,
  key: string,
  mode: CipherMode,
  preserveCase = true
): { result: string; steps: TraceStep[] } {
  const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (cleanKey.length === 0) {
    return {
      result: input,
      steps: [],
    };
  }

  let result = '';
  const steps: TraceStep[] = [];
  let keyIndex = 0;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const isUpper = ch >= 'A' && ch <= 'Z';
    const isLower = ch >= 'a' && ch <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const pVal = ch.charCodeAt(0) - base;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const kVal = kChar.charCodeAt(0) - 65; // 0 to 25

      let cVal: number;
      let formula: string;

      if (mode === 'encrypt') {
        cVal = (pVal + kVal) % 26;
        formula = `(${pVal} + ${kVal}) mod 26 = ${cVal}`;
      } else {
        cVal = (pVal - kVal + 26) % 26;
        formula = `(${pVal} - ${kVal} + 26) mod 26 = ${cVal}`;
      }

      let resChar = String.fromCharCode((preserveCase ? base : 65) + cVal);
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
        formula,
        isPreserved: false,
      });

      keyIndex++;
    } else {
      // Non-alphabetic character preserved
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
        formula: 'محرف غير أبجدي (محفوظ)',
        isPreserved: true,
      });
    }
  }

  return { result, steps };
}

/**
 * Binary Vigenère cipher for arbitrary files (images, binaries, pdf, etc.)
 * Operates on Uint8Array modulo 256.
 * Guarantees 100% loss-free reversibility.
 */
export function processVigenereBinary(
  data: Uint8Array,
  key: string,
  mode: CipherMode,
  onProgress?: (percent: number) => void
): Uint8Array {
  if (!key || key.length === 0) {
    throw new Error('مفتاح التشفير لا يمكن أن يكون فارغاً (The key cannot be empty)');
  }

  const keyBytes = new TextEncoder().encode(key);
  const keyLen = keyBytes.length;
  const result = new Uint8Array(data.length);
  const total = data.length;
  const step = Math.max(1, Math.floor(total / 20));

  for (let i = 0; i < total; i++) {
    const kByte = keyBytes[i % keyLen];
    const b = data[i];

    if (mode === 'encrypt') {
      result[i] = (b + kByte) & 0xff; // (b + kByte) % 256
    } else {
      result[i] = (b - kByte + 256) & 0xff; // (b - kByte + 256) % 256
    }

    if (onProgress && i % step === 0) {
      onProgress(Math.floor((i / total) * 100));
    }
  }

  if (onProgress) {
    onProgress(100);
  }

  return result;
}

/**
 * Format bytes to readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate a formatted hex dump view of binary data (e.g. first 256 bytes)
 */
export function generateHexDump(data: Uint8Array, maxBytes = 256): string {
  const slice = data.subarray(0, Math.min(data.length, maxBytes));
  const lines: string[] = [];
  const bytesPerLine = 16;

  for (let i = 0; i < slice.length; i += bytesPerLine) {
    const chunk = slice.subarray(i, i + bytesPerLine);
    const offset = i.toString(16).padStart(8, '0');
    
    // Hex representations
    const hex = Array.from(chunk)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ')
      .padEnd(bytesPerLine * 3 - 1, ' ');

    // ASCII representations
    const ascii = Array.from(chunk)
      .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
      .join('');

    lines.push(`${offset}  ${hex}  |${ascii}|`);
  }

  if (data.length > maxBytes) {
    lines.push(`... [${data.length - maxBytes} بايت إضافية غير معروضة]`);
  }

  return lines.join('\n');
}
