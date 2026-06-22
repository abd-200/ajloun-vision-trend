import { useGetInitiative, getGetInitiativeQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Target, ArrowRight } from "lucide-react";

export default function InitiativeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: initiative, isLoading } = useGetInitiative(id, { 
    query: { enabled: !!id, queryKey: getGetInitiativeQueryKey(id) } 
  });

  if (isLoading) {
    return (
      <div className="container py-12 px-4 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="h-[300px] w-full rounded-2xl mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-24 w-full mb-8" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على المبادرة</h2>
        <Button asChild><Link href="/initiatives">العودة للمبادرات</Link></Button>
      </div>
    );
  }

  const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "outline" | "destructive" }> = {
    active: { label: "نشط", variant: "default" },
    completed: { label: "مكتمل", variant: "secondary" },
    planned: { label: "مخطط", variant: "outline" }
  };

  return (
    <div className="container py-12 px-4 max-w-4xl">
      <Link href="/initiatives" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8">
        <ArrowRight className="w-4 h-4 ml-2" /> العودة للقائمة
      </Link>
      
      {initiative.imageUrl && (
        <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img src={initiative.imageUrl} alt={initiative.titleAr} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge variant={statusMap[initiative.status]?.variant as any} className="text-sm px-3 py-1">
          {statusMap[initiative.status]?.label || initiative.status}
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-muted/30">
          {initiative.category}
        </Badge>
        {initiative.isFeatured && (
          <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
            مبادرة بارزة
          </Badge>
        )}
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
        {initiative.titleAr}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Users className="w-6 h-6 text-primary mb-2" />
          <span className="text-2xl font-bold">{initiative.participantsCount}</span>
          <span className="text-xs text-muted-foreground">المشاركين</span>
        </div>
        
        {initiative.targetParticipants && (
          <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <Target className="w-6 h-6 text-primary mb-2" />
            <span className="text-2xl font-bold">{initiative.targetParticipants}</span>
            <span className="text-xs text-muted-foreground">الهدف</span>
          </div>
        )}

        {initiative.location && (
          <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <MapPin className="w-6 h-6 text-primary mb-2" />
            <span className="text-sm font-medium px-2 text-center line-clamp-2">{initiative.location}</span>
            <span className="text-xs text-muted-foreground mt-1">الموقع</span>
          </div>
        )}

        {initiative.startDate && (
          <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <Calendar className="w-6 h-6 text-primary mb-2" />
            <span className="text-sm font-medium">{new Date(initiative.startDate).toLocaleDateString('ar-JO')}</span>
            <span className="text-xs text-muted-foreground mt-1">تاريخ البدء</span>
          </div>
        )}
      </div>

      {initiative.progressPercent !== undefined && initiative.progressPercent !== null && (
        <div className="mb-10 bg-muted/30 p-6 rounded-xl border">
          <div className="flex justify-between items-end mb-2">
            <h3 className="font-bold text-lg">نسبة الإنجاز</h3>
            <span className="text-xl font-bold text-primary">{initiative.progressPercent}%</span>
          </div>
          <Progress value={initiative.progressPercent} className="h-3" />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">تفاصيل المبادرة</h2>
        <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
          {initiative.descriptionAr}
        </div>
      </div>

      <div className="border-t pt-8 text-center">
        <h3 className="text-xl font-bold mb-4">هل ترغب في المساهمة؟</h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          انضم إلى فريق العمل وكن جزءاً من النجاح. كل مساهمة تصنع فارقاً.
        </p>
        <Button size="lg" className="px-12 rounded-full h-14 text-lg">التطوع في هذه المبادرة</Button>
      </div>
    </div>
  );
}
