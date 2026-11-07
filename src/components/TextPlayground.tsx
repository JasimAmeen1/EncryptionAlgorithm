import React, { useState, useMemo } from 'react';
import {
  Lock,
  Unlock,
  Copy,
  ArrowRightLeft,
  Sparkles,
  Download,
  Check,
  Eye,
  Hash,
  SlidersHorizontal
} from 'lucide-react';
import { AlgorithmId, CipherMode } from '../types';
import { ALGORITHM_REGISTRY, executeCipher } from '../utils/ciphers';
import { StepTraceVisualizer } from './StepTraceVisualizer';

interface TextPlaygroundProps {
  lang: 'ar' | 'en';
  onInspectLetter?: (plainChar: string, keyChar: string, cipherChar: string) => void;
}

export const TextPlayground: React.FC<TextPlaygroundProps> = ({ lang, onInspectLetter }) => {
  const isAr = lang === 'ar';

  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>('vigenere');
  const [mode, setMode] = useState<CipherMode>('encrypt');
  const [inputText, setInputText] = useState<string>('ATTACK AT DAWN');
  const [key, setKey] = useState<string>('LEMON');
  const [preserveCase, setPreserveCase] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

  const currentAlgoMeta = ALGORITHM_REGISTRY.find((a) => a.id === selectedAlgo) || ALGORITHM_REGISTRY[0];

  const handleSelectAlgo = (algoId: AlgorithmId) => {
    setSelectedAlgo(algoId);
    const meta = ALGORITHM_REGISTRY.find((a) => a.id === algoId);
    if (meta) {
      setKey(meta.defaultKey);
    }
    setSelectedStepIndex(null);
  };

  // Compute cipher output and step traces using chosen algorithm
  const { result: outputText, steps } = useMemo(() => {
    return executeCipher(selectedAlgo, inputText, key, mode, preserveCase);
  }, [selectedAlgo, inputText, key, mode, preserveCase]);

  // Presets
  const loadPreset = (preset: 'lemon' | 'caesar' | 'rot13' | 'rail') => {
    if (preset === 'lemon') {
      setSelectedAlgo('vigenere');
      setInputText('ATTACK AT DAWN');
      setKey('LEMON');
      setMode('encrypt');
    } else if (preset === 'caesar') {
      setSelectedAlgo('caesar');
      setInputText('EXPERIENCE IS THE TEACHER OF ALL THINGS');
      setKey('3');
      setMode('encrypt');
    } else if (preset === 'rot13') {
      setSelectedAlgo('rot13');
      setInputText('HELLO WORLD FROM CS304');
      setKey('13');
      setMode('encrypt');
    } else if (preset === 'rail') {
      setSelectedAlgo('railfence');
      setInputText('DEFEND THE EAST WALL AT DUSK');
      setKey('3');
      setMode('encrypt');
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const filename = `${selectedAlgo}_${mode}.txt`;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Header & Algorithm Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'استوديو التشفير النصي والتحليل الأكاديمي' : 'Text Cipher Studio & Analysis'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'قارن بين الخوارزميات الستة وشاهد التحليل الحسابي الفوري مع محاذاة تيار المفتاح.'
                : 'Compare all 6 ciphers side-by-side with instant formula evaluations.'}
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">{isAr ? 'أمثلة سريعة:' : 'Presets:'}</span>
            <button
              onClick={() => loadPreset('lemon')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              Vigenère (LEMON)
            </button>
            <button
              onClick={() => loadPreset('caesar')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              Caesar (+3)
            </button>
            <button
              onClick={() => loadPreset('rot13')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              ROT-13
            </button>
            <button
              onClick={() => loadPreset('rail')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              Rail Fence (3)
            </button>
          </div>
        </div>

        {/* Algorithm Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-800">
          {ALGORITHM_REGISTRY.map((algo) => {
            const isSelected = selectedAlgo === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => handleSelectAlgo(algo.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-start truncate ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {isAr ? algo.nameAr.split('(')[0] : algo.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Text and Key Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            {/* Header with Mode toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span>{isAr ? 'النص المدخل (Input Text):' : 'Input Text:'}</span>
                <span className="text-slate-500 font-mono text-[11px]">{inputText.length} chars</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode('encrypt')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'encrypt'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3 h-3 inline me-1" />
                  <span>{isAr ? 'تشفير' : 'Encrypt'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('decrypt')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'decrypt'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Unlock className="w-3 h-3 inline me-1" />
                  <span>{isAr ? 'فك' : 'Decrypt'}</span>
                </button>
              </div>
            </div>

            {/* Input Textarea */}
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isAr ? 'أدخل النص المطلوب تشفيره أو فك تشفيره هنا...' : 'Enter your text here...'}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg p-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition-colors resize-none"
            />

            {/* Dynamic Parameter Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {currentAlgoMeta.keyType !== 'none' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {currentAlgoMeta.id === 'caesar'
                      ? isAr
                        ? 'الإزاحة (Shift):'
                        : 'Shift Value:'
                      : currentAlgoMeta.id === 'railfence'
                      ? isAr
                        ? 'عدد القضبان (Rails):'
                        : 'Rails Count:'
                      : isAr
                      ? 'المفتاح السري (Key):'
                      : 'Secret Key:'}
                  </label>
                  <input
                    type={currentAlgoMeta.keyType === 'number' ? 'number' : 'text'}
                    value={key}
                    min={currentAlgoMeta.minNumber}
                    max={currentAlgoMeta.maxNumber}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={currentAlgoMeta.defaultKey}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none uppercase"
                  />
                </div>
              ) : (
                <div className="flex items-center text-xs text-slate-400">
                  <span>{isAr ? 'لا يتطلب هذا التشفير مفتاحاً إضافياً.' : 'Keyless symmetric transformation.'}</span>
                </div>
              )}

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none pb-2">
                  <input
                    type="checkbox"
                    checked={preserveCase}
                    onChange={(e) => setPreserveCase(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-0 focus:outline-none"
                  />
                  <span>{isAr ? 'الحفاظ على حالة الأحرف (A/a)' : 'Preserve letter case'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Keystream / Transformation Alignment Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'تتبع التحويل ومحاذاة المفتاح:' : 'Keystream / Map Alignment:'}</span>
            </h3>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-12 shrink-0">{isAr ? 'النص:' : 'Text:'}</span>
                <div className="flex gap-1">
                  {steps.map((st, i) => (
                    <span
                      key={i}
                      onClick={() => {
                        setSelectedStepIndex(i);
                        if (!st.isPreserved && onInspectLetter) {
                          onInspectLetter(st.plainChar, st.keyChar, st.cipherChar);
                        }
                      }}
                      className={`inline-block w-5 text-center cursor-pointer rounded transition-colors ${
                        selectedStepIndex === i
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'hover:bg-slate-800'
                      }`}
                    >
                      {st.plainChar === ' ' ? '␣' : st.plainChar}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-12 shrink-0">{isAr ? 'المفتاح:' : 'Key:'}</span>
                <div className="flex gap-1 text-cyan-400 font-bold">
                  {steps.map((st, i) => (
                    <span
                      key={i}
                      className={`inline-block w-5 text-center ${
                        st.isPreserved ? 'text-slate-600' : ''
                      }`}
                    >
                      {st.keyChar}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-850 pt-1">
                <span className="text-slate-500 w-12 shrink-0">{isAr ? 'الخرج:' : 'Cipher:'}</span>
                <div className="flex gap-1 text-emerald-400 font-bold">
                  {steps.map((st, i) => (
                    <span
                      key={i}
                      className={`inline-block w-5 text-center ${
                        st.isPreserved ? 'text-slate-400' : ''
                      }`}
                    >
                      {st.cipherChar === ' ' ? '␣' : st.cipherChar}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output Result & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span>
                  {mode === 'encrypt'
                    ? isAr
                      ? 'الناتج المشفر (Ciphertext):'
                      : 'Result Ciphertext:'
                    : isAr
                    ? 'النص المفكوك (Plaintext):'
                    : 'Decrypted Plaintext:'}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">{outputText.length} chars</span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  title={isAr ? 'تبديل الخرج إلى دخل' : 'Swap output to input'}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  title={isAr ? 'نسخ النص' : 'Copy text'}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadText}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  title={isAr ? 'تنزيل كملف نصي' : 'Download text file'}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Output Display Box */}
            <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-emerald-400 font-mono min-h-32 max-h-56 overflow-y-auto break-all leading-relaxed">
              {outputText || <span className="text-slate-600">{isAr ? '[لا يوجد خرج]' : '[No output]'}</span>}
            </div>

            {/* Math Formula Summary */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-300">
                  {isAr ? 'المعادلة الرياضية:' : 'Mathematical Rule:'}
                </span>{' '}
                <code className="text-cyan-400 font-mono">
                  {currentAlgoMeta.formulaEn}
                </code>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{currentAlgoMeta.categoryAr}</span>
            </div>
          </div>

          {/* Interactive Inspection of Selected Letter */}
          {selectedStepIndex !== null && steps[selectedStepIndex] && (
            <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-4 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  {isAr ? `تحليل الحرف #${selectedStepIndex + 1}` : `Letter #${selectedStepIndex + 1}`}
                </span>
                <button
                  onClick={() => setSelectedStepIndex(null)}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-slate-500 text-[10px]">{isAr ? 'الأصل' : 'Plain'}</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {steps[selectedStepIndex].plainChar}
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-slate-500 text-[10px]">{isAr ? 'المفتاح' : 'Key'}</div>
                  <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                    {steps[selectedStepIndex].keyChar}
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-slate-500 text-[10px]">{isAr ? 'العملية' : 'Formula'}</div>
                  <div className="text-xs font-semibold text-amber-300 font-mono mt-1">
                    {steps[selectedStepIndex].formula}
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-slate-500 text-[10px]">{isAr ? 'الناتج' : 'Cipher'}</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    {steps[selectedStepIndex].cipherChar}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step Breakdown Table */}
      <StepTraceVisualizer
        steps={steps}
        lang={lang}
        mode={mode}
        onSelectStep={(idx) => {
          setSelectedStepIndex(idx);
          const st = steps[idx];
          if (st && !st.isPreserved && onInspectLetter) {
            onInspectLetter(st.plainChar, st.keyChar, st.cipherChar);
          }
        }}
        selectedIndex={selectedStepIndex}
      />
    </div>
  );
};
