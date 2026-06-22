import { useListRewards, useClaimReward, useListClaims } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { getListClaimsQueryKey } from "@workspace/api-client-react";

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "قيد المراجعة", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "مقبول", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "bg-green-100 text-green-800" },
  rejected: { label: "مرفوض", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-red-100 text-red-800" },
};

export default function RewardsPage() {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const claimReward = useClaimReward();

  const { data: rewards, isLoading: rLoading } = useListRewards();
  const { data: claims, isLoading: cLoading } = useListClaims({ query: { enabled: isLoggedIn } });

  const handleClaim = (rewardId: number) => {
    claimReward.mutate({ id: rewardId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListClaimsQueryKey() });
        toast({ title: "تم تقديم طلب الاستبدال!", description: "سيراجع المسؤول طلبك قريباً" });
      },
      onError: () => toast({ variant: "destructive", title: "خطأ", description: "نقاطك غير كافية أو الجائزة غير متاحة" }),
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto px-4">
        <Gift className="w-16 h-16 text-primary/30 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">متجر المكافآت</h1>
        <p className="text-muted-foreground mb-6">سجّل الدخول لاستعراض المكافآت واستبدال نقاطك</p>
        <Button asChild><Link href="/auth">تسجيل الدخول</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Gift className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">متجر المكافآت</h1>
        <p className="text-muted-foreground mb-2">استبدل نقاطك بجوائز ومكافآت حقيقية</p>
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-primary">{user?.totalPoints || 0}</span>
          <span className="text-sm text-muted-foreground">نقطة متاحة</span>
        </div>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="mb-6">
          <TabsTrigger value="store" className="gap-2"><Gift className="w-4 h-4" />المتجر</TabsTrigger>
          <TabsTrigger value="claims" className="gap-2"><Clock className="w-4 h-4" />طلباتي</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          {rLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
            </div>
          ) : rewards?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Gift className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>لا توجد مكافآت متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(rewards as any[])?.map((r: any) => (
                <Card key={r.id} className={`hover:shadow-md transition-shadow flex flex-col ${!r.isActive ? "opacity-60" : ""}`}>
                  {r.imageUrl && (
                    <img src={r.imageUrl} alt={r.nameAr} className="h-40 w-full object-cover rounded-t-xl" />
                  )}
                  <CardHeader className={r.imageUrl ? "pt-4 pb-2" : "pb-2"}>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{r.nameAr || r.name}</CardTitle>
                      <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm shrink-0">
                        <Star className="w-4 h-4" />
                        {r.pointsCost}
                      </div>
                    </div>
                    {r.stock !== undefined && r.stock !== null && (
                      <CardDescription>{r.stock} متبقٍ</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {r.descriptionAr && (
                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{r.descriptionAr}</p>
                    )}
                    <Button
                      onClick={() => handleClaim(r.id)}
                      disabled={!r.isActive || claimReward.isPending || (user?.totalPoints || 0) < r.pointsCost}
                      className="w-full"
                      size="sm"
                      variant={(user?.totalPoints || 0) < r.pointsCost ? "outline" : "default"}
                    >
                      {(user?.totalPoints || 0) < r.pointsCost ? "نقاطك غير كافية" : "استبدال بـ " + r.pointsCost + " نقطة"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="claims">
          {cLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl mb-3" />)
          ) : (claims as any[])?.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">لم تُقدّم أي طلب استبدال بعد</p>
          ) : (
            <div className="space-y-3">
              {(claims as any[])?.map((c: any) => {
                const s = STATUS_MAP[c.status] || STATUS_MAP.pending;
                return (
                  <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                    <Gift className="w-8 h-8 text-primary/50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{c.rewardNameAr || "مكافأة"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("ar-JO")}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>
                      {s.icon}
                      <span>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
