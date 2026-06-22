import { useGetPlatformStats, useListFeaturedInitiatives } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Target, CheckCircle2, TrendingUp, MapPin, ArrowLeft, 
  Flag, MessageSquare, LineChart, Briefcase, Heart, Cpu, 
  Map, Sprout, Award, GraduationCap, TreePine, Building2,
  Compass, Sparkles
} from "lucide-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();
  const { data: featured, isLoading: featuredLoading } = useListFeaturedInitiatives();

  // 8 Mortejazat (Core Pillars)
  const pillars = [
    {
      title: "أولاً: الانتماء الوطني",
      description: "الالتزام بالثوابت الوطنية الأردنية والولاء للقيادة الهاشمية، والإيمان بأن خدمة عجلون جزء من خدمة الأردن وتعزيز مسيرته التنموية.",
      icon: <Flag className="w-6 h-6 text-[#D4AF37]" />,
    },
    {
      title: "ثانياً: الإنسان محور التنمية",
      description: "الاستثمار في الشباب والمرأة والكفاءات الوطنية باعتبارهم الركيزة الأساسية للتقدم والنهوض المجتمعي.",
      icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
    },
    {
      title: "ثالثاً: المشاركة المجتمعية",
      description: "تعزيز مشاركة المواطنين في الحوار وصناعة الرأي العام والمبادرات المجتمعية والشأن العام المحلي.",
      icon: <MessageSquare className="w-6 h-6 text-[#D4AF37]" />,
    },
    {
      title: "رابعاً: التنمية المستدامة",
      description: "تبني رؤى ومبادرات تحقق التوازن بين التنمية الاقتصادية والاجتماعية والبيئية وتحافظ على حقوق الأجيال القادمة.",
      icon: <LineChart className="w-6 h-6 text-[#D4AF37]" />,
    },
    {
      title: "خامساً: الاقتصاد المنتج",
      description: "دعم الاستثمار وريادة الأعمال والمشاريع الإنتاجية وتعزيز البيئة الجاذبة للنمو الاقتصادي وخلق فرص العمل.",
      icon: <Briefcase className="w-6 h-6 text-[#D4AF37]" />,
    },
    {
      title: "سادساً: الهوية والتراث",
      description: "الحفاظ على الإرث التاريخي والثقافي والحضاري والطبيعي لعجلون وتعزيزه باعتباره جزءاً من الهوية الوطنية الأردنية.",
      icon: <Compass className="w-6 h-6 text-[#D4AF37]" />,
    },
    {
      title: "سابعاً: البيئة والاستدامة",
      description: "حماية الغابات والثروات الطبيعية وتعزيز مفهوم التنمية الخضراء والحفاظ على التوازن البيئي.",
      icon: <TreePine className="w-6 h-6 text-[#D4AF37]" />,
    },
    {
      title: "ثامناً: التحديث والابتكار",
      description: "الانفتاح على المعرفة والتكنولوجيا والحلول الحديثة والاستفادة منها في تطوير الخدمات وتحسين الأداء ورفع كفاءة العمل التنموي.",
      icon: <Cpu className="w-6 h-6 text-[#D4AF37]" />,
    },
  ];

  // 8 Areas of Work
  const workAreas = [
    {
      title: "التنمية الاقتصادية والاستثمار",
      description: "دعم بيئة الأعمال والاستثمار والمشاريع الإنتاجية وريادة الأعمال وتعزيز فرص النمو الاقتصادي.",
      icon: <TrendingUp className="w-8 h-8 text-[#2D6A4F]" />,
    },
    {
      title: "السياحة والتراث",
      description: "العمل على إبراز مكانة عجلون السياحية والتاريخية والطبيعية وتطوير المبادرات الداعمة لهذا القطاع الحيوي.",
      icon: <Map className="w-8 h-8 text-[#2D6A4F]" />,
    },
    {
      title: "الزراعة والتنمية الريفية",
      description: "دعم المزارعين والمنتجات المحلية وسلاسل الإنتاج والتسويق والتنمية الريفية المستدامة.",
      icon: <Sprout className="w-8 h-8 text-[#2D6A4F]" />,
    },
    {
      title: "الشباب والتمكين",
      description: "تمكين الشباب وتطوير قدراتهم وتعزيز مشاركتهم في العمل العام وصناعة المبادرات.",
      icon: <Award className="w-8 h-8 text-[#2D6A4F]" />,
    },
    {
      title: "المرأة والمجتمع",
      description: "تعزيز دور المرأة ودعم مشاركتها في مختلف المجالات الاقتصادية والاجتماعية التنموية.",
      icon: <Heart className="w-8 h-8 text-[#2D6A4F]" />,
    },
    {
      title: "التعليم والتدريب والابتكار",
      description: "تشجيع التعليم النوعي والتدريب المهني والتقني وريادة الأعمال والابتكار.",
      icon: <GraduationCap className="w-8 h-8 text-[#2D6A4F]" />,
    },
    {
      title: "البيئة والاستدامة",
      description: "حماية الموارد الطبيعية والغابات وتعزيز الوعي البيئي ومفاهيم التنمية المستدامة.",
      icon: <TreePine className="w-8 h-8 text-[#2D6A4F]" />,
    },
    {
      title: "الخدمات العامة والبنية التحتية",
      description: "المساهمة في طرح الرؤى والمقترحات التي تسهم في تطوير الخدمات وتحسين جودة الحياة للمواطنين.",
      icon: <Building2 className="w-8 h-8 text-[#2D6A4F]" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]" dir="rtl">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-forest text-white py-28 md:py-36">
        {/* Subtle Decorative Gradients */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_30%_30%,_#D4AF37_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_75%,_#ffffff_0%,_transparent_50%)]" />
        
        <div className="container relative z-10 text-center px-4 max-w-5xl">
          <Badge className="mb-6 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1B4332] font-bold text-sm px-4 py-1.5 rounded-full shadow-md animate-pulse">
            <Sparkles className="w-4 h-4 ml-1.5 inline" />
            تيار وطني مجتمعي تنموي
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
            تيار <span className="text-gradient-gold font-black">رؤية عجلون</span> الوطني
          </h1>
          
          <p className="text-lg md:text-2xl max-w-3xl mx-auto opacity-95 mb-12 leading-relaxed font-light">
            في ظل المتغيرات والتحديات التي تواجه المجتمعات، وانطلاقاً من المسؤولية الوطنية والمجتمعية تجاه مستقبل عجلون، جاء تيار رؤية عجلون ليكون مساحة جامعة لأبناء المحافظة ومنصة للعمل المشترك.
          </p>
          
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/join" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg bg-gradient-gold px-8 font-bold text-[#1B4332] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              انضم إلى التيار
            </Link>
            <Link href="/about" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-8 font-bold text-white shadow-sm hover:bg-white/20 transition-all duration-300">
              اعرف المزيد عنا
            </Link>
          </div>

          {/* Core Slogan Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-center gap-6 md:gap-12 text-xs md:text-sm font-semibold text-[#D4AF37]/80">
            <span>رؤية</span>
            <span>•</span>
            <span>تنمية</span>
            <span>•</span>
            <span>تحديث</span>
            <span>•</span>
            <span>مستقبل</span>
          </div>
        </div>
      </section>

      {/* Brief Intro / Quote Section */}
      <section className="py-20 bg-white border-y border-[#C8C8B4]/20 relative">
        <div className="container px-4 max-w-4xl text-center">
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-8" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B4332] mb-6 leading-relaxed">
            "مستقبل عجلون لا يصنعه فرد أو مؤسسة بمفردها، وإنما تصنعه الإرادة الجماعية والشراكة والتعاون."
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            نؤمن في التيار بأن عجلون تمتلك فرصاً هائلة للنمو والتميز، وأن استثمار هذه الفرص يتطلب رؤية واضحة وعملية، تقوم على التخطيط السليم، وتمكين الإنسان، والاستفادة من الموارد المتاحة، مع الحفاظ الكامل على البيئة والهوية الثقافية للمحافظة.
          </p>
        </div>
      </section>

      {/* Stats Section with Glass Cards */}
      <section className="py-16 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EA] relative">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <StatCard 
              icon={<Users className="w-6 h-6 text-[#2D6A4F]" />} 
              title="الأعضاء المشتركين" 
              value={stats?.totalMembers} 
              loading={statsLoading} 
            />
            <StatCard 
              icon={<Target className="w-6 h-6 text-[#2D6A4F]" />} 
              title="المبادرات النشطة" 
              value={stats?.activeInitiatives} 
              loading={statsLoading} 
            />
            <StatCard 
              icon={<CheckCircle2 className="w-6 h-6 text-[#2D6A4F]" />} 
              title="مبادرات مكتملة" 
              value={stats?.completedInitiatives} 
              loading={statsLoading} 
            />
            <StatCard 
              icon={<TrendingUp className="w-6 h-6 text-[#2D6A4F]" />} 
              title="تفاعلات الأثر" 
              value={stats?.totalImpactActions} 
              loading={statsLoading} 
            />
          </div>
        </div>
      </section>

      {/* Core Pillars Section (مرتكزاتنا الأساسية) */}
      <section className="py-24 bg-white relative">
        <div className="container px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 font-bold mb-3">مرتكزاتنا الأساسية</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332] mb-4">الركائز الاستراتيجية التي ننطلق منها</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">المبادئ والثوابت الوطنية والتنموية التي توجه عمل التيار ومبادراته في محافظة عجلون</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <Card key={i} className="glass-card glass-card-hover border-none flex flex-col justify-between overflow-hidden shadow-sm h-full">
                <div>
                  <div className="h-1 bg-gradient-gold w-full mb-6" />
                  <CardHeader className="pt-0">
                    <div className="p-3 bg-[#2D6A4F]/10 w-fit rounded-lg mb-4">
                      {p.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-[#1B4332] line-clamp-1">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">{p.description}</p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of Work Section (محاور عملنا) */}
      <section className="py-24 bg-gradient-to-b from-white to-[#FDFBF7] border-t border-[#C8C8B4]/20">
        <div className="container px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="bg-[#D4AF37]/10 text-[#AA820A] hover:bg-[#D4AF37]/20 font-bold mb-3">محاور عملنا</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332] mb-4">قطاعات التنمية المستدامة</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">المجالات الحيوية التي نستهدفها ببرامجنا ومبادراتنا لخلق تنمية حقيقية ومستدامة</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workAreas.map((w, i) => (
              <div key={i} className="bg-white border border-[#C8C8B4]/25 p-6 rounded-xl shadow-xs hover:shadow-md hover:border-[#D4AF37] transition-all duration-300 group">
                <div className="p-3 bg-[#2D6A4F]/5 rounded-lg w-fit mb-4 group-hover:bg-[#2D6A4F]/10 transition-colors">
                  {w.icon}
                </div>
                <h3 className="font-bold text-lg text-[#1B4332] mb-2 group-hover:text-[#2D6A4F] transition-colors">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Initiatives Section */}
      <section className="py-24 bg-white border-t border-[#C8C8B4]/20">
        <div className="container px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div>
              <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 font-bold mb-3">المبادرات المجتمعية</Badge>
              <h2 className="text-3xl font-bold text-[#1B4332] mb-2">مبادرات بارزة تقود التغيير</h2>
              <p className="text-muted-foreground">أعمال ومشاريع تنموية تفاعلية بأيدي أبناء المحافظة</p>
            </div>
            <Link href="/initiatives" className="inline-flex items-center text-sm font-bold text-[#2D6A4F] hover:text-[#1B4332] transition-colors group">
              عرض جميع المبادرات <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
            ) : Array.isArray(featured) && featured.length > 0 ? (
              featured.slice(0, 3).map((initiative) => (
                <Card key={initiative.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col border border-[#C8C8B4]/20">
                  {initiative.imageUrl ? (
                    <div className="h-48 w-full bg-muted overflow-hidden relative">
                      <img src={initiative.imageUrl} alt={initiative.titleAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">{initiative.category}</Badge>
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-[#2D6A4F]/5 flex items-center justify-center relative">
                      <Target className="w-12 h-12 text-[#2D6A4F]/20" />
                      <Badge className="absolute top-3 right-3 bg-[#2D6A4F]/10 text-primary">{initiative.category}</Badge>
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{initiative.titleAr}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{initiative.descriptionAr}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4 border-[#C8C8B4]/10">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 ml-1.5" />
                        <span>{initiative.participantsCount} مشارك</span>
                      </div>
                      {initiative.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 ml-1.5" />
                          <span>{initiative.location}</span>
                        </div>
                      )}
                    </div>
                    <Button asChild className="w-full mt-5 bg-gradient-forest text-white hover:bg-primary-foreground/90 font-bold" variant="default">
                      <Link href={`/initiatives/${initiative.id}`}>تفاصيل المبادرة</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 text-muted-foreground bg-[#FDFBF7] rounded-xl border border-dashed border-[#C8C8B4]/60 w-full flex flex-col items-center justify-center">
                <Target className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">لا توجد مبادرات معروضة حالياً أو خادم البيانات غير متصل.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Call to Action (CTA) */}
      <section className="py-24 bg-gradient-forest text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_60%)]" />
        <div className="container relative z-10 px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">رؤية .. تنمية .. تحديث .. مستقبل</h2>
          <p className="text-lg opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto">
            تيار رؤية عجلون هو مسؤولية مشتركة يحملها جميع أبناء المحافظة، ومستقبل نصنعه معاً للأجيال القادمة. انضم إلينا الآن وساهم بوعيك وجهدك وطاقتك.
          </p>
          <Link href="/join" className="inline-flex h-14 items-center justify-center rounded-lg bg-gradient-gold px-12 font-bold text-[#1B4332] shadow-xl transition-all duration-300 transform hover:scale-105">
            سجل الآن كعضو بالتيار
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, title, value, loading }: { icon: React.ReactNode, title: string, value?: number, loading: boolean }) {
  return (
    <Card className="border border-[#C8C8B4]/20 shadow-xs bg-white text-card-foreground hover:shadow-md transition-shadow">
      <CardContent className="p-6 text-center flex flex-col items-center justify-center">
        <div className="p-3 bg-[#2D6A4F]/10 rounded-full mb-4">
          {icon}
        </div>
        {loading ? (
          <Skeleton className="h-8 w-16 mb-2" />
        ) : (
          <div className="text-3xl font-bold mb-1 text-[#1B4332]">{value || 0}</div>
        )}
        <div className="text-xs font-semibold text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );
}
