import { Link } from "wouter";
import { Sparkles, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white border-t border-[#D4AF37]/30 py-16">
      <div className="container px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#D4AF37] tracking-tight">تيار رؤية عجلون الوطني</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              إطار وطني مجتمعي جامع يضم أبناء محافظة عجلون للتنمية المستدامة، المشاركة المجتمعية، والاستثمار في الإنسان والموارد المحلية.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>عجلون، المملكة الأردنية الهاشمية</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+962 770000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>info@ajlounvision.jo</span>
              </div>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="font-bold text-[#D4AF37] text-base mb-4">روابط التنقل</h3>
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <Link href="/" className="hover:text-[#D4AF37] hover:underline transition-all">الرئيسية</Link>
              <Link href="/feed" className="hover:text-[#D4AF37] hover:underline transition-all">المنشورات المجتمعية</Link>
              <Link href="/initiatives" className="hover:text-[#D4AF37] hover:underline transition-all">المبادرات التنموية</Link>
              <Link href="/opportunities" className="hover:text-[#D4AF37] hover:underline transition-all">فرص التطوع</Link>
              <Link href="/members" className="hover:text-[#D4AF37] hover:underline transition-all">دليل الأعضاء</Link>
            </div>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="font-bold text-[#D4AF37] text-base mb-4">خدمات وسياسات</h3>
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <Link href="/points" className="hover:text-[#D4AF37] hover:underline transition-all">نقاط الأثر والمتصدرون</Link>
              <Link href="/rewards" className="hover:text-[#D4AF37] hover:underline transition-all">متجر المكافآت</Link>
              <Link href="/privacy" className="hover:text-[#D4AF37] hover:underline transition-all">سياسة الخصوصية</Link>
              <Link href="/terms" className="hover:text-[#D4AF37] hover:underline transition-all">شروط الاستخدام</Link>
              <Link href="/join-terms" className="hover:text-[#D4AF37] hover:underline transition-all">تعليمات الانضمام</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p className="text-center">
            &copy; {new Date().getFullYear()} تيار رؤية عجلون الوطني. جميع الحقوق محفوظة.
          </p>
          
          <div className="flex items-center gap-1.5 text-center">
            <span>تصميم وتطوير</span>
            <span className="text-[#D4AF37] font-semibold">عبدالرحمن الصمادي</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
