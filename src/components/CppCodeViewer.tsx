import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  FolderArchive,
  Terminal,
  FileCode,
  BookOpen
} from 'lucide-react';
import JSZip from 'jszip';
import { CPP_SOURCE_FILES } from '../data/cppCode';

interface CppCodeViewerProps {
  lang: 'ar' | 'en';
}

export const CppCodeViewer: React.FC<CppCodeViewerProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const currentFile = CPP_SOURCE_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('vigenere_cpp_project');

      CPP_SOURCE_FILES.forEach((f) => {
        folder?.file(f.path, f.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vigenere_cpp_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Zip Downloader */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'الأكواد المصدرية الكاملة بلغة C++' : 'Full C++ Source Code & Project'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {isAr
                ? 'مشروع C++17 متكامل جاهز للتجميع والتشغيل الفوري. يشمل كلاس التشفير، ومعالجة الملفات عبر دفق البايتات السريع، وواجهة سطر الأوامر CLI، وملفات Makefile و CMake.'
                : 'A complete, production-ready C++17 project with high-speed buffered file streaming, modern CLI argument parser, Makefile, and CMake configuration.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 rounded-lg flex items-center gap-2 shadow-sm transition-all"
            >
              <FolderArchive className="w-4 h-4" />
              <span>
                {isZipping
                  ? isAr
                    ? 'جاري الضغط...'
                    : 'Compressing...'
                  : isAr
                  ? 'تحميل كامل المشروع (.ZIP)'
                  : 'Download Full Project (.ZIP)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* File tabs bar */}
        <div className="bg-slate-950 px-4 pt-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            {CPP_SOURCE_FILES.map((file, idx) => {
              const isActive = activeFileIndex === idx;
              return (
                <button
                  key={file.name}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`px-3 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-2 border-t-2 ${
                    isActive
                      ? 'bg-slate-900 text-white border-cyan-400 font-semibold'
                      : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons on active file */}
          <div className="flex items-center gap-1 pb-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded flex items-center gap-1.5 transition-colors"
              title={isAr ? 'نسخ محتوى الملف' : 'Copy file content'}
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadSingleFile}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded flex items-center gap-1.5 transition-colors"
              title={isAr ? 'تنزيل هذا الملف' : 'Download this file'}
            >
              <Download className="w-3 h-3" />
              <span>{isAr ? 'تنزيل' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* File description info bar */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-cyan-300 font-medium">{currentFile.path}</span>
          <span className="text-slate-400">{isAr ? currentFile.descriptionAr : currentFile.descriptionEn}</span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 bg-slate-950 overflow-x-auto max-h-[560px] font-mono text-xs text-slate-200 leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {currentFile.content.split('\n').map((line, lineIdx) => (
                <tr key={lineIdx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="w-12 text-end pe-4 text-slate-600 select-none tabular-nums font-mono">
                    {lineIdx + 1}
                  </td>
                  <td className="whitespace-pre font-mono text-slate-200">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compilation Guide Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? 'طريقة تجميع وتشغيل البرنامج على نظامك' : 'How to Compile and Run in C++'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="text-slate-400 font-sans font-semibold flex items-center justify-between">
              <span>1. عبر GNU G++ / Clang:</span>
            </div>
            <code className="block text-cyan-300 break-all">
              g++ -std=c++17 -O3 -Iinclude src/vigenere.cpp src/main.cpp -o vigenere
            </code>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="text-slate-400 font-sans font-semibold flex items-center justify-between">
              <span>2. عبر أداة Make:</span>
            </div>
            <code className="block text-cyan-300 break-all">
              make
            </code>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="text-slate-400 font-sans font-semibold flex items-center justify-between">
              <span>3. عبر CMake:</span>
            </div>
            <code className="block text-cyan-300 break-all">
              cmake -B build && cmake --build build
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
