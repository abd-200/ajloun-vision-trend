import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, Eye, FileText, HelpCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 text-primary">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">سياسة الخصوصية</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          نحن في تيار رؤية عجلون الوطني نولي أهمية قصوى لخصوصية بياناتك وسريتها. توضح هذه الصفحة كيفية جمعنا للبيانات واستخدامها وحمايتها.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <Lock className="w-6 h-6" />
              1. جمع المعلومات ومعالجتها
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              عند تسجيلك كعضو أو مشاركتك في المبادرات أو التفاعل مع المنصة، قد نقوم بجمع معلومات محددة تشمل:
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>المعلومات الشخصية: مثل الاسم الكامل، البريد الإلكتروني، والمنطقة السكنية داخل محافظة عجلون.</li>
              <li>بيانات الملف الشخصي: مثل السيرة الذاتية الذاتية والمهارات والاهتمامات التي تشاركها طواعية.</li>
              <li>بيانات التفاعل: مثل المنشورات والتعليقات والفرص التطوعية ونقاط الأثر والمكافآت التي تجمعها.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <Eye className="w-6 h-6" />
              2. كيف نستخدم معلوماتك؟
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              نستخدم البيانات التي نجمعها لتقديم تجربة مستخدم أفضل وتطوير مجتمع عجلون الرقمي:
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>تخصيص لوحة التحكم والملف الشخصي وحساب نقاط الأثر وعرض الأوسمة الخاصة بك.</li>
              <li>تنسيق الأنشطة التطوعية وربطك بالمبادرات المناسبة لمهاراتك واهتماماتك.</li>
              <li>إرسال الإشعارات والرسائل التحديثية المتعلقة بنشاطات التيار والمبادرات المقامة في عجلون.</li>
              <li>تحسين جودة المنصة وتقديم ميزات أمان متقدمة لجميع الأعضاء.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <ShieldCheck className="w-6 h-6" />
              3. أمن البيانات وحمايتها
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed space-y-3">
            <p>
              نحن نلتزم بتطبيق معايير أمنية صارمة وتقنية لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفشاء أو الإتلاف. 
            </p>
            <p>
              يتم تخزين جميع معلومات الحساب وكلمات المرور بشكل مشفر وآمن للغاية، كما نمنع مشاركة أو بيع بيانات الأعضاء لأي جهة تجارية أو طرف ثالث على الإطلاق.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <FileText className="w-6 h-6" />
              4. ملفات تعريف الارتباط (Cookies)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed">
            <p>
              تستخدم المنصة ملفات تعريف الارتباط التقنية الأساسية لحفظ جلسة تسجيل دخولك وتذكر تفضيلاتك الخاصة (مثل إعدادات إمكانية الوصول والألوان). يمكنك ضبط متصفحك لرفض ملفات تعريف الارتباط، ولكن قد يؤثر ذلك على عمل بعض أجزاء الموقع بشكل صحيح.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <HelpCircle className="w-6 h-6" />
              5. حقوقك كعضو والتواصل معنا
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed space-y-3">
            <p>
              لديك الحق الكامل في مراجعة بياناتك الشخصية، تعديلها من خلال صفحة الملف الشخصي، أو طلب حذف حسابك بالكامل من المنصة في أي وقت.
            </p>
            <p>
              إذا كانت لديك أي استفسارات أو ملاحظات حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني المخصص للدعم الفني للمنصة.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground mt-8">
          آخر تحديث لسياسة الخصوصية: حزيران 2026
        </div>
      </div>
    </div>
  );
}
