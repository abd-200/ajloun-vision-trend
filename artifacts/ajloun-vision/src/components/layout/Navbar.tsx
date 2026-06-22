import { Link, useLocation } from "wouter";
import { Menu, X, Bell, User, LogOut, Settings, Trophy, Gift, Briefcase, LayoutDashboard, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useLogout, useListNotifications } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logout = useLogout();
  const { data: notifications } = useListNotifications({ query: { enabled: isLoggedIn } });
  const unreadCount = (notifications as any[])?.filter((n: any) => !n.isRead).length || 0;

  const mainLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/feed", label: "المنشورات", icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/initiatives", label: "المبادرات" },
    { href: "/opportunities", label: "الفرص", icon: <Briefcase className="w-4 h-4" /> },
    { href: "/members", label: "الأعضاء" },
    { href: "/about", label: "عن التيار" },
  ];

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries();
        queryClient.clear();
        toast({ title: "تم تسجيل الخروج" });
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.jpg" alt="شعار التيار" className="h-8 w-8 rounded-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="text-sm sm:text-lg font-bold text-primary tracking-tight">تيار رؤية عجلون الوطني</span>
        </Link>

        <nav className="hidden lg:flex gap-5 items-center flex-1 justify-center">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 h-9 px-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user?.fullNameAr?.charAt(0) || "م"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.fullNameAr}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs font-medium text-primary">⭐ {user?.totalPoints || 0} نقطة</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href={`/members/${user?.id}`} className="cursor-pointer flex items-center gap-2"><User className="w-4 h-4" />الملف الشخصي</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/points" className="cursor-pointer flex items-center gap-2"><Trophy className="w-4 h-4" />نقاطي</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/rewards" className="cursor-pointer flex items-center gap-2"><Gift className="w-4 h-4" />متجر المكافآت</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/accessibility" className="cursor-pointer flex items-center gap-2"><Settings className="w-4 h-4" />إمكانية الوصول</Link></DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/admin" className="cursor-pointer flex items-center gap-2 text-primary"><LayoutDashboard className="w-4 h-4" />لوحة الإدارة</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer flex items-center gap-2">
                    <LogOut className="w-4 h-4" />تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth">دخول</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth">انضم إلينا</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t p-4 bg-background">
          <nav className="flex flex-col gap-3">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary py-1"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-3 mt-1 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link href={`/members/${user?.id}`} onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <User className="w-4 h-4" />الملف الشخصي
                  </Link>
                  <Link href="/points" onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <Trophy className="w-4 h-4" />نقاطي ({user?.totalPoints || 0})
                  </Link>
                  <Link href="/rewards" onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <Gift className="w-4 h-4" />متجر المكافآت
                  </Link>
                  <Link href="/notifications" onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <Bell className="w-4 h-4" />الإشعارات {unreadCount > 0 && `(${unreadCount})`}
                  </Link>
                  <Link href="/accessibility" onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <Settings className="w-4 h-4" />إمكانية الوصول
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsOpen(false)} className="text-sm font-medium text-primary flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />لوحة الإدارة
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-destructive border-destructive/30 mt-1">
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth" onClick={() => setIsOpen(false)} className="inline-flex h-9 w-full items-center justify-center rounded-md border border-primary px-4 text-sm font-medium text-primary">
                    تسجيل الدخول
                  </Link>
                  <Link href="/auth" onClick={() => setIsOpen(false)} className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
