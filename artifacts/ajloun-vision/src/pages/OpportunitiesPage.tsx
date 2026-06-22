import { useListOpportunities } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Briefcase, Search, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const TYPE_LABELS: Record<string, string> = {
  volunteering: "تطوع",
  training: "تدريب",
  employment: "توظيف",
  internship: "تدريب ميداني",
  other: "أخرى",
};

const TYPE_COLORS: Record<string, string> = {
  volunteering: "bg-green-100 text-green-800",
  training: "bg-blue-100 text-blue-800",
  employment: "bg-purple-100 text-purple-800",
  internship: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const { data: opportunities, isLoading } = useListOpportunities();

  const filtered = opportunities?.filter(o =>
    (o.titleAr || "").includes(search) ||
    (o.descriptionAr || "").includes(search) ||
    ((o as any).organizationAr || "").includes(search)
  );

  return (
    <div className="container py-10 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">الفرص والتطوع</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          اكتشف فرص التطوع والتدريب والتوظيف المتاحة في محافظة عجلون
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8 relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن فرصة..."
          className="pr-9"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>لا توجد فرص متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map(opp => (
            <Card key={opp.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={`text-xs ${TYPE_COLORS[opp.type] || TYPE_COLORS.other}`}>
                    {TYPE_LABELS[opp.type] || opp.type}
                  </Badge>
                  {(opp as any).isActive === false && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">مغلقة</Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-snug line-clamp-2">{opp.titleAr}</CardTitle>
                {(opp as any).organizationAr && (
                  <CardDescription className="font-medium text-primary">{(opp as any).organizationAr}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{opp.descriptionAr}</p>
                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  {opp.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                  )}
                  {(opp as any).deadline && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>آخر موعد: {new Date((opp as any).deadline).toLocaleDateString("ar-JO")}</span>
                    </div>
                  )}
                  {(opp as any).points && (opp as any).points > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-primary font-bold">★</span>
                      <span>{(opp as any).points} نقطة عند التطوع</span>
                    </div>
                  )}
                </div>
                {(opp as any).applyUrl ? (
                  <Button asChild className="w-full" size="sm">
                    <a href={(opp as any).applyUrl} target="_blank" rel="noopener noreferrer">التقديم الآن</a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link href="/auth">سجل للتقديم</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
