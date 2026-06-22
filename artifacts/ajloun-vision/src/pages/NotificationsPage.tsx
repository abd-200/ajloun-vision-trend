import { useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, BellOff, Check, CheckCheck, Info, Gift, Trophy, Megaphone } from "lucide-react";
import { Link } from "wouter";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  reward: <Gift className="w-4 h-4 text-yellow-500" />,
  badge: <Trophy className="w-4 h-4 text-purple-500" />,
  points: <Trophy className="w-4 h-4 text-green-500" />,
  announcement: <Megaphone className="w-4 h-4 text-blue-500" />,
  general: <Info className="w-4 h-4 text-muted-foreground" />,
};

export default function NotificationsPage() {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const { data: notifications, isLoading } = useListNotifications({ query: { enabled: isLoggedIn } });

  const unreadCount = (notifications as any[])?.filter((n: any) => !n.isRead).length || 0;

  const handleMarkAll = () => {
    markAll.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
        toast({ title: "تم تحديد الكل كمقروء" });
      },
    });
  };

  const handleMark = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto px-4">
        <Bell className="w-16 h-16 text-primary/30 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">الإشعارات</h1>
        <p className="text-muted-foreground mb-6">سجّل الدخول لعرض إشعاراتك</p>
        <Button asChild><Link href="/auth">تسجيل الدخول</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">الإشعارات</h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">{unreadCount} جديد</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAll} className="gap-2 text-muted-foreground hover:text-foreground">
            <CheckCheck className="w-4 h-4" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {isLoading ? (
        Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl mb-3" />)
      ) : (notifications as any[])?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BellOff className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>لا توجد إشعارات بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(notifications as any[])?.map((n: any) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMark(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${!n.isRead ? "bg-primary/5 border-primary/20 hover:bg-primary/10" : "bg-card border-border hover:bg-muted/30"}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${!n.isRead ? "bg-primary/10" : "bg-muted"}`}>
                {TYPE_ICONS[n.type] || TYPE_ICONS.general}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium mb-0.5 ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                  {n.titleAr || n.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.bodyAr || n.body}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {new Date(n.createdAt).toLocaleDateString("ar-JO", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              {!n.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
