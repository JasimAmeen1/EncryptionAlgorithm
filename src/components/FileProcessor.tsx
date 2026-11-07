import React, { useState, useRef, useTransition } from 'react';
import {
  UploadCloud,
  FileText,
  Lock,
  Unlock,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Binary,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { AlgorithmId, CipherMode, ProcessedFile } from '../types';
import { ALGORITHM_REGISTRY, executeFileCipher } from '../utils/ciphers';
import { formatBytes, generateHexDump } from '../utils/vigenere';

interface FileProcessorProps {
  lang: 'ar' | 'en';
}

export const FileProcessor: React.FC<FileProcessorProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [, startTransition] = useTransition();

  // State
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>('vigenere');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [key, setKey] = useState<string>('KEYWORD');
  const [mode, setMode] = useState<CipherMode>('encrypt');
  const [isBinaryMode, setIsBinaryMode] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'text' | 'hex'>('text');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentAlgoMeta = ALGORITHM_REGISTRY.find((a) => a.id === selectedAlgo) || ALGORITHM_REGISTRY[0];

  // Handle algorithm switch
  const handleSelectAlgorithm = (algoId: AlgorithmId) => {
    setSelectedAlgo(algoId);
    const meta = ALGORITHM_REGISTRY.find((a) => a.id === algoId);
    if (meta) {
      setKey(meta.defaultKey);
    }
    setProcessedFile(null);
  };

  // Sample files for instant testing
  const loadSampleFile = (type: 'text' | 'code' | 'secret') => {
    let name = 'assignment_report.txt';
    let content = 'CS304 LAB SUBMISSION\nStudent: Ahmed Khaled\nID: 2024-CS-0412\nAssignment: Multi-Algorithm File Cipher Suite\nStatus: Verified and complete.';

    if (type === 'code') {
      name = 'student_ciphers.cpp';
      content = '#include <iostream>\nint main() {\n    std::cout << "Student Crypto Engine Active!" << std::endl;\n    return 0;\n}';
    } else if (type === 'secret') {
      name = 'server_keys.csv';
      content = 'host,user,access_token\n192.168.1.100,root,9a8f273b01\nlab-node-02,student,4419cc7b2';
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const sampleBlob = new File([data], name, { type: 'text/plain' });

    setFile(sampleBlob);
    setFileData(data);
    setProcessedFile(null);
    setErrorMsg(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    loadFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const loadFile = (f: File) => {
    setErrorMsg(null);
    setFile(f);
    setProcessedFile(null);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (buffer) {
        setFileData(new Uint8Array(buffer));
      }
    };
    reader.onerror = () => {
      setErrorMsg(isAr ? 'فشل في قراءة الملف المحدد.' : 'Failed to read selected file.');
    };
    reader.readAsArrayBuffer(f);
  };

  const generateRandomKey = () => {
    if (currentAlgoMeta.keyType === 'number') {
      const num = Math.floor(Math.random() * (currentAlgoMeta.maxNumber || 25)) + (currentAlgoMeta.minNumber || 1);
      setKey(num.toString());
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setKey(result);
    }
  };

  const handleProcess = () => {
    if (!fileData || !file) {
      setErrorMsg(isAr ? 'يرجى اختيار ملف أولاً.' : 'Please select a file first.');
      return;
    }
    if (currentAlgoMeta.keyType !== 'none' && !key.trim()) {
      setErrorMsg(isAr ? 'يرجى تحديد المفتاح أو المعامل المطلوب.' : 'Please provide the required parameter.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setProgress(15);

    setTimeout(() => {
      try {
        const startTime = performance.now();
        const resultBytes = executeFileCipher(selectedAlgo, fileData, key, mode, isBinaryMode, (p) => {
          setProgress(p);
        });

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        startTransition(() => {
          setProcessedFile({
            name: file.name,
            size: resultBytes.length,
            type: file.type || 'application/octet-stream',
            originalData: fileData,
            processedData: resultBytes,
            mode,
            algorithmId: selectedAlgo,
            key,
            isBinary: isBinaryMode,
            timeMs: duration,
          });
          setIsProcessing(false);
        });
      } catch (err) {
        setIsProcessing(false);
        setErrorMsg(err instanceof Error ? err.message : 'Unknown processing error');
      }
    }, 40);
  };

  const handleDownload = () => {
    if (!processedFile) return;

    let downloadName = processedFile.name;
    if (processedFile.mode === 'encrypt') {
      downloadName = downloadName.endsWith('.enc') ? downloadName : `${downloadName}.enc`;
    } else {
      downloadName = downloadName.replace(/\.enc$/i, '');
      if (downloadName === processedFile.name) {
        downloadName = `decrypted_${processedFile.name}`;
      }
    }

    const blob = new Blob([processedFile.processedData as unknown as BlobPart], {
      type: processedFile.type,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTestRoundTrip = () => {
    if (!processedFile) return;

    const newMode: CipherMode = processedFile.mode === 'encrypt' ? 'decrypt' : 'encrypt';
    const newName =
      processedFile.mode === 'encrypt'
        ? `${processedFile.name}.enc`
        : processedFile.name.replace(/\.enc$/i, '');

    const newBlob = new File([processedFile.processedData as unknown as BlobPart], newName, {
      type: processedFile.type,
    });

    setFile(newBlob);
    setFileData(processedFile.processedData);
    setMode(newMode);
    setProcessedFile(null);
    setProgress(0);
  };

  const getTextPreview = (bytes: Uint8Array | null, maxChars = 2000): string => {
    if (!bytes) return '';
    try {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      return decoder.decode(bytes.subarray(0, maxChars));
    } catch {
      return isAr ? '[بيانات ثنائية - انتقل لعرض الـ Hex Dump]' : '[Binary stream - Switch to Hex Dump]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Selection Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'اختر خوارزمية التشفير لمعالجة الملف:' : 'Select Encryption Algorithm:'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'مشروع مادة التشفير CS304 - يمكنك تجربة أي خوارزمية وتطبيقها على أي ملف على جهازك.'
                : 'CS304 Lab Suite - select any cipher algorithm to stream across your target file.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">{isAr ? 'عيّنات سريعة:' : 'Quick samples:'}</span>
            <button
              onClick={() => loadSampleFile('text')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              report.txt
            </button>
            <button
              onClick={() => loadSampleFile('code')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              ciphers.cpp
            </button>
            <button
              onClick={() => loadSampleFile('secret')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              server_keys.csv
            </button>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {ALGORITHM_REGISTRY.map((algo) => {
            const isSelected = selectedAlgo === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => handleSelectAlgorithm(algo.id)}
                className={`p-3 rounded-xl border text-start transition-all relative ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] font-semibold text-cyan-400 truncate">
                  {algo.id === 'vigenere' ? (isAr ? 'الأساسية ★' : 'Primary ★') : algo.categoryAr}
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">
                  {isAr ? algo.nameAr.split('(')[0] : algo.nameEn}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                  {algo.formulaEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Upload & Controls | Preview & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dropzone Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              file
                ? 'border-cyan-500/50 bg-cyan-950/20'
                : 'border-slate-700 hover:border-slate-600 bg-slate-900/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center">
                {file ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {file ? file.name : isAr ? 'اسحب وأفلت الملف هنا، أو انقر للاختيار' : 'Drag & drop file here, or click to browse'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {file
                    ? `${formatBytes(file.size)} · ${file.type || 'ملف ثنائي / Binary'}`
                    : isAr
                    ? 'يدعم أي ملف: نصوص، كود C++، صور، وثائق PDF، أرشيف'
                    : 'Supports any file: text, C++ code, images, PDF documents, archives'}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Mode Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'العملية المطلوبة (Mode):' : 'Operation Mode:'}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode('encrypt')}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'encrypt'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تشفير (Encrypt)' : 'Encrypt'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('decrypt')}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'decrypt'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فك تشفير (Decrypt)' : 'Decrypt'}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Key / Parameter Input depending on algorithm */}
            {currentAlgoMeta.keyType !== 'none' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {currentAlgoMeta.id === 'caesar'
                      ? isAr
                        ? 'مقدار الإزاحة (Shift 1-25):'
                        : 'Shift Value (1-25):'
                      : currentAlgoMeta.id === 'railfence'
                      ? isAr
                        ? 'عدد القضبان (Rails 2-10):'
                        : 'Number of Rails (2-10):'
                      : isAr
                      ? 'المفتاح السري (Secret Key):'
                      : 'Secret Key:'}
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomKey}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAr ? 'توليد تلقائي' : 'Randomize'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={currentAlgoMeta.keyType === 'number' ? 'number' : 'text'}
                    min={currentAlgoMeta.minNumber}
                    max={currentAlgoMeta.maxNumber}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={currentAlgoMeta.defaultKey}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  {currentAlgoMeta.nameAr}:
                </span>{' '}
                {isAr
                  ? 'هذه الشفرة متناظرة ذاتياً أو ذات ترتيب ثابت ولا تتطلب إدخال مفتاح إضافي.'
                  : 'This cipher operates deterministically without requiring a secret key parameter.'}
              </div>
            )}

            {/* Binary vs Text pipeline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'نمط قراءة البايتات في دفق C++:' : 'C++ Stream Mode:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsBinaryMode(true)}
                  className={`p-2.5 rounded-lg border text-start transition-colors ${
                    isBinaryMode
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Binary className="w-4 h-4 text-cyan-400 mb-1" />
                  <div className="text-xs font-semibold">{isAr ? 'ثنائي (Binary mod 256)' : 'Binary Stream'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'لجميع أنواع الملفات' : 'All file formats'}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBinaryMode(false)}
                  className={`p-2.5 rounded-lg border text-start transition-colors ${
                    !isBinaryMode
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <FileText className="w-4 h-4 text-cyan-400 mb-1" />
                  <div className="text-xs font-semibold">{isAr ? 'نصي (Text A-Z)' : 'Classical Text'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'يحافظ على التنسيق' : 'Preserves spacing'}</div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{isAr ? 'جاري المعالجة وقراءة البايتات...' : 'Processing file stream...'}</span>
                  <span className="font-mono">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-1.5 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Process Button */}
            <button
              type="button"
              disabled={!fileData || isProcessing}
              onClick={handleProcess}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-sm transition-all ${
                !fileData || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جاري التنفيذ...' : 'Processing...'}</span>
                </>
              ) : mode === 'encrypt' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{isAr ? `تشفير الملف بخوارزمية ${currentAlgoMeta.nameAr.split('(')[0]}` : `Encrypt File with ${currentAlgoMeta.nameEn}`}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{isAr ? `فك تشفير الملف بخوارزمية ${currentAlgoMeta.nameAr.split('(')[0]}` : `Decrypt File with ${currentAlgoMeta.nameEn}`}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Previews & Results Inspection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Results Summary Box */}
          {processedFile ? (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {processedFile.mode === 'encrypt'
                        ? isAr
                          ? 'تم تشفير الملف بنجاح!'
                          : 'File Encrypted Successfully!'
                        : isAr
                        ? 'تم فك تشفير الملف بنجاح!'
                        : 'File Decrypted Successfully!'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {currentAlgoMeta.nameEn} · {formatBytes(processedFile.size)} · {processedFile.timeMs} ms
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestRoundTrip}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'اختبار الاسترجاع' : 'Roundtrip Test'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تنزيل النتيجة' : 'Download File'}</span>
                  </button>
                </div>
              </div>

              {/* Inspection Preview Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <button
                      onClick={() => setActivePreviewTab('text')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activePreviewTab === 'text'
                          ? 'bg-slate-800 text-white'
                          : 'hover:text-slate-200'
                      }`}
                    >
                      {isAr ? 'عرض نصي (Text)' : 'Text Preview'}
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('hex')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activePreviewTab === 'hex'
                          ? 'bg-slate-800 text-white'
                          : 'hover:text-slate-200'
                      }`}
                    >
                      {isAr ? 'عرض سداسي عشري (Hex Dump)' : 'Hex Dump'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const text =
                        activePreviewTab === 'text'
                          ? getTextPreview(processedFile.processedData)
                          : generateHexDump(processedFile.processedData);
                      navigator.clipboard.writeText(text);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copySuccess ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-80 text-slate-300">
                  {activePreviewTab === 'text' ? (
                    <pre className="whitespace-pre-wrap break-all leading-relaxed font-mono">
                      {getTextPreview(processedFile.processedData)}
                    </pre>
                  ) : (
                    <pre className="whitespace-pre leading-relaxed font-mono text-[11px] text-cyan-300">
                      {generateHexDump(processedFile.processedData)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Original File Preview */
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-300">
                    {file
                      ? isAr
                        ? `معاينة الملف الأصلي: ${file.name}`
                        : `Original File Preview: ${file.name}`
                      : isAr
                      ? 'معاينة الملف'
                      : 'File Preview'}
                  </span>
                </div>
                {fileData && (
                  <span className="text-xs text-slate-500 font-mono">
                    {formatBytes(fileData.length)}
                  </span>
                )}
              </div>

              {fileData ? (
                <div className="space-y-3">
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-72 text-slate-300">
                    <pre className="whitespace-pre-wrap break-all leading-relaxed">
                      {getTextPreview(fileData, 1200)}
                    </pre>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center gap-2 text-xs text-slate-400">
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      {isAr
                        ? 'الملف جاهز للمعالجة. انقر على زر البدء لتشغيل الخوارزمية المختارة.'
                        : 'File is ready. Hit the button to execute the selected algorithm stream.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs">
                  <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p>{isAr ? 'لم يتم تحميل أي ملف بعد.' : 'No file loaded yet.'}</p>
                  <p className="mt-1 text-slate-600">
                    {isAr
                      ? 'اختر ملفاً من حاسوبك أو جرب أحد العينات السريعة أعلاه.'
                      : 'Select a file or choose one of the quick samples above.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Student C++ CLI Equivalent Command */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                {isAr ? 'الأمر المقابل في كود C++ الجامعي:' : 'Student C++ Command Line:'}
              </span>
              <button
                onClick={() => {
                  const flag =
                    selectedAlgo === 'caesar'
                      ? '-caesar'
                      : selectedAlgo === 'xor'
                      ? '-xor'
                      : selectedAlgo === 'atbash'
                      ? '-atbash'
                      : selectedAlgo === 'rot13'
                      ? '-rot13'
                      : selectedAlgo === 'railfence'
                      ? '-rail'
                      : '-vigenere';
                  const cmd = `./student_ciphers ${mode === 'encrypt' ? '-e' : '-d'} ${flag} "${key || 'KEY'}" "${
                    file?.name || 'input.txt'
                  }" "${mode === 'encrypt' ? 'output.enc' : 'restored.txt'}"`;
                  navigator.clipboard.writeText(cmd.trim());
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copySuccess ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الأمر' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
              <code>
                {`./student_ciphers ${mode === 'encrypt' ? '-e' : '-d'} ${
                  selectedAlgo === 'caesar'
                    ? '-caesar'
                    : selectedAlgo === 'xor'
                    ? '-xor'
                    : selectedAlgo === 'atbash'
                    ? '-atbash'
                    : selectedAlgo === 'rot13'
                    ? '-rot13'
                    : selectedAlgo === 'railfence'
                    ? '-rail'
                    : '-vigenere'
                } "${key || 'KEY'}" "${file?.name || 'input.txt'}" "${
                  mode === 'encrypt' ? (file?.name ? `${file.name}.enc` : 'output.enc') : 'restored.txt'
                }"`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
