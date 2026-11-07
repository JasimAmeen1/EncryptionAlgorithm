import React from 'react';
import { GraduationCap, Moon, Sun, Globe } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  lang,
  onToggleLang,
  isDark,
  onToggleDark,
}) => {
  const isAr = lang === 'ar';

  const navItems = [
    { id: 'files', labelAr: 'تشفير الملفات', labelEn: 'File Ciphers' },
    { id: 'text', labelAr: 'استوديو النصوص', labelEn: 'Text Studio' },
    { id: 'tableau', labelAr: 'مصفوفة فيجينري', labelEn: 'Tabula Recta' },
    { id: 'terminal', labelAr: 'محاكي سطر أوامر C++', labelEn: 'Student CLI' },
    { id: 'student', labelAr: 'ملاحظات الطالب والتقييم', labelEn: 'Student Notes' },
    { id: 'code', labelAr: 'كود C++ والتحميل', labelEn: 'C++ Code' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark with student context */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <button
            onClick={() => onSelectSection('files')}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <span>{isAr ? 'مختبر التشفير CS304' : 'CryptoLab CS304'}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
              C++ Student Edition
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors whitespace-nowrap shrink-0"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          <button
            onClick={onToggleDark}
            className="p-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
            title={isDark ? (isAr ? 'الوضع النهاري' : 'Light Mode') : (isAr ? 'الوضع الليلي' : 'Dark Mode')}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => onSelectSection('code')}
            className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'تحميل كود المشروع' : 'Download Project'}
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="lg:hidden border-t border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {isAr ? item.labelAr : item.labelEn}
            </button>
          );
        })}
      </div>
    </header>
  );
};
