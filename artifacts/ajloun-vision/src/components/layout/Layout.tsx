import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { useHealthCheck, isMockModeActive, resetMockDatabase } from "@workspace/api-client-react";
import { WifiOff, Info, RotateCcw } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const { data, isError } = useHealthCheck();
  const isMock = isMockModeActive() || data?.status === "mock";

  const handleReset = () => {
    if (confirm("هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات المحلية وتهيئة المنصة من جديد؟")) {
      resetMockDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20">
      {isMock ? (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs md:text-sm font-medium flex items-center justify-center flex-wrap gap-x-4 gap-y-1 border-b border-emerald-700/20 shadow-sm animate-fade-in" dir="rtl">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 shrink-0" />
            <span>📢 تعمل المنصة حالياً في <strong>وضع التجربة المحلي (Local Demo Mode)</strong>. جميع حساباتك وعملياتك تحفظ في متصفحك محلياً بالكامل.</span>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 active:bg-white/40 px-2.5 py-1 rounded text-xs font-bold transition-all border border-white/20 mr-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة تعيين البيانات
          </button>
        </div>
      ) : isError ? (
        <div className="bg-amber-500 text-amber-950 px-4 py-3 text-center text-xs md:text-sm font-bold flex items-center justify-center gap-2 border-b border-amber-600/20" dir="rtl">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>⚠️ خادم البيانات غير متصل! يرجى التأكد من تشغيل خادم الباك إند (api-server) وربطه بمتغير البيئة VITE_API_URL لتفعيل التسجيل وتصفح كامل المحتوى.</span>
        </div>
      ) : null}
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
