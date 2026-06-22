import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="container py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 text-primary">
          <FileText className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">شروط الاستخدام</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          مرحباً بك في المنصة الرقمية لتيار رؤية عجلون الوطني. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والبنود التالية.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <CheckCircle className="w-6 h-6" />
              1. قبول شروط الخدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed">
            <p>
              يعد استخدامك للمنصة، سواء بصفتك زائراً أو عضواً مسجلاً، موافقة كاملة وصريحة على جميع شروط الاستخدام المذكورة هنا. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة أو التسجيل فيها.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <Users className="w-6 h-6" />
              2. إنشاء الحساب وأمان العضوية
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              للاستفادة الكاملة من المنصة والتفاعل مع المبادرات والمنشورات، يتوجب عليك إنشاء حساب شخصي. وتلتزم بالآتي:
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>تقديم معلومات صحيحة ودقيقة ومطابقة للواقع (الاسم الكامل، المنطقة، إلخ).</li>
              <li>الحفاظ على سرية كلمة المرور الخاصة بك وعدم مشاركتها مع أي شخص آخر.</li>
              <li>تحمل المسؤولية الكاملة عن أي أنشطة أو منشورات تتم من خلال حسابك.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <ShieldAlert className="w-6 h-6" />
              3. قواعد السلوك والنشر
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              نهدف إلى جعل منصة رؤية عجلون مساحة مدنية بناءة ومحترمة. يُحظر تماماً نشر أو تبادل أي محتوى يحتوي على:
            </p>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>أي عبارات مسيئة، نابية، عنصرية، أو تحرض على العنف أو الكراهية.</li>
              <li>أي نقاشات سياسية أو طائفية تخرج عن إطار العمل المجتمعي والتنموي.</li>
              <li>أي مواد ترويجية أو إعلانات تجارية لشركات أو أفراد دون موافقة خطية مسبقة من إدارة التيار.</li>
              <li>نشر معلومات مضللة أو أخبار كاذبة تضر بسمعة المحافظة أو المجتمع المحلي.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <FileText className="w-6 h-6" />
              4. حقوق الملكية الفكرية
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed space-y-3">
            <p>
              جميع المواد والرموز والتصاميم والشعارات وقواعد البيانات الموجودة على المنصة هي ملكية فكرية لتيار رؤية عجلون الوطني، ولا يجوز إعادة إنتاجها أو استخدامها تجارياً دون إذن.
            </p>
            <p>
              عندما تنشر محتوى أو فكرة مبادرة على المنصة، فإنك تمنح التيار رخصة غير حصرية لاستضافة وعرض وتوزيع هذا المحتوى لتعزيز أهداف المبادرة.
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <AlertCircle className="w-6 h-6" />
              5. إخلاء المسؤولية والتعديلات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed space-y-3">
            <p>
              يتم تقديم المنصة ومحتوياتها "كما هي". لا تتحمل إدارة التيار أي مسؤولية عن الأضرار الناتجة عن انقطاع الخدمة أو صحة المحتوى المنشور من قبل أطراف ثالثة أو أعضاء.
            </p>
            <p>
              نحتفظ بالحق الكامل في تعديل شروط الاستخدام هذه في أي وقت. وسيتم نشر التعديلات على هذه الصفحة مباشرة وتصبح سارية المفعول فور نشرها.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground mt-8">
          آخر تحديث لشروط الاستخدام: حزيران 2026
        </div>
      </div>
    </div>
  );
}
