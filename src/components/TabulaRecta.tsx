import React, { useState, useMemo } from 'react';
import { Grid, HelpCircle, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface TabulaRectaProps {
  lang: 'ar' | 'en';
  highlightPlain?: string;
  highlightKey?: string;
  highlightCipher?: string;
}

export const TabulaRecta: React.FC<TabulaRectaProps> = ({
  lang,
  highlightPlain = 'A',
  highlightKey = 'L',
  highlightCipher = 'L',
}) => {
  const isAr = lang === 'ar';

  const [selectedRow, setSelectedRow] = useState<number>(() => {
    const k = highlightKey ? highlightKey.toUpperCase().charCodeAt(0) - 65 : 11; // L = 11
    return k >= 0 && k < 26 ? k : 11;
  });

  const [selectedCol, setSelectedCol] = useState<number>(() => {
    const p = highlightPlain ? highlightPlain.toUpperCase().charCodeAt(0) - 65 : 0; // A = 0
    return p >= 0 && p < 26 ? p : 0;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Alphabet A-Z
  const alphabet = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  }, []);

  // Compute intersection character
  const intersectionChar = String.fromCharCode(65 + ((selectedRow + selectedCol) % 26));
  const rowChar = String.fromCharCode(65 + selectedRow);
  const colChar = String.fromCharCode(65 + selectedCol);

  // Auto-play cycling through letters demo
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedCol((prev) => (prev + 1) % 26);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 shadow-sm">
      {/* Header and Explanation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            <span>{isAr ? 'مصفوفة فيجينري (Tabula Recta)' : 'Vigenère Tabula Recta Matrix'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'مصفوفة 26×26 كلاسيكية تحتوي على 26 أبجدية قيصرية متتالية. ابحث عن حرف المفتاح في الصف الرأسي، وحرف النص الأصلي في العمود الأفقي، وسيكون حرف التقاطع هو الحرف المشفر!'
              : 'A classic 26×26 matrix containing 26 shifted Caesar alphabets. Locate your key in the row, plaintext in the column, and their intersection is the encrypted cipher character!'}
          </p>
        </div>

        {/* Playback & Quick Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? (isAr ? 'إيقاف' : 'Pause') : isAr ? 'تشغيل متحرك' : 'Auto Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCol((c) => (c + 1) % 26);
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title={isAr ? 'الحرف التالي' : 'Next Letter'}
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRow(11); // L
              setSelectedCol(0); // A
              setIsPlaying(false);
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title={isAr ? 'إعادة تعيين' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Intersection Status Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">
              {isAr ? 'صف المفتاح (Key Row):' : 'Key Row (K):'}
            </span>
            <span className="text-base font-bold text-cyan-400 font-mono">
              {rowChar} <span className="text-xs text-slate-500 font-normal">({selectedRow})</span>
            </span>
          </div>

          <div className="text-slate-600 font-bold text-lg">✕</div>

          <div>
            <span className="text-slate-500 block text-[11px]">
              {isAr ? 'عمود النص (Plain Col):' : 'Plaintext Col (P):'}
            </span>
            <span className="text-base font-bold text-white font-mono">
              {colChar} <span className="text-xs text-slate-500 font-normal">({selectedCol})</span>
            </span>
          </div>

          <div className="text-slate-600 font-bold text-lg">=</div>

          <div>
            <span className="text-slate-500 block text-[11px]">
              {isAr ? 'حرف التقاطع (Cipher):' : 'Intersection (C):'}
            </span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {intersectionChar}{' '}
              <span className="text-xs text-slate-500 font-normal">
                ({(selectedRow + selectedCol) % 26})
              </span>
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
          ({selectedCol} + {selectedRow}) mod 26 = {(selectedCol + selectedRow) % 26}
        </div>
      </div>

      {/* 26x26 Matrix Table with Fixed Column/Row Headers */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-[500px]">
        <table className="w-full text-center border-collapse text-[10px] sm:text-xs font-mono select-none">
          {/* Top Column Headers: Plaintext (P) */}
          <thead className="bg-slate-950 text-slate-300 sticky top-0 z-20 shadow-sm">
            <tr>
              <th className="p-1 sm:p-2 bg-slate-900 border border-slate-800 sticky left-0 z-30 text-cyan-400 font-bold">
                K \ P
              </th>
              {alphabet.map((letter, colIdx) => {
                const isColActive = selectedCol === colIdx;
                return (
                  <th
                    key={letter}
                    onClick={() => setSelectedCol(colIdx)}
                    className={`p-1 sm:p-1.5 border border-slate-800 cursor-pointer transition-colors ${
                      isColActive
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {letter}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Matrix Rows */}
          <tbody>
            {alphabet.map((rowLetter, rowIdx) => {
              const isRowActive = selectedRow === rowIdx;
              return (
                <tr key={rowLetter}>
                  {/* Left Row Header: Key (K) */}
                  <th
                    onClick={() => setSelectedRow(rowIdx)}
                    className={`p-1 sm:p-1.5 sticky left-0 z-10 border border-slate-800 cursor-pointer font-bold transition-colors ${
                      isRowActive
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-950 text-cyan-400 hover:bg-slate-800'
                    }`}
                  >
                    {rowLetter}
                  </th>

                  {/* Matrix Cells */}
                  {alphabet.map((_, colIdx) => {
                    const isColActive = selectedCol === colIdx;
                    const isIntersection = isRowActive && isColActive;
                    const cellChar = String.fromCharCode(65 + ((rowIdx + colIdx) % 26));

                    let cellStyle = 'text-slate-400 hover:bg-slate-800/80';
                    if (isIntersection) {
                      cellStyle = 'bg-emerald-500 text-slate-950 font-bold ring-2 ring-emerald-300 z-10';
                    } else if (isRowActive) {
                      cellStyle = 'bg-cyan-950/40 text-cyan-200';
                    } else if (isColActive) {
                      cellStyle = 'bg-slate-800/60 text-slate-200';
                    }

                    return (
                      <td
                        key={colIdx}
                        onClick={() => {
                          setSelectedRow(rowIdx);
                          setSelectedCol(colIdx);
                        }}
                        className={`p-1 sm:p-1.5 border border-slate-850 cursor-pointer transition-colors ${cellStyle}`}
                      >
                        {cellChar}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
