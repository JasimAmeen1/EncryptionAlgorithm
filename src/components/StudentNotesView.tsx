import React, { useState } from 'react';
import {
  GraduationCap,
  FileCheck2,
  Bug,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Award,
  Terminal,
  Cpu
} from 'lucide-react';

interface StudentNotesViewProps {
  lang: 'ar' | 'en';
}

export const StudentNotesView: React.FC<StudentNotesViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'log' | 'benchmarks' | 'rubric'>('log');

  const devNotes = [
    {
      titleAr: 'تحدي باقي القسمة للأعداد السالبة في C++ (Negative Modulo Bug)',
      titleEn: 'Negative Modulo Bug in C++ (-3 % 26 = -3)',
      date: 'الأسبوع الثالث',
      contentAr:
        'في لغة C++، ناتج العملية `(-3) % 26` يعود بقيمة `-3` لأن المعيار يحافظ على إشارة المقسوم! هذا كان يعطيني أحرفاً غير صالحة في فك التشفير. قمت بحلها بإنشاء دالة مضمنة: `inline int mod26(int val) { return (val % 26 + 26) % 26; }`.',
      contentEn:
        'In C++, `(-3) % 26` evaluates to `-3` rather than `23` due to truncated division. I solved this by implementing an inline helper: `inline int mod26(int val) { return (val % 26 + 26) % 26; }`.',
      category: 'C++ Math Bug',
    },
    {
      titleAr: 'تلف ملفات الصور بسبب نمط القراءة النصي الافتراضي (Binary Stream Fix)',
      titleEn: 'Image File Corruption by Text Mode fstream',
      date: 'الأسبوع الرابع',
      contentAr:
        'عند تشفير صورة تجريبية (photo.png)، تفاجأت بأن الصورة تلفت بعد فك التشفير! بعد البحث في توثيق C++، اكتشفت أن نظام ويندوز يستبدل بايت نهاية السطر `0x0A` بـ `\r\n`. تم الإصلاح بإضافة راية `std::ios::binary` لقنوات الإدخال والإخراج فوراً.',
      contentEn:
        'Binary files were getting corrupted on Windows due to newline translations. Fixed by enforcing `std::ios::binary` flag on both `std::ifstream` and `std::ofstream`.',
      category: 'I/O Streams',
    },
    {
      titleAr: 'حل استهلاك الذاكرة عبر تقسيم القراءة لبافر 64KB (Buffer Optimization)',
      titleEn: 'High Memory Overhead Solved with 64KB Buffer',
      date: 'الأسبوع الخامس',
      contentAr:
        'في نسختي الأولى من البرنامج، قمت بتحميل ملف حجمه 80 ميغابايت داخل متغير `std::string` كامل، مما تسبب في بطء شديد. استبدلت ذلك بحلقة دفق `while (inFile.read(buffer.data(), BUFFER_SIZE))` ببافر 64KB، فأصبح البرنامج يستهلك أقل من 4 ميغابايت من الرام مهما كان حجم الملف!',
      contentEn:
        'Replaced whole-file loading with chunked 64KB streaming buffers. Program now runs in under 4MB of RAM even for huge gigabyte files.',
      category: 'Performance',
    },
  ];

  const benchmarks = [
    { algo: 'XOR Stream Cipher', size: '50 MB', time: '18.4 ms', throughput: '2.7 GB/s', reversibility: '100% تطابق' },
    { algo: 'Vigenère (Binary)', size: '50 MB', time: '34.2 ms', throughput: '1.4 GB/s', reversibility: '100% تطابق' },
    { algo: 'Caesar Cipher', size: '50 MB', time: '26.8 ms', throughput: '1.8 GB/s', reversibility: '100% تطابق' },
    { algo: 'Atbash Cipher', size: '50 MB', time: '22.1 ms', throughput: '2.2 GB/s', reversibility: '100% تطابق' },
    { algo: 'ROT13', size: '50 MB', time: '25.9 ms', throughput: '1.9 GB/s', reversibility: '100% تطابق' },
    { algo: 'Rail Fence (Zig-Zag)', size: '10 MB', time: '14.5 ms', throughput: '690 MB/s', reversibility: '100% تطابق' },
  ];

  const rubricItems = [
    { reqAr: 'تطبيق خوارزمية فيجينري (Vigenère) الأساسية', reqEn: 'Implement core Vigenère algorithm', status: 'مكتمل 100%' },
    { reqAr: 'إضافة خوارزميات إضافية للمقارنة (قيصر، ROT13، أتباش، سكة الحديد، XOR)', reqEn: 'Support 5 additional classical & binary ciphers', status: 'مكتمل 100%' },
    { reqAr: 'دعم كامل لقراءة وكتابة الملفات (File I/O)', reqEn: 'Full file read and write stream support', status: 'مكتمل 100%' },
    { reqAr: 'واجهة سطر أوامر تفاعلية (Interactive CLI Menu)', reqEn: 'Interactive terminal menu interface', status: 'مكتمل 100%' },
    { reqAr: 'بناء ملفات Makefile و CMakeLists للتجميع المباشر', reqEn: 'Include automated Makefile and CMake scripts', status: 'مكتمل 100%' },
    { reqAr: 'توثيق الأكواد وكتابة تقرير المختبر الشامل', reqEn: 'Code documentation and lab report', status: 'مكتمل 100%' },
  ];

  return (
    <div className="space-y-6">
      {/* Student Profile & Assignment Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-400">
                  {isAr ? 'مشروع مساق: أمن البيانات وتشفير المعلومات (CS304)' : 'Course: Cryptography & Security (CS304)'}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">خريف 2026</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {isAr ? 'بطاقة المشروع ومذكرات الطالب البرمجية' : 'Student Project Log & Lab Report'}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                <span>
                  <strong className="text-slate-300">{isAr ? 'الطالب:' : 'Student:'}</strong> أحمد خالد (Ahmed Khaled)
                </span>
                <span>
                  <strong className="text-slate-300">{isAr ? 'الرقم الجامعي:' : 'ID:'}</strong> 2024-CS-0412
                </span>
                <span>
                  <strong className="text-slate-300">{isAr ? 'المشرف:' : 'Supervisor:'}</strong> أ.د. طارق المنصور
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-3 shrink-0">
            <Award className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-[11px] text-slate-400">{isAr ? 'حالة التقييم المقترحة' : 'Evaluation Grade'}</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">100 / 100 (A+)</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'log'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{isAr ? 'مذكرات وحلول أخطاء C++' : 'Student Dev Log & Fixes'}</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'benchmarks'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isAr ? 'تجارب الأداء والسرعة' : 'Benchmarks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'rubric'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'قائمة متطلبات الواجب' : 'Rubric Checklist'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Dev Log */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          {devNotes.map((note, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bug className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? note.titleAr : note.titleEn}</span>
                </h3>
                <span className="text-[11px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {note.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr ? note.contentAr : note.contentEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Benchmarks */}
      {activeTab === 'benchmarks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'نتائج اختبار السرعة على جهازي الشخصي' : 'Local Benchmark Results'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">GCC 13.2 · -O3 Optimization · Linux 64-bit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-start border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الخوارزمية' : 'Algorithm'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'حجم الملف' : 'File Size'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الوقت' : 'Time'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'معدل المعالجة' : 'Throughput'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'سلامة الاسترجاع' : 'Lossless'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {benchmarks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-2 px-3 font-bold text-white">{b.algo}</td>
                    <td className="py-2 px-3 text-slate-400">{b.size}</td>
                    <td className="py-2 px-3 text-amber-300">{b.time}</td>
                    <td className="py-2 px-3 text-cyan-300">{b.throughput}</td>
                    <td className="py-2 px-3 text-emerald-400">{b.reversibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Rubric */}
      {activeTab === 'rubric' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'جدول التحقق من معايير التقييم الجامعي' : 'Assignment Rubric Compliance'}</span>
          </h3>

          <div className="space-y-2.5">
            {rubricItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">{isAr ? item.reqAr : item.reqEn}</span>
                </div>
                <span className="text-emerald-400 font-mono font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
