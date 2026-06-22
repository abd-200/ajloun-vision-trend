import { useAdminListUsers, useAdminUpdateUser, useAdminDeleteUser, useListReportedPosts, useGetPlatformStats, useSendNotification, useAwardPoints, useListClaims, useUpdateClaimStatus, useListRewards, useCreateReward } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Flag, Bell, Star, Shield, Gift, BarChart3, Trash2, CheckCircle, XCircle, Settings } from "lucide-react";
import { useState } from "react";
import { getAdminListUsersQueryKey, getListReportedPostsQueryKey, getListClaimsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user, isAdmin, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useGetPlatformStats();
  const { data: users, isLoading: usersLoading } = useAdminListUsers({ query: { enabled: isAdmin } });
  const { data: reported, isLoading: reportedLoading } = useListReportedPosts({ query: { enabled: isAdmin } });
  const { data: claims } = useListClaims({ query: { enabled: isAdmin } });

  const updateUser = useAdminUpdateUser();
  const deleteUser = useAdminDeleteUser();
  const sendNotif = useSendNotification();
  const awardPoints = useAwardPoints();
  const updateClaim = useUpdateClaimStatus();
  const createReward = useCreateReward();

  const [notifForm, setNotifForm] = useState({ titleAr: "", bodyAr: "", sendToAll: true });
  const [awardForm, setAwardForm] = useState({ userId: "", points: "", category: "activity", descriptionAr: "" });
  const [rewardForm, setRewardForm] = useState({ nameAr: "", descriptionAr: "", pointsCost: "", stock: "" });
  const [userSearch, setUserSearch] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center">
        <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">غير مصرح</h2>
        <p className="text-muted-foreground mb-4">يرجى تسجيل الدخول أولاً</p>
        <Button asChild><Link href="/auth">تسجيل الدخول</Link></Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-20 text-center">
        <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">غير مصرح</h2>
        <p className="text-muted-foreground">هذه الصفحة للمسؤولين فقط</p>
      </div>
    );
  }

  const filteredUsers = (users as any[])?.filter((u: any) =>
    u.fullNameAr?.includes(userSearch) || u.email?.includes(userSearch)
  );

  const handleSendNotif = () => {
    sendNotif.mutate({ data: { titleAr: notifForm.titleAr, bodyAr: notifForm.bodyAr, sendToAll: true, type: "announcement" } }, {
      onSuccess: () => { setNotifForm({ titleAr: "", bodyAr: "", sendToAll: true }); toast({ title: "تم إرسال الإشعار" }); },
      onError: () => toast({ variant: "destructive", title: "فشل الإرسال" }),
    });
  };

  const handleAwardPoints = () => {
    awardPoints.mutate({ data: { userId: Number(awardForm.userId), points: Number(awardForm.points), category: awardForm.category as any, descriptionAr: awardForm.descriptionAr } }, {
      onSuccess: () => { setAwardForm({ userId: "", points: "", category: "activity", descriptionAr: "" }); toast({ title: "تم منح النقاط" }); },
      onError: () => toast({ variant: "destructive", title: "فشل منح النقاط" }),
    });
  };

  const handleClaimStatus = (id: number, status: "approved" | "rejected") => {
    updateClaim.mutate({ id, data: { status } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListClaimsQueryKey() }); toast({ title: status === "approved" ? "تم قبول الطلب" : "تم رفض الطلب" }); },
    });
  };

  const handleCreateReward = () => {
    createReward.mutate({ data: { nameAr: rewardForm.nameAr, descriptionAr: rewardForm.descriptionAr, pointsCost: Number(rewardForm.pointsCost), stock: Number(rewardForm.stock) || undefined, isActive: true } }, {
      onSuccess: () => { setRewardForm({ nameAr: "", descriptionAr: "", pointsCost: "", stock: "" }); toast({ title: "تم إنشاء المكافأة" }); },
      onError: () => toast({ variant: "destructive", title: "فشل إنشاء المكافأة" }),
    });
  };

  const pendingClaims = (claims as any[])?.filter((c: any) => c.status === "pending") || [];

  return (
    <div className="container py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة الإدارة</h1>
          <p className="text-sm text-muted-foreground">مرحباً {user?.fullNameAr}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="الأعضاء" value={(stats as any)?.totalMembers || 0} />
        <StatCard icon={<Flag className="w-5 h-5 text-red-500" />} label="منشورات مُبلَّغ عنها" value={(reported as any[])?.length || 0} alert />
        <StatCard icon={<Gift className="w-5 h-5 text-yellow-500" />} label="طلبات استبدال معلقة" value={pendingClaims.length} alert={pendingClaims.length > 0} />
        <StatCard icon={<Star className="w-5 h-5 text-green-600" />} label="إجمالي النقاط الممنوحة" value={(stats as any)?.totalImpactActions || 0} />
      </div>

      <Tabs defaultValue="users">
        <TabsList className="flex-wrap gap-1 h-auto mb-6">
          <TabsTrigger value="users" className="gap-1.5"><Users className="w-3.5 h-3.5" />الأعضاء</TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5">
            <Flag className="w-3.5 h-3.5" />
            البلاغات
            {(reported as any[])?.length > 0 && <Badge className="h-4 text-xs bg-red-500 text-white px-1.5">{(reported as any[])?.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="claims" className="gap-1.5">
            <Gift className="w-3.5 h-3.5" />
            طلبات الاستبدال
            {pendingClaims.length > 0 && <Badge className="h-4 text-xs bg-yellow-500 text-white px-1.5">{pendingClaims.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="w-3.5 h-3.5" />إشعارات</TabsTrigger>
          <TabsTrigger value="points" className="gap-1.5"><Star className="w-3.5 h-3.5" />منح نقاط</TabsTrigger>
          <TabsTrigger value="rewards" className="gap-1.5"><Gift className="w-3.5 h-3.5" />إنشاء مكافأة</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="mb-4">
            <Input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="بحث عن عضو..." className="max-w-sm" />
          </div>
          {usersLoading ? (
            Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl mb-2" />)
          ) : (
            <div className="space-y-2">
              {filteredUsers?.map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">{u.fullNameAr?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{u.fullNameAr}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {u.role === "admin" ? "مسؤول" : "عضو"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{u.totalPoints} ن</span>
                    {u.id !== user?.id && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>تأكيد الحذف</DialogTitle></DialogHeader>
                          <p className="text-sm text-muted-foreground">هل أنت متأكد من حذف عضو <strong>{u.fullNameAr}</strong>؟</p>
                          <Button variant="destructive" onClick={() => deleteUser.mutate({ id: u.id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() }); toast({ title: "تم الحذف" }); } })}>
                            حذف نهائي
                          </Button>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {reportedLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl mb-2" />)
          ) : (reported as any[])?.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا توجد منشورات مُبلَّغ عنها</p>
          ) : (
            <div className="space-y-3">
              {(reported as any[])?.map((p: any) => (
                <Card key={p.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1 text-red-600 flex items-center gap-1.5">
                          <Flag className="w-3.5 h-3.5" /> {p.reportCount} بلاغ
                        </p>
                        <p className="text-sm text-foreground line-clamp-2">{p.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(p.createdAt).toLocaleDateString("ar-JO")}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => toast({ title: "تم الإخفاء (قريباً)" })}>
                          <CheckCircle className="w-3.5 h-3.5" />إخفاء
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="claims">
          {pendingClaims.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا توجد طلبات معلقة</p>
          ) : (
            <div className="space-y-3">
              {pendingClaims.map((c: any) => (
                <Card key={c.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Gift className="w-8 h-8 text-yellow-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{c.rewardNameAr || "مكافأة"}</p>
                      <p className="text-xs text-muted-foreground">الطالب: {c.userNameAr || c.userId} • {new Date(c.createdAt).toLocaleDateString("ar-JO")}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" className="h-8 text-xs gap-1 bg-green-600 hover:bg-green-700" onClick={() => handleClaimStatus(c.id, "approved")}>
                        <CheckCircle className="w-3.5 h-3.5" /> قبول
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 text-xs gap-1" onClick={() => handleClaimStatus(c.id, "rejected")}>
                        <XCircle className="w-3.5 h-3.5" /> رفض
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" />إرسال إشعار للجميع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان الإشعار</Label>
                <Input value={notifForm.titleAr} onChange={e => setNotifForm(f => ({ ...f, titleAr: e.target.value }))} placeholder="مثال: إعلان مهم من تيار رؤية عجلون" />
              </div>
              <div className="space-y-2">
                <Label>نص الإشعار</Label>
                <Textarea value={notifForm.bodyAr} onChange={e => setNotifForm(f => ({ ...f, bodyAr: e.target.value }))} placeholder="نص الرسالة..." rows={4} />
              </div>
              <Button onClick={handleSendNotif} disabled={!notifForm.titleAr || !notifForm.bodyAr || sendNotif.isPending} className="w-full gap-2">
                <Bell className="w-4 h-4" />
                {sendNotif.isPending ? "جاري الإرسال..." : "إرسال للجميع"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />منح نقاط لعضو</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>معرّف العضو (ID)</Label>
                <Input type="number" value={awardForm.userId} onChange={e => setAwardForm(f => ({ ...f, userId: e.target.value }))} placeholder="مثال: 2" />
              </div>
              <div className="space-y-2">
                <Label>عدد النقاط</Label>
                <Input type="number" value={awardForm.points} onChange={e => setAwardForm(f => ({ ...f, points: e.target.value }))} placeholder="50" />
              </div>
              <div className="space-y-2">
                <Label>فئة النقاط</Label>
                <Select value={awardForm.category} onValueChange={v => setAwardForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">تطوع</SelectItem>
                    <SelectItem value="training">تدريب</SelectItem>
                    <SelectItem value="activity">نشاط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>السبب (عربي)</Label>
                <Input value={awardForm.descriptionAr} onChange={e => setAwardForm(f => ({ ...f, descriptionAr: e.target.value }))} placeholder="مثال: مشاركة في حملة تشجير" />
              </div>
              <Button onClick={handleAwardPoints} disabled={!awardForm.userId || !awardForm.points || awardPoints.isPending} className="w-full">
                {awardPoints.isPending ? "جاري المنح..." : "منح النقاط"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Gift className="w-5 h-5" />إنشاء مكافأة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المكافأة (عربي)</Label>
                <Input value={rewardForm.nameAr} onChange={e => setRewardForm(f => ({ ...f, nameAr: e.target.value }))} placeholder="مثال: شهادة تقدير" />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={rewardForm.descriptionAr} onChange={e => setRewardForm(f => ({ ...f, descriptionAr: e.target.value }))} placeholder="وصف المكافأة..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>تكلفة النقاط</Label>
                  <Input type="number" value={rewardForm.pointsCost} onChange={e => setRewardForm(f => ({ ...f, pointsCost: e.target.value }))} placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label>الكمية المتاحة</Label>
                  <Input type="number" value={rewardForm.stock} onChange={e => setRewardForm(f => ({ ...f, stock: e.target.value }))} placeholder="10" />
                </div>
              </div>
              <Button onClick={handleCreateReward} disabled={!rewardForm.nameAr || !rewardForm.pointsCost || createReward.isPending} className="w-full">
                {createReward.isPending ? "جاري الإنشاء..." : "إنشاء المكافأة"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value, alert }: { icon: React.ReactNode; label: string; value: number; alert?: boolean }) {
  return (
    <Card className={alert && value > 0 ? "border-red-200 bg-red-50" : ""}>
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
