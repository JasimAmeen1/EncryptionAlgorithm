/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileProcessor } from './components/FileProcessor';
import { TextPlayground } from './components/TextPlayground';
import { TabulaRecta } from './components/TabulaRecta';
import { VirtualTerminal } from './components/VirtualTerminal';
import { CppCodeViewer } from './components/CppCodeViewer';
import { TheorySection } from './components/TheorySection';
import { StudentNotesView } from './components/StudentNotesView';
import {
  FileText,
  Type,
  Grid,
  Terminal,
  Code,
  BookOpen,
  GraduationCap,
  Sparkles,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('files');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isDark, setIsDark] = useState<boolean>(true);

  // Synchronized state for Tabula Recta inspection
  const [inspectState, setInspectState] = useState<{
    plain: string;
    key: string;
    cipher: string;
  }>({
    plain: 'A',
    key: 'L',
    cipher: 'L',
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  const handleInspectLetter = (plainChar: string, keyChar: string, cipherChar: string) => {
    setInspectState({
      plain: plainChar,
      key: keyChar,
      cipher: cipherChar,
    });
  };

  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* 3-Zone Top Navigation Header */}
      <Header
        activeSection={activeTab}
        onSelectSection={(tabId) => setActiveTab(tabId)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />

      {/* Student Project Hero Banner */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-9 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            {/* Student Course Tag */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 font-medium">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{isAr ? 'مشروع مساق: أمن البيانات وتشفير المعلومات (CS304)' : 'CS304: Cryptography & Security Project'}</span>
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">
                {isAr ? 'إعداد الطالب: أحمد خالد (2024-CS-0412)' : 'Student: Ahmed Khaled (2024-CS-0412)'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {isAr
                ? 'حزمة خوارزميات التشفير وتدفق الملفات بلغة C++'
                : 'C++ Multi-Cipher File Stream Suite'}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isAr
                ? 'مشروع جامعي متكامل يضم خوارزمية فيجينري (Vigenère) الأساسية، إلى جانب شفرة قيصر، ROT13، أتباش، سكة الحديد، وتشفير XOR الثنائي فائق السرعة، مع دعم قراءة وكتابة الملفات ببافر 64KB.'
                : 'A comprehensive computer science student lab project implementing Vigenère, Caesar, ROT13, Atbash, Rail Fence, and binary XOR streaming with full file I/O support.'}
            </p>
          </div>

          {/* Quick Tab Segmented Buttons */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'student'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'مذكرات وحلول أخطاء C++' : 'Student Dev Log'}</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'code'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>{isAr ? 'تحميل كود المشروع الكامل' : 'C++ Source Code'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'files'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isAr ? 'تشفير الملفات (كل الخوارزميات)' : 'File Ciphers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'text'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{isAr ? 'استوديو النصوص والتحليل' : 'Text Studio'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tableau')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'tableau'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{isAr ? 'مصفوفة فيجينري (Tabula Recta)' : 'Tabula Recta Matrix'}</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'terminal'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{isAr ? 'محاكي سطر أوامر C++' : 'Student Terminal'}</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'student'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'ملاحظات الطالب والتقييم' : 'Student Notes & Rubric'}</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'code'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>{isAr ? 'أكواد C++ ومشروع ZIP' : 'C++ Code & ZIP'}</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'theory'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'التقرير والمقارنة العلمية' : 'Theory & Cryptanalysis'}</span>
          </button>
        </div>

        {/* Tab Viewport */}
        <div className="transition-all duration-200">
          {activeTab === 'files' && <FileProcessor lang={lang} />}
          {activeTab === 'text' && (
            <TextPlayground
              lang={lang}
              onInspectLetter={(p, k, c) => {
                handleInspectLetter(p, k, c);
              }}
            />
          )}
          {activeTab === 'tableau' && (
            <TabulaRecta
              lang={lang}
              highlightPlain={inspectState.plain}
              highlightKey={inspectState.key}
              highlightCipher={inspectState.cipher}
            />
          )}
          {activeTab === 'terminal' && <VirtualTerminal lang={lang} />}
          {activeTab === 'student' && <StudentNotesView lang={lang} />}
          {activeTab === 'code' && <CppCodeViewer lang={lang} />}
          {activeTab === 'theory' && <TheorySection lang={lang} />}
        </div>
      </main>

      {/* Footer conforming to Anti-Slop Discipline */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CS304 Cryptography Suite</span>
            <span>·</span>
            <span>{isAr ? 'إعداد الطالب أحمد خالد (2024-CS-0412)' : 'Student Project by Ahmed Khaled'}</span>
            <span>·</span>
            <span>C++17 / GCC Ready</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('student')}
              className="hover:text-slate-300 transition-colors"
            >
              {isAr ? 'تقرير وملاحظات الطالب' : 'Student Notes'}
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-slate-300 transition-colors"
            >
              {isAr ? 'كود C++ الكامل' : 'C++ Code'}
            </button>
            <span>·</span>
            <span>Educational Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
