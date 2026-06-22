import { useListKnowledge } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Target, Lightbulb, Compass, Milestone, Flag, Heart, Users, 
  Scale, Sparkles, Shield, Leaf, Eye, Handshake, Globe, CheckCircle2 
} from "lucide-react";

export default function About() {
  const { data: knowledge, isLoading } = useListKnowledge();

  // Helper to check if database has records for a section
  const getDbSection = (category: string) => {
    return knowledge?.filter(k => k.category === category).sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
  };

  const dbVision = getDbSection("vision");
  const dbMission = getDbSection("mission");
  const dbPillars = getDbSection("pillars");
  const dbGoals = getDbSection("goals");
  const dbValues = getDbSection("values");

  // Fallback static data representing the official detailed content
  const fallbackVision = "عجلون نموذج وطني رائد في التنمية المستدامة والمشاركة المجتمعية والاستثمار في الإنسان والموارد المحلية.";
  
  const fallbackMission = "توحيد الجهود والطاقات والخبرات في محافظة عجلون ضمن إطار وطني مجتمعي يعمل على تقديم الرؤى والمبادرات والأفكار التي تسهم في تطوير المحافظة، وتعزيز دور أبنائها في الحياة العامة، ودعم مسيرة التنمية المستدامة، وبناء شراكات فاعلة تخدم حاضر عجلون ومستقبلها.";

  const fallbackValues = [
    { title: "الانتماء الوطني", icon: <Flag className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "العمل التطوعي", icon: <Heart className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "المسؤولية المجتمعية", icon: <Users className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "الشراكة والتعاون", icon: <Globe className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "الشفافية والمصداقية", icon: <Eye className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "العدالة وتكافؤ الفرص", icon: <Scale className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "الابتكار والإبداع", icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "الاستدامة", icon: <Leaf className="w-5 h-5 text-[#D4AF37]" /> },
    { title: "احترام التنوع والاختلاف", icon: <Shield className="w-5 h-5 text-[#D4AF37]" /> },
  ];

  const fallbackPillars = [
    { title: "أولاً: الانتماء الوطني", desc: "الالتزام بالثوابت الوطنية الأردنية والولاء للقيادة الهاشمية، والإيمان بأن خدمة عجلون جزء من خدمة الأردن وتعزيز مسيرته التنموية." },
    { title: "ثانياً: الإنسان محور التنمية", desc: "الاستثمار في الشباب والمرأة والكفاءات الوطنية باعتبارهم الركيزة الأساسية للتقدم والنهوض المجتمعي." },
    { title: "ثالثاً: المشاركة المجتمعية", desc: "تعزيز مشاركة المواطنين في الحوار وصناعة الرأي العام والمبادرات المجتمعية والشأن العام المحلي." },
    { title: "رابعاً: التنمية المستدامة", desc: "تبني رؤى ومبادرات تحقق التوازن بين التنمية الاقتصادية والاجتماعية والبيئية وتحافظ على حقوق الأجيال القادمة." },
    { title: "خامساً: الاقتصاد المنتج", desc: "دعم الاستثمار وريادة الأعمال والمشاريع الإنتاجية وتعزيز البيئة الجاذبة للنمو الاقتصادي وخلق فرص العمل." },
    { title: "سادساً: الهوية والتراث", desc: "الحفاظ على الإرث التاريخي والثقافي والحضاري والطبيعي لعجلون وتعزيزه باعتباره جزءاً من الهوية الوطنية الأردنية." },
    { title: "سابعاً: البيئة والاستدامة", desc: "حماية الغابات والثروات الطبيعية وتعزيز مفهوم التنمية الخضراء والحفاظ على التوازن البيئي." },
    { title: "ثامناً: التحديث والابتكار", desc: "الانفتاح على المعرفة والتكنولوجيا والحلول الحديثة والاستفادة منها في تطوير الخدمات وتحسين الأداء ورفع كفاءة العمل التنموي." },
  ];

  const fallbackGoals = [
    "المساهمة في صياغة رؤى تنموية مستقبلية للمحافظة.",
    "دعم المبادرات والمشاريع ذات الأثر الاقتصادي والاجتماعي.",
    "تعزيز ثقافة المشاركة المجتمعية والعمل التطوعي.",
    "تمكين الشباب وإعداد قيادات مجتمعية فاعلة.",
    "دعم المرأة وتعزيز دورها في التنمية وصناعة القرار.",
    "تشجيع الاستثمار واستقطاب الفرص الاقتصادية.",
    "دعم القطاعات السياحية والزراعية والإنتاجية.",
    "الحفاظ على البيئة والموارد الطبيعية.",
    "تعزيز الهوية الثقافية والتراثية للمحافظة.",
    "المساهمة في تحسين جودة الخدمات والبنية التحتية.",
    "بناء شراكات مع المؤسسات الوطنية والقطاع الخاص ومؤسسات المجتمع المدني.",
    "إعداد الدراسات وأوراق السياسات والمقترحات التي تخدم المحافظة."
  ];

  if (isLoading) {
    return (
      <div className="container py-16 px-4 max-w-4xl space-y-12 bg-[#FDFBF7]" dir="rtl">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-16" dir="rtl">
      <div className="container px-4 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-20">
          <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 font-bold mb-3 px-4 py-1">من نحن</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B4332] mb-6">تيار رؤية عجلون الوطني</h1>
          <div className="w-24 h-1.5 bg-[#D4AF37] mx-auto mb-8 rounded-full" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            إطار وطني مجتمعي جامع يضم أبناء محافظة عجلون من مختلف المناطق والقطاعات والتخصصات والخبرات، ويعمل على توحيد الطاقات والإمكانات المحلية للمساهمة في بناء مستقبل أكثر ازدهاراً للمحافظة.
          </p>
        </div>

        {/* Detailed Intro Section */}
        <div className="bg-white border border-[#C8C8B4]/20 rounded-2xl p-8 md:p-12 shadow-sm mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2.5 h-full bg-[#2D6A4F]" />
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6">تعريف بالتيار</h2>
          <div className="space-y-6 text-[#2D6A4F] md:text-lg leading-relaxed font-light">
            <p>
              ينطلق التيار من إيمان راسخ بأن عجلون تمتلك من المقومات الطبيعية والبشرية والتاريخية والثقافية ما يؤهلها لتكون نموذجاً وطنياً رائداً في التنمية، وأن أبناءها هم الشريك الأساسي في رسم مستقبلها وصناعة أولوياتها والمساهمة في تنفيذها.
            </p>
            <p>
              ويؤمن التيار بأن التنمية الحقيقية لا تقوم على المشاريع وحدها، بل تبدأ بالإنسان، وتعتمد على بناء الوعي، وتعزيز روح المبادرة، وتمكين الشباب والمرأة، والاستفادة من الخبرات والكفاءات الوطنية، وتحويل الأفكار إلى برامج ومبادرات ومشاريع قادرة على إحداث أثر إيجابي ومستدام في حياة المواطنين.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white border border-[#C8C8B4]/20 shadow-sm overflow-hidden flex flex-col">
            <div className="h-2 w-full bg-[#2D6A4F]" />
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3 text-[#1B4332]">
                <Lightbulb className="w-7 h-7 text-[#D4AF37]" />
                رؤيتنا
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-light">
                {dbVision.length > 0 ? dbVision[0].contentAr : fallbackVision}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#C8C8B4]/20 shadow-sm overflow-hidden flex flex-col">
            <div className="h-2 w-full bg-[#D4AF37]" />
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3 text-[#1B4332]">
                <Target className="w-7 h-7 text-[#2D6A4F]" />
                رسالتنا
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-light">
                {dbMission.length > 0 ? dbMission[0].contentAr : fallbackMission}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <section className="bg-white border border-[#C8C8B4]/20 rounded-2xl p-8 md:p-12 shadow-sm mb-16">
          <div className="text-center mb-10">
            <Badge className="bg-[#D4AF37]/15 text-[#AA820A] hover:bg-[#D4AF37]/25 font-bold mb-2">قيمنا</Badge>
            <h2 className="text-3xl font-bold text-[#1B4332]">القيم التي تحكم مسيرتنا</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dbValues.length > 0 ? (
              dbValues.map((v, i) => (
                <div key={v.id} className="flex items-center gap-4 p-4 bg-[#FDFBF7] rounded-xl border border-[#C8C8B4]/15">
                  <div className="p-2 bg-[#2D6A4F]/10 rounded-lg">
                    {fallbackValues[i % fallbackValues.length]?.icon || <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#1B4332]">{v.titleAr}</h4>
                    {v.contentAr && <p className="text-xs text-muted-foreground mt-1">{v.contentAr}</p>}
                  </div>
                </div>
              ))
            ) : (
              fallbackValues.map((v, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[#FDFBF7] rounded-xl border border-[#C8C8B4]/15">
                  <div className="p-2 bg-[#2D6A4F]/10 rounded-lg">
                    {v.icon}
                  </div>
                  <h4 className="font-bold text-base text-[#1B4332]">{v.title}</h4>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Pillars Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 font-bold mb-2">مرتكزاتنا</Badge>
            <h2 className="text-3xl font-bold text-[#1B4332]">المرتكزات الأساسية الثمانية</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {dbPillars.length > 0 ? (
              dbPillars.map((p, i) => (
                <Card key={p.id} className="hover:shadow-md transition-all duration-300 border-[#C8C8B4]/20 bg-white">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold text-[#1B4332] flex items-center justify-center font-bold text-lg shrink-0">
                      {i + 1}
                    </div>
                    <CardTitle className="text-lg font-bold text-[#1B4332]">{p.titleAr}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">{p.contentAr}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              fallbackPillars.map((p, i) => (
                <Card key={i} className="hover:shadow-md transition-all duration-300 border-[#C8C8B4]/20 bg-white">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold text-[#1B4332] flex items-center justify-center font-bold text-lg shrink-0">
                      {i + 1}
                    </div>
                    <CardTitle className="text-lg font-bold text-[#1B4332]">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">{p.desc}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Goals Section */}
        <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white rounded-2xl p-8 md:p-12 shadow-md">
          <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-6">
            <Milestone className="w-8 h-8 text-[#D4AF37]" />
            <h2 className="text-3xl font-bold">أهداف تيار رؤية عجلون</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {dbGoals.length > 0 ? (
              dbGoals.map((g, i) => (
                <div key={g.id} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg backdrop-blur-xs border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base leading-relaxed opacity-95">{g.contentAr || g.titleAr}</p>
                </div>
              ))
            ) : (
              fallbackGoals.map((g, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg backdrop-blur-xs border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base leading-relaxed opacity-95">{g}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
