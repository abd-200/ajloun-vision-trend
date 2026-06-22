import { useGetMyPoints, useGetLeaderboard, useListTransactions, useGetUserBadges } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Star, Award, TrendingUp, Zap, BookOpen, Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PointsPage() {
  const { user, isLoggedIn } = useAuth();
  const { data: myPoints, isLoading: ptLoading } = useGetMyPoints({ query: { enabled: isLoggedIn } });
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard();
  const { data: transactions, isLoading: txLoading } = useListTransactions({ query: { enabled: isLoggedIn } });
  const { data: badges } = useGetUserBadges(user?.id || 0, { query: { enabled: !!user } });

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto px-4">
        <Trophy className="w-16 h-16 text-primary/30 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">نظام النقاط والمكافآت</h1>
        <p className="text-muted-foreground mb-6">سجّل الدخول لعرض نقاطك وترتيبك في لوحة المتصدرين</p>
        <Button asChild><Link href="/auth">تسجيل الدخول</Link></Button>
      </div>
    );
  }

  const pts = myPoints as any;

  return (
    <div className="container py-10 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">نقاطي ومكافآتي</h1>
        <p className="text-muted-foreground">تتبّع رصيدك وترتيبك وشاراتك</p>
      </div>

      {ptLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <PointCard icon={<Star className="w-5 h-5 text-yellow-500" />} label="إجمالي النقاط" value={pts?.totalPoints || user?.totalPoints || 0} color="yellow" />
          <PointCard icon={<Zap className="w-5 h-5 text-green-600" />} label="نقاط التطوع" value={pts?.volunteerPoints || user?.volunteerPoints || 0} color="green" />
          <PointCard icon={<BookOpen className="w-5 h-5 text-blue-600" />} label="نقاط التدريب" value={pts?.trainingPoints || user?.trainingPoints || 0} color="blue" />
          <PointCard icon={<Activity className="w-5 h-5 text-purple-600" />} label="نقاط الأنشطة" value={pts?.activityPoints || user?.activityPoints || 0} color="purple" />
        </div>
      )}

      {badges && badges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> شاراتي
          </h2>
          <div className="flex flex-wrap gap-3">
            {(badges as any[]).map((b: any) => (
              <div key={b.id} className="flex flex-col items-center gap-1 p-3 bg-card rounded-xl border shadow-sm min-w-[80px]">
                <span className="text-3xl">{b.icon || "🏅"}</span>
                <span className="text-xs font-medium text-center leading-tight">{b.nameAr || b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="leaderboard">
        <TabsList className="mb-6">
          <TabsTrigger value="leaderboard" className="gap-2"><TrendingUp className="w-4 h-4" />المتصدرون</TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><Activity className="w-4 h-4" />سجل النقاط</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          {lbLoading ? (
            Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg mb-2" />)
          ) : (
            <div className="space-y-2">
              {(leaderboard as any[])?.map((u: any, idx: number) => (
                <div key={u.id} className={`flex items-center gap-4 p-3 rounded-xl border ${idx === 0 ? "bg-yellow-50 border-yellow-200" : idx === 1 ? "bg-gray-50 border-gray-200" : idx === 2 ? "bg-orange-50 border-orange-200" : "bg-card"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? "bg-yellow-400 text-white" : idx === 1 ? "bg-gray-400 text-white" : idx === 2 ? "bg-orange-400 text-white" : "bg-muted text-muted-foreground"}`}>
                    {idx + 1}
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">{u.fullNameAr?.charAt(0) || "م"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{u.fullNameAr}</p>
                    <p className="text-xs text-muted-foreground">{u.totalPoints} نقطة</p>
                  </div>
                  {idx < 3 && <Trophy className={`w-5 h-5 ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : "text-orange-500"}`} />}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {txLoading ? (
            Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg mb-2" />)
          ) : (transactions as any[])?.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">لا يوجد سجل نقاط بعد</p>
          ) : (
            <div className="space-y-2">
              {(transactions as any[])?.map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl border bg-card">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${tx.points > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {tx.points > 0 ? "+" : ""}{tx.points}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tx.descriptionAr || tx.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("ar-JO")}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{tx.category}</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PointCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
  };
  return (
    <Card className={`border ${colorMap[color] || ""}`}>
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-2xl font-bold text-foreground mb-1">{value.toLocaleString("ar")}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
