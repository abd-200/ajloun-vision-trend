import { useGetPlatformStats, useListFeaturedInitiatives, useGetRecentActivity } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Target, CheckCircle2, TrendingUp, Calendar, MapPin, ArrowLeft } from "lucide-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();
  const { data: featured, isLoading: featuredLoading } = useListFeaturedInitiatives();
  const { data: recent, isLoading: recentLoading } = useGetRecentActivity();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-24 md:py-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            تيار رؤية عجلون
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-10 leading-relaxed">
            محرك التنمية في محافظة عجلون. نربط الطاقات، ندعم المبادرات، ونصنع أثراً حقيقياً في مجتمعنا من خلال العمل الجماعي.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join" className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90">
              انضم إلى التيار
            </Link>
            <Link href="/initiatives" className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/20 bg-transparent px-8 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-foreground/10">
              استكشف المبادرات
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard 
              icon={<Users className="w-6 h-6 text-primary" />} 
              title="الأعضاء" 
              value={stats?.totalMembers} 
              loading={statsLoading} 
            />
            <StatCard 
              icon={<Target className="w-6 h-6 text-primary" />} 
              title="المبادرات النشطة" 
              value={stats?.activeInitiatives} 
              loading={statsLoading} 
            />
            <StatCard 
              icon={<CheckCircle2 className="w-6 h-6 text-primary" />} 
              title="مبادرات مكتملة" 
              value={stats?.completedInitiatives} 
              loading={statsLoading} 
            />
            <StatCard 
              icon={<TrendingUp className="w-6 h-6 text-primary" />} 
              title="تفاعلات الأثر" 
              value={stats?.totalImpactActions} 
              loading={statsLoading} 
            />
          </div>
        </div>
      </section>

      {/* Featured Initiatives */}
      <section className="py-20">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">مبادرات بارزة</h2>
              <p className="text-muted-foreground">أعمال مجتمعية تصنع فارقاً في عجلون</p>
            </div>
            <Link href="/initiatives" className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline">
              عرض الكل <ArrowLeft className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
            ) : Array.isArray(featured) && featured.length > 0 ? (
              featured.slice(0, 3).map((initiative) => (
                <Card key={initiative.id} className="overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  {initiative.imageUrl ? (
                    <div className="h-48 w-full bg-muted overflow-hidden relative">
                      <img src={initiative.imageUrl} alt={initiative.titleAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">{initiative.category}</Badge>
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-primary/10 flex items-center justify-center relative">
                      <Target className="w-12 h-12 text-primary/30" />
                      <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">{initiative.category}</Badge>
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{initiative.titleAr}</CardTitle>
                    <CardDescription className="line-clamp-2">{initiative.descriptionAr}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 ml-1" />
                        <span>{initiative.participantsCount} مشارك</span>
                      </div>
                      {initiative.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 ml-1" />
                          <span>{initiative.location}</span>
                        </div>
                      )}
                    </div>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link href={`/initiatives/${initiative.id}`}>تفاصيل المبادرة</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed w-full">
                <Target className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm">لا توجد مبادرات معروضة حالياً أو خادم البيانات غير متصل.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Join CTA */}
      <section className="py-24 bg-accent text-accent-foreground text-center">
        <div className="container px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">كن جزءاً من التغيير</h2>
          <p className="text-lg opacity-90 mb-8">
            صوتك مهم وعملك يصنع أثراً. انضم إلى تيار رؤية عجلون اليوم وساهم في بناء مستقبل محافظتنا.
          </p>
          <Link href="/join" className="inline-flex h-14 items-center justify-center rounded-md bg-white px-10 font-bold text-accent shadow-lg transition-transform hover:scale-105">
            سجل الآن كعضو
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, title, value, loading }: { icon: React.ReactNode, title: string, value?: number, loading: boolean }) {
  return (
    <Card className="border-none shadow-sm bg-card text-card-foreground">
      <CardContent className="p-6 text-center flex flex-col items-center justify-center">
        <div className="p-3 bg-primary/10 rounded-full mb-4">
          {icon}
        </div>
        {loading ? (
          <Skeleton className="h-8 w-16 mb-2" />
        ) : (
          <div className="text-3xl font-bold mb-1">{value || 0}</div>
        )}
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );
}
