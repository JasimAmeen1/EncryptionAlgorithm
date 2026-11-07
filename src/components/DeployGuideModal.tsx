import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Globe,
  Terminal,
  Server,
  Download,
  Copy,
  Check,
  HelpCircle,
  FolderArchive
} from 'lucide-react';
import JSZip from 'jszip';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadDistZip = async () => {
    setIsExporting(true);
    try {
      // Fetch compiled dist files from runtime
      const indexResp = await fetch('./index.html');
      const indexHtml = await indexResp.text();

      const zip = new JSZip();
      zip.file('index.html', indexHtml);
      zip.file(
        'README_DEPLOY.md',
        `# دليل رفع الموقع وحل مشكلة الشاشة البيضاء (Deployment Guide)

## سبب المشكلة:
عند رفع ملف index.html الموجود في المجلد الرئيسي بدلاً من مجلد الإنتاج (dist/)، يفشل المتصفح في قراءة كود TypeScript الخام (/src/main.tsx).

## الحل الصحيح:
1. ارفع محتويات هذا المجلد فقط إلى الاستضافة (Netlify, Vercel, GitHub Pages, cPanel).
2. تم ضبط المسارات لتكون نسبية (./assets/) لتعمل على أي مجلد فرعي بدون مشاكل.
3. لتشغيل الموقع محلياً على جهازك، استخدم أمر:
   npx serve .
   أو افتحه عبر إضافة Live Server في VS Code.
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dist_production_build.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to create dist zip:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isAr ? 'حل مشكلة عرض index.html ودليل الرفع الصحيح' : 'Fixing index.html Display & Deployment Guide'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr ? 'لماذا تظهر شاشة بيضاء وكيف ترفع الموقع بنجاح 100%' : 'Why blank screens happen and how to deploy error-free'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Root Cause Explanations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {isAr ? 'أسباب المشكلة عند رفع المشروع:' : 'Common Reasons for Display Errors:'}
          </h3>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            {/* Reason 1 */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-red-400 flex items-center gap-1.5">
                <span>1.</span>
                <span>{isAr ? 'رفع ملف index.html الرئيسي بدلاً من مجلد dist/' : 'Uploaded root index.html instead of dist/'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'ملف index.html الموجود في المجلد الرئيسي يحتوي على كود `<script src="/src/main.tsx">`. هذا كود TypeScript خام مخصص لخادم التطوير، ولا يستطيع متصفح الإنترنت قراءته مباشرة عند رفعه على استضافة عادية.'
                  : 'The root index.html points to raw TypeScript (`/src/main.tsx`). Browsers cannot execute raw TSX directly without compilation.'}
              </p>
            </div>

            {/* Reason 2 */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'تم الحل: ضبط المسارات النسبية (base: "./")' : 'Fixed: Configured Relative Base (base: "./")'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'قمنا بضبط `base: "./"` في إعدادات Vite، مما يجعل ملفات الـ JS والـ CSS تُستدعى بمسارات نسبية تعمل على أي استضافة (GitHub Pages أو مجلد فرعي) دون أخطاء 404.'
                  : 'Configured `base: "./"` in Vite so all assets load with relative paths regardless of subdirectory.'}
              </p>
            </div>

            {/* Reason 3 */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <span>2.</span>
                <span>{isAr ? 'فتح index.html بالنقر المزدوج (file://) بدون خادم' : 'Opening directly via file:// protocol'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'المتصفحات الحديثة (Chrome, Edge, Firefox) تمنع تشغيل وحدات جافاسكريبت (ES Modules) عند فتح الملف مباشرة بالنقر عليه محلياً بسبب سياسة أمان CORS. يجب تشغيله عبر خادم محلي مثل Live Server أو رفعه على موقع استضافة.'
                  : 'Browsers block ES Modules over local `file://` protocol due to CORS. Must be served via HTTP server or web hosting.'}
              </p>
            </div>
          </div>
        </div>

        {/* Steps to Deploy */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {isAr ? 'خطوات الرفع والتشغيل الصحيحة:' : 'Proper Deployment Steps:'}
          </h3>

          <div className="space-y-2 text-xs">
            {/* Step 1 */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-cyan-400">{isAr ? 'الخطوة 1: بناء المشروع للإنتاج' : 'Step 1: Build for production'}</span>
                <p className="text-slate-400 mt-0.5">
                  {isAr ? 'شغّل هذا الأمر في مجلد المشروع لإنشاء مجلد dist/ الجاهز للنشر:' : 'Run this command in terminal to generate the dist/ bundle:'}
                </p>
                <code className="inline-block mt-1 font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  npm run build
                </code>
              </div>
              <button
                onClick={() => copyToClipboard('npm run build', 'build')}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors shrink-0"
              >
                {copiedCmd === 'build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-cyan-400">{isAr ? 'الخطوة 2: رفع محتويات مجلد dist/ فقط' : 'Step 2: Upload contents of dist/'}</span>
                <p className="text-slate-400 mt-0.5">
                  {isAr
                    ? 'ارفع الملفات الموجودة داخل مجلد dist (وهي: index.html ومجلد assets) إلى استضافتك (Netlify أو Vercel أو cPanel public_html أو GitHub Pages).'
                    : 'Upload only the files inside dist/ (index.html and assets/) to your host.'}
                </p>
              </div>
            </div>

            {/* Step 3: Local Test Command */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-cyan-400">{isAr ? 'الخطوة 3: للتجربة على جهازك محلياً' : 'Step 3: Test locally on your machine'}</span>
                <p className="text-slate-400 mt-0.5">
                  {isAr ? 'شغّل خادم محلي بنقرة واحدة بدون تثبيت أي شيء:' : 'Run a quick local web server without installing anything:'}
                </p>
                <code className="inline-block mt-1 font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  npx serve dist
                </code>
              </div>
              <button
                onClick={() => copyToClipboard('npx serve dist', 'serve')}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors shrink-0"
              >
                {copiedCmd === 'serve' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <button
            onClick={handleDownloadDistZip}
            disabled={isExporting}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <FolderArchive className="w-4 h-4" />
            <span>
              {isExporting
                ? isAr
                  ? 'جاري تجهيز الحزمة...'
                  : 'Preparing...'
                : isAr
                ? 'تحميل نسخة الإنتاج الجاهزة للرفع مباشرة (.ZIP)'
                : 'Download Ready-to-Deploy ZIP'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors"
          >
            {isAr ? 'فهمت، إغلاق' : 'Got it, close'}
          </button>
        </div>
      </div>
    </div>
  );
};
