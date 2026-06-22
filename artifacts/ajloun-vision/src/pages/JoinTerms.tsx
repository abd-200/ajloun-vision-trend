import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Compass, Trophy, Star, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function JoinTerms() {
  return (
    <div className="container py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 text-primary">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">شروط وتعليمات الانضمام</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          يهدف تيار رؤية عجلون الوطني إلى بناء مجتمع متلاحم ومتطوع. توضح هذه الوثيقة حقوقك والتزاماتك ونظام احتساب الأثر والأوسمة للأعضاء.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <CheckCircle2 className="w-6 h-6" />
              1. معايير الانتساب والعضوية
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              يُرحب تيار رؤية عجلون بانضمام جميع المواطنين المهتمين بنماء وتطور محافظة عجلون. شروط الانتساب الأساسية هي:
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>الاهتمام الفعلي بالعمل التطوعي والتنمية المجتمعية في محافظة عجلون.</li>
              <li>التحلي بالأخلاق العالية والعمل بروح الفريق الواحد لدعم المبادرات.</li>
              <li>الالتزام التام بالحيادية وعدم ترويج أي شعارات سياسية أو حزبية أو مصالح شخصية ضيقة عبر المنصة.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <Star className="w-6 h-6" />
              2. نظام نقاط الأثر والمكافآت (Points & Impact)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              تعتمد المنصة على تقدير مجهودات الأعضاء بشكل رقمي ملموس من خلال "نقاط الأثر":
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>**اكتساب النقاط**: تمنح النقاط بناءً على مشاركتك في المبادرات، وتطوعك في الفرص المتاحة، وقيادتك للأنشطة، ونشر محتوى هادف للمجتمع.</li>
              <li>**استبدال المكافآت**: يمكنك استخدام نقاطك المتراكمة لاسترداد مكافآت معنوية أو عينية من "متجر المكافآت" المتاح على المنصة، وهي مكافآت رمزية مقدمة من شركاء التيار لدعم متطوعينا.</li>
              <li>**الأوسمة (Badges)**: تُمنح أوسمة تقديرية خاصة للأعضاء الذين يتجاوزون مستويات محددة من الأثر أو يقودون مبادرات ناجحة.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <Compass className="w-6 h-6" />
              3. حقوق وواجبات العضو المبادر
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              بصفتك عضواً في التيار، يحق لك الاستفادة من جميع أدوات المنصة لتطوير عجلون:
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>**الواجبات**: الالتزام بالمواعيد عند التطوع في الفرص، وتقديم تقارير أو تحديثات صادقة حول المبادرات التي تقودها.</li>
              <li>**الحقوق**: اقتراح مبادرات جديدة، الحصول على التوجيه والدعم من منسقي التيار، والظهور في قائمة المتصدرين للأعضاء الأكثر أثراً.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <ShieldAlert className="w-6 h-6" />
              4. تعليق العضوية وإجراءات المخالفات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed space-y-3">
            <p>
              تحتفظ إدارة تيار رؤية عجلون بالحق في مراجعة الأنشطة والمنشورات. قد يؤدي عدم الالتزام بميثاق السلوك أو محاولة التلاعب بنظام النقاط إلى:
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>تنبيه العضو وتوجيه إرشاد خاص له من المنسقين.</li>
              <li>تجميد النقاط أو حسم جزء منها في حال ثبت عدم جدية المشاركة أو التطوع الفعلي.</li>
              <li>تعليق الحساب أو إلغاء العضوية بالكامل في حال تكرار المخالفات الجسيمة كالإساءة أو التحريض.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <Award className="w-6 h-6" />
              5. ميثاق الشرف والالتزام الأخلاقي
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed">
            <p>
              يقر العضو عند إتمام تسجيله بأن دافعه الأساسي هو حب عجلون والرغبة الصادقة في نفع مجتمعه المحلي، متعهداً بالالتزام بجميع التعليمات والنظم واللوائح الصادرة عن تيار رؤية عجلون الوطني لضمان رفعة وجودة العمل التطوعي.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground mt-8">
          آخر تحديث لتعليمات الانضمام: حزيران 2026
        </div>
      </div>
    </div>
  );
}
