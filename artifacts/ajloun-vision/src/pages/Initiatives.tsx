import { useListInitiatives, useGetInitiativesByCategory } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, Target } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Initiatives() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: initiatives, isLoading } = useListInitiatives();
  
  const filteredInitiatives = initiatives?.filter(init => {
    const matchesSearch = init.titleAr.includes(search) || init.descriptionAr.includes(search);
    const matchesStatus = statusFilter === "all" || init.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "outline" | "destructive" }> = {
    active: { label: "نشط", variant: "default" },
    completed: { label: "مكتمل", variant: "secondary" },
    planned: { label: "مخطط", variant: "outline" }
  };

  return (
    <div className="container py-12 px-4 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">المبادرات المجتمعية</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          استكشف المبادرات التي تقودها مجتمعاتنا المحلية. معاً، نصنع أثراً مستداماً في عجلون.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن مبادرة..." 
            className="pl-4 pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="حالة المبادرة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="planned">مخطط</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-[400px] rounded-xl" />)
        ) : filteredInitiatives?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground border rounded-xl bg-muted/20">
            لا توجد مبادرات تطابق بحثك.
          </div>
        ) : (
          filteredInitiatives?.map(initiative => (
            <Card key={initiative.id} className="flex flex-col overflow-hidden hover:shadow-md transition-all duration-300">
              {initiative.imageUrl ? (
                <div className="h-48 w-full overflow-hidden bg-muted">
                  <img src={initiative.imageUrl} alt={initiative.titleAr} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 w-full bg-primary/5 flex items-center justify-center">
                  <Target className="w-12 h-12 text-primary/20" />
                </div>
              )}
              <CardHeader className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-background text-xs">{initiative.category}</Badge>
                  <Badge variant={statusMap[initiative.status]?.variant as any}>
                    {statusMap[initiative.status]?.label || initiative.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  <Link href={`/initiatives/${initiative.id}`} className="hover:text-primary transition-colors">
                    {initiative.titleAr}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {initiative.descriptionAr}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{initiative.participantsCount} مشارك</span>
                  </div>
                  {initiative.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{initiative.location}</span>
                    </div>
                  )}
                </div>
                {initiative.progressPercent !== undefined && initiative.progressPercent !== null && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>التقدم</span>
                      <span>{initiative.progressPercent}%</span>
                    </div>
                    <Progress value={initiative.progressPercent} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
