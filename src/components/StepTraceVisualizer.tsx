import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, MousePointer } from 'lucide-react';
import { CipherMode, TraceStep } from '../types';

interface StepTraceVisualizerProps {
  steps: TraceStep[];
  lang: 'ar' | 'en';
  mode: CipherMode;
  onSelectStep: (index: number) => void;
  selectedIndex: number | null;
}

export const StepTraceVisualizer: React.FC<StepTraceVisualizerProps> = ({
  steps,
  lang,
  mode,
  onSelectStep,
  selectedIndex,
}) => {
  const isAr = lang === 'ar';
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (steps.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all shadow-sm">
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-start hover:bg-slate-850/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            {isAr ? 'جدول التتبع الحسابي خطوة بخطوة' : 'Step-by-Step Mathematical Trace'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({steps.length} {isAr ? 'محرف' : 'characters'})
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">
            {isAr ? 'انقر على أي سطر لتحديده في المصفوفة' : 'Click any row to trace in matrix'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Table */}
      {isExpanded && (
        <div className="border-t border-slate-800 p-4">
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-xs text-start font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2 px-3 text-start">#</th>
                  <th className="py-2 px-3 text-start">{isAr ? 'الأصل (Plain)' : 'Plain (P)'}</th>
                  <th className="py-2 px-3 text-start">{isAr ? 'المفتاح (Key)' : 'Key (K)'}</th>
                  <th className="py-2 px-3 text-start">{isAr ? 'الحساب الرياضي (Math)' : 'Formula'}</th>
                  <th className="py-2 px-3 text-start">
                    {mode === 'encrypt'
                      ? isAr
                        ? 'المشفر (Cipher)'
                        : 'Cipher (C)'
                      : isAr
                      ? 'المفكوك (Decrypted)'
                      : 'Decrypted'}
                  </th>
                  <th className="py-2 px-3 text-end">{isAr ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {steps.map((st, i) => {
                  const isSelected = selectedIndex === i;
                  return (
                    <tr
                      key={i}
                      onClick={() => onSelectStep(i)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 text-cyan-200'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-500 tabular-nums">{st.index + 1}</td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-white text-sm">
                          {st.plainChar === ' ' ? '␣' : st.plainChar}
                        </span>
                        {!st.isPreserved && (
                          <span className="text-[10px] text-slate-500 ms-1.5 tabular-nums">
                            [{st.plainCode}]
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-cyan-400">{st.keyChar}</span>
                        {!st.isPreserved && (
                          <span className="text-[10px] text-slate-500 ms-1.5 tabular-nums">
                            [+{st.shift}]
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-amber-300 font-sans text-[11px]">
                        {st.formula}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-emerald-400 text-sm">
                          {st.cipherChar === ' ' ? '␣' : st.cipherChar}
                        </span>
                        {!st.isPreserved && (
                          <span className="text-[10px] text-slate-500 ms-1.5 tabular-nums">
                            [{st.cipherCode}]
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-end text-slate-500">
                        <button
                          type="button"
                          className="hover:text-cyan-400 p-1 transition-colors"
                          title={isAr ? 'عرض في المصفوفة' : 'View in matrix'}
                        >
                          <MousePointer className="w-3 h-3 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
