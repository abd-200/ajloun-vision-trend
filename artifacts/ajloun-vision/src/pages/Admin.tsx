import { useGetPlatformStats, useListInitiatives, useListMembers, useListKnowledge, useCreateInitiative, useDeleteInitiative } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Target, Users, BookOpen, Trash2, Edit, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();
  
  return (
    <div className="container py-10 px-4 max-w-7xl">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">إدارة المنصة، الأعضاء، والمبادرات</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="المبادرات" value={stats?.totalInitiatives} loading={statsLoading} />
        <StatCard title="الأعضاء" value={stats?.totalMembers} loading={statsLoading} />
        <StatCard title="الأثر" value={stats?.totalImpactActions} loading={statsLoading} />
        <StatCard title="المناطق" value={stats?.governoratesCovered} loading={statsLoading} />
      </div>

      <Tabs defaultValue="initiatives" className="w-full">
        <TabsList className="mb-6 h-12">
          <TabsTrigger value="initiatives" className="h-10 px-6"><Target className="w-4 h-4 ml-2" /> المبادرات</TabsTrigger>
          <TabsTrigger value="members" className="h-10 px-6"><Users className="w-4 h-4 ml-2" /> الأعضاء</TabsTrigger>
          <TabsTrigger value="knowledge" className="h-10 px-6"><BookOpen className="w-4 h-4 ml-2" /> المحتوى المعرفي</TabsTrigger>
        </TabsList>
        
        <TabsContent value="initiatives">
          <AdminInitiatives />
        </TabsContent>
        
        <TabsContent value="members">
          <AdminMembers />
        </TabsContent>
        
        <TabsContent value="knowledge">
          <AdminKnowledge />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, loading }: { title: string, value?: number, loading: boolean }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{value || 0}</div>}
      </CardContent>
    </Card>
  );
}

function AdminInitiatives() {
  const { data: initiatives, isLoading } = useListInitiatives();
  const deleteInitiative = useDeleteInitiative();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المبادرة؟")) {
      deleteInitiative.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
          toast({ title: "تم الحذف بنجاح" });
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>إدارة المبادرات</CardTitle>
          <CardDescription>عرض وتعديل مبادرات التيار</CardDescription>
        </div>
        <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> إضافة مبادرة</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">المشاركين</TableHead>
                  <TableHead className="text-right w-[100px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initiatives?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.titleAr}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.participantsCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminMembers() {
  const { data: members, isLoading } = useListMembers();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>إدارة الأعضاء</CardTitle>
          <CardDescription>التحكم في صلاحيات الأعضاء</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">المنطقة</TableHead>
                  <TableHead className="text-right w-[100px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.fullNameAr}</TableCell>
                    <TableCell className="text-left" dir="ltr">{item.email}</TableCell>
                    <TableCell><Badge>{item.role}</Badge></TableCell>
                    <TableCell>{item.location || "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Edit className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminKnowledge() {
  const { data: knowledge, isLoading } = useListKnowledge();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>المحتوى المعرفي</CardTitle>
          <CardDescription>إدارة الرؤية والرسالة والأهداف</CardDescription>
        </div>
        <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> إضافة محتوى</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">الترتيب</TableHead>
                  <TableHead className="text-right w-[100px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {knowledge?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium line-clamp-1 max-w-[200px]">{item.titleAr}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
