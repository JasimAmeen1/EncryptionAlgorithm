import React from 'react';
import { BookOpen, ShieldAlert, Cpu, Sparkles, Check, ArrowRight } from 'lucide-react';

interface TheorySectionProps {
  lang: 'ar' | 'en';
}

export const TheorySection: React.FC<TheorySectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>{isAr ? 'الأساس العلمي والرياضي لشفرة فيجينري' : 'Theoretical & Mathematical Foundations'}</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {isAr
            ? 'شفرة فيجينري (Vigenère Cipher) هي طريقة لتشفير النصوص الأبجدية باستخدام شكل بسيط من الاستبدال المتعدد الأبجديات (Polyalphabetic Substitution). ظلت هذه الشفرة عصية على الكسر لأكثر من 300 عام، حتى أُطلق عليها لقب "الشفرة غير القابلة للحل" (le chiffre indéchiffrable).'
            : 'The Vigenère Cipher is a polyalphabetic substitution cipher originally described in the 16th century. For over three centuries, it was considered unbreakable and earned the title "le chiffre indéchiffrable".'}
        </p>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Math Model */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{isAr ? '1. النموذج الرياضي الدقيق (Math Formula)' : '1. Exact Mathematical Formula'}</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'يتم تحويل كل حرف من حروف الأبجدية (A-Z) إلى قيمة عددية من 0 إلى 25:'
              : 'Every letter of the alphabet (A–Z) is mapped to an integer in range [0, 25]:'}
          </p>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
            <div>
              <span className="text-slate-400 block mb-1">{isAr ? 'معادلة التشفير:' : 'Encryption:'}</span>
              <code className="text-cyan-300 text-sm font-bold">C_i = (P_i + K_i) mod 26</code>
            </div>
            <div className="pt-2 border-t border-slate-850">
              <span className="text-slate-400 block mb-1">{isAr ? 'معادلة فك التشفير:' : 'Decryption:'}</span>
              <code className="text-emerald-300 text-sm font-bold">P_i = (C_i - K_i + 26) mod 26</code>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {isAr
              ? 'حيث P_i هو الحرف الأصلي، و K_i هو الحرف المقابل من تيار المفتاح المكرر، و C_i هو الحرف المشفر الناتج.'
              : 'Where P_i is the plaintext character, K_i is the repeated keystream character, and C_i is the ciphertext output.'}
          </p>
        </div>

        {/* Byte Stream & File Extension in C++ */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? '2. التوسيع لقراءة ومعالجة الملفات في C++' : '2. File Streaming & Binary Extension'}</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'الملفات الثنائية (الصور، الوثائق، البرامج) لا تقتصر على حروف A-Z، بل تتكون من بايتات تتراوح قيمتها بين 0 و 255. لذلك يستخدم برنامج C++ الحساب الثنائي:'
              : 'Arbitrary binary files contain arbitrary byte values (0–255). The C++ suite extends the modular arithmetic to 256 states:'}
          </p>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
            <div>
              <span className="text-slate-400 block mb-1">{isAr ? 'تشفير البايت في C++:' : 'Byte Encryption in C++:'}</span>
              <code className="text-cyan-300">buffer[i] = (buffer[i] + keyByte) % 256;</code>
            </div>
            <div className="pt-2 border-t border-slate-850">
              <span className="text-slate-400 block mb-1">{isAr ? 'فك التشفير في C++:' : 'Byte Decryption in C++:'}</span>
              <code className="text-emerald-300">buffer[i] = (buffer[i] - keyByte + 256) % 256;</code>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {isAr
              ? 'باستخدام بافر 64KB في C++، يمكن للبرنامج معالجة ملفات بحجم عدة غيغابايت بذاكرة عشوائية ثابتة وسرعة استثنائية.'
              : 'Utilizing a 64KB stream buffer in C++, the program processes multi-gigabyte files with minimal RAM footprint.'}
          </p>
        </div>

        {/* Cryptanalysis & Weakness */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{isAr ? '3. تحليل الشفرة وطرق الكسر (Cryptanalysis)' : '3. Cryptanalysis & Historical Attacks'}</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'على الرغم من قوة الخوارزمية تاريخياً، إلا أنها أصبحت عرضة للكسر بفضل تطور علم تحليل الشفرات:'
              : 'Despite historical endurance, Vigenère was broken in the 19th century through mathematical frequency analysis:'}
          </p>

          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">{isAr ? 'اختبار كازيسكي (Kasiski Examination):' : 'Kasiski Examination:'}</strong>{' '}
              {isAr
                ? 'البحث عن السلاسل النصية المتكررة في النص المشفر وقياس المسافة بينها لتخمين طول المفتاح.'
                : 'Identifies recurring substrings to deduce the secret key length.'}
            </li>
            <li>
              <strong className="text-white">{isAr ? 'مؤشر الصدفة (Index of Coincidence):' : 'Friedman Test:'}</strong>{' '}
              {isAr
                ? 'استخدام الاحتمالات الرياضية لحساب تباين تردد الحروف وتقدير طول المفتاح بدقة إحصائية عالية.'
                : 'Measures letter probability coincidence to statistically isolate key size.'}
            </li>
            <li>
              <strong className="text-white">{isAr ? 'دفتر المرة الواحدة (One-Time Pad):' : 'One-Time Pad (OTP):'}</strong>{' '}
              {isAr
                ? 'إذا كان المفتاح عشوائياً تماماً وله نفس طول الرسالة ولا يُعاد استخدامه قط، تصبح الشفرة غير قابلة للكسر رياضياً بنسبة 100%!'
                : 'If the key is truly random, as long as the message, and never reused, Vigenère becomes an unbreakable One-Time Pad.'}
            </li>
          </ul>
        </div>

        {/* Modern Standards Comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? '4. المقارنة مع خوارزميات التشفير الحديثة' : '4. Modern Cryptographic Comparison'}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 text-start">{isAr ? 'الخاصية' : 'Feature'}</th>
                  <th className="py-2 text-start">Vigenère</th>
                  <th className="py-2 text-start">AES-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                <tr>
                  <td className="py-1.5 text-slate-400">{isAr ? 'النوع' : 'Type'}</td>
                  <td className="py-1.5">Polyalphabetic Stream</td>
                  <td className="py-1.5">Block Cipher (SPN)</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">{isAr ? 'المقاومة للتحليل' : 'Security'}</td>
                  <td className="py-1.5 text-amber-400">{isAr ? 'ضعيفة حديثاً (تعليمية)' : 'Vulnerable'}</td>
                  <td className="py-1.5 text-emerald-400">{isAr ? 'معيار عسكري آمن عالمياً' : 'Military-Grade'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">{isAr ? 'الأداء في C++' : 'Performance'}</td>
                  <td className="py-1.5 text-emerald-400">{isAr ? 'فائق السرعة (عملية واحدة)' : 'Single instruction'}</td>
                  <td className="py-1.5">{isAr ? 'أجهزة AES-NI المتخصصة' : 'Hardware accelerated'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
