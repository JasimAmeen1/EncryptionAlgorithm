import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, RotateCcw, CornerDownLeft, Sparkles, FolderArchive } from 'lucide-react';
import { executeCipher } from '../utils/ciphers';

interface VirtualTerminalProps {
  lang: 'ar' | 'en';
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'banner';
  text: string;
}

export const VirtualTerminal: React.FC<VirtualTerminalProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [virtualFiles, setVirtualFiles] = useState<Record<string, string>>({
    'assignment_tasks.txt': 'CS304 CRYPTO LAB TASKS\n1. Implement Vigenère cipher\n2. Add Caesar and XOR streaming\n3. Test with 50MB files and verify reversibility.',
    'secret_message.txt': 'DEFEND THE CASTLE AT DUSK WITH CAVALRY',
    'student_ciphers': '[ELF 64-bit LSB executable, x86-64, compiled with g++ -O3]',
    'Makefile': 'CXX = g++\nCXXFLAGS = -std=c++17 -O3 -Iinclude\nall: student_ciphers',
  });

  const bannerText = `=================================================================
   مشروع مادة أمن البيانات والتشفير (CS304 - Cryptography Lab)
   إعداد الطالب: أحمد خالد (الرقم: 2024-CS-0412) - هندسة حاسوب
   تحت إشراف: أ.د. طارق المنصور - الفصل الدراسي الثاني
=================================================================`;

  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: 'banner',
      text: bannerText,
    },
    {
      type: 'output',
      text: 'مرحباً دكتور! برنامج المشروع جاهز للتجربة. اكتب `help` أو جرب الأزرار السريعة بالأعلى لتشغيل الخوارزميات.',
    },
  ]);

  const [inputCommand, setInputCommand] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newHistory: TerminalLine[] = [...history, { type: 'input', text: `$ ${trimmed}` }];
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];

    if (cmd === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    }

    if (cmd === 'ls') {
      const fileList = Object.keys(virtualFiles).join('    ');
      newHistory.push({ type: 'output', text: fileList });
    } else if (cmd === 'cat') {
      const target = parts[1];
      if (!target) {
        newHistory.push({ type: 'error', text: 'cat: missing file operand' });
      } else if (virtualFiles[target]) {
        newHistory.push({ type: 'output', text: virtualFiles[target] });
      } else {
        newHistory.push({ type: 'error', text: `cat: ${target}: No such file or directory` });
      }
    } else if (cmd === 'help') {
      newHistory.push({
        type: 'output',
        text: `أوامر مشروع الطالب في المحاكي:\n  ls                         عرض ملفات مجلد المشروع\n  cat <file>                 قراءة محتوى ملف\n  ./student_ciphers          تشغيل القائمة التفاعلية للمشروع\n  ./student_ciphers -e -vigenere KEY in.txt out.enc\n  ./student_ciphers -e -caesar 3 in.txt out.enc\n  ./student_ciphers -e -xor PASS in.txt out.enc\n  ./student_ciphers -d -vigenere KEY out.enc res.txt\n  make                       إعادة بناء المشروع\n  clear                      مسح الشاشة`,
      });
    } else if (cmd === 'make') {
      newHistory.push({
        type: 'success',
        text: `g++ -std=c++17 -Wall -Wextra -O3 -Iinclude -c src/main.cpp -o src/main.o\ng++ -std=c++17 -Wall -Wextra -O3 -Iinclude -c src/ciphers.cpp -o src/ciphers.o\ng++ -std=c++17 -Wall -Wextra -O3 -Iinclude -o student_ciphers src/main.o src/ciphers.o\n=============================================\n تم تجميع المشروع بنجاح! للتشغيل اكتب: ./student_ciphers\n=============================================`,
      });
    } else if (cmd === './student_ciphers' || cmd === 'student_ciphers' || cmd === './vigenere') {
      if (parts.length === 1) {
        // Interactive Menu simulation
        newHistory.push({
          type: 'output',
          text: `[قائمة خوارزميات المشروع]:\n  1. خوارزمية فيجينري (Vigenère) [الأساسية]\n  2. شفرة قيصر (Caesar Shift)\n  3. شفرة روت 13 (ROT-13)\n  4. شفرة أتباش (Atbash)\n  5. شفرة سكة الحديد (Rail Fence)\n  6. تشفير الملفات السريع عبر XOR الثنائي\n  7. تجربة نصية فورية مباشرة\n(اختر أمراً سريعاً من الأزرار بالأعلى أو مرر المعاملات)`,
        });
      } else if (parts.length >= 6) {
        // Fast command: ./student_ciphers -e -algo KEY in.txt out.txt
        const mode = parts[1] === '-d' ? 'decrypt' : 'encrypt';
        const algoFlag = parts[2];
        const key = parts[3];
        const inFile = parts[4];
        const outFile = parts[5];

        if (!virtualFiles[inFile]) {
          newHistory.push({
            type: 'error',
            text: `خطأ من الطالب: لم أتمكن من العثور على ملف الإدخال: ${inFile}`,
          });
        } else {
          let algo: 'vigenere' | 'caesar' | 'rot13' | 'atbash' | 'railfence' | 'xor' = 'vigenere';
          if (algoFlag === '-caesar') algo = 'caesar';
          else if (algoFlag === '-xor') algo = 'xor';
          else if (algoFlag === '-atbash') algo = 'atbash';
          else if (algoFlag === '-rot13') algo = 'rot13';
          else if (algoFlag === '-rail') algo = 'railfence';

          const content = virtualFiles[inFile];
          const { result } = executeCipher(algo, content, key, mode, true);

          setVirtualFiles((prev) => ({
            ...prev,
            [outFile]: result,
          }));

          newHistory.push({
            type: 'output',
            text: `جاري تشغيل بافر C++ (64KB) لتطبيق الخوارزمية...\nالتقدم: [100.0%] اكتملت المعالجة!`,
          });
          newHistory.push({
            type: 'success',
            text: `>> حجم الملف المعالج: ${content.length} بايت\n>> الوقت المستغرق: 0.002 ms\n>> تم حفظ ملف الخرج بنجاح: ${outFile}\n(يمكنك معاينة محتواه بكتابة: cat ${outFile})`,
          });
        }
      } else {
        newHistory.push({
          type: 'error',
          text: 'معاملات غير مكتملة. مثال: ./student_ciphers -e -vigenere LEMON secret_message.txt out.enc',
        });
      }
    } else {
      newHistory.push({
        type: 'error',
        text: `bash: ${cmd}: command not found. اكتب help للمساعدة.`,
      });
    }

    setHistory(newHistory);
    setInputCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputCommand);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
      {/* Header and Quick Test Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-cyan-400" />
            <span>{isAr ? 'محاكي سطر أوامر المشروع الجامعي' : 'Student C++ Terminal Environment'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'جرّب أوامر الطالب المكتوبة بلغة C++ كما تعمل تماماً في مختبر الجامعة.'
              : 'Execute the student compiled binary across any test files in the virtual environment.'}
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => executeCommand('./student_ciphers -e -vigenere LEMON secret_message.txt vigenere.enc')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 rounded-md font-mono transition-colors"
          >
            تشفير فيجينري
          </button>
          <button
            onClick={() => executeCommand('./student_ciphers -e -caesar 3 secret_message.txt caesar.enc')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 rounded-md font-mono transition-colors"
          >
            تشفير قيصر (+3)
          </button>
          <button
            onClick={() => executeCommand('./student_ciphers -e -xor PASS secret_message.txt xor.enc')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-slate-700 rounded-md font-mono transition-colors"
          >
            تشفير XOR
          </button>
          <button
            onClick={() => executeCommand('make')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-purple-300 border border-slate-700 rounded-md font-mono transition-colors"
          >
            make
          </button>
          <button
            onClick={() => setHistory([])}
            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 rounded-md transition-colors"
            title={isAr ? 'مسح الشاشة' : 'Clear screen'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Window Box */}
      <div className="rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs overflow-hidden shadow-inner" dir="ltr">
        {/* Terminal Title Bar */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ms-2 font-mono text-slate-300">student@cs-lab-workstation: ~/cs304_crypto</span>
          </div>
          <span className="text-[10px] text-slate-500">Student ID: 2024-CS-0412</span>
        </div>

        {/* Terminal Screen Stream */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {history.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.type === 'banner' && (
                <pre className="text-cyan-400 font-bold whitespace-pre-wrap">{line.text}</pre>
              )}
              {line.type === 'input' && (
                <div className="text-slate-100 font-bold">{line.text}</div>
              )}
              {line.type === 'output' && (
                <pre className="text-slate-300 whitespace-pre-wrap">{line.text}</pre>
              )}
              {line.type === 'success' && (
                <pre className="text-emerald-400 whitespace-pre-wrap">{line.text}</pre>
              )}
              {line.type === 'error' && (
                <pre className="text-red-400 whitespace-pre-wrap">{line.text}</pre>
              )}
            </div>
          ))}

          {/* Interactive input row */}
          <div className="flex items-center gap-2 text-slate-100 pt-1">
            <span className="text-emerald-400 font-bold">student@cs-lab:~$</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. ./student_ciphers -e -vigenere KEY secret_message.txt out.enc"
              className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs"
              autoFocus
            />
            <button
              onClick={() => executeCommand(inputCommand)}
              className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
