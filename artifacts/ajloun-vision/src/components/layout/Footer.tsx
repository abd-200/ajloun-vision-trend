import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-3">تيار رؤية عجلون الوطني</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              المنصة الرقمية المدنية لمحافظة عجلون. نجمع المواطنين ندعم المبادرات المجتمعية ونعزز المشاركة الفعّالة.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">روابط سريعة</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <Link href="/feed" className="hover:text-primary transition-colors">المنشورات المجتمعية</Link>
              <Link href="/initiatives" className="hover:text-primary transition-colors">المبادرات</Link>
              <Link href="/opportunities" className="hover:text-primary transition-colors">الفرص والتطوع</Link>
              <Link href="/members" className="hover:text-primary transition-colors">الأعضاء</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">خدمات</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/points" className="hover:text-primary transition-colors">نقاطي والمتصدرون</Link>
              <Link href="/rewards" className="hover:text-primary transition-colors">متجر المكافآت</Link>
              <Link href="/notifications" className="hover:text-primary transition-colors">الإشعارات</Link>
              <Link href="/accessibility" className="hover:text-primary transition-colors">إمكانية الوصول</Link>
              <Link href="/about" className="hover:text-primary transition-colors">عن التيار</Link>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} تيار رؤية عجلون الوطني. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">شروط الاستخدام</Link>
            <Link href="/join-terms" className="hover:text-primary transition-colors">شروط الانضمام</Link>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            تصميم وتطوير <span className="text-primary font-medium">عبدالرحمن الصمادي</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
