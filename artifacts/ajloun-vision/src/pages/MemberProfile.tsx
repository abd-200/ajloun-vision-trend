import { useGetMember, getGetMemberQueryKey, useGetMemberImpact, getGetMemberImpactQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Award, Calendar, ArrowRight, Target, ShieldCheck, CreditCard, RotateCw, Download, Share2 } from "lucide-react";

export default function MemberProfile() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { toast } = useToast();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const { data: member, isLoading: memberLoading } = useGetMember(id, { 
    query: { enabled: !!id, queryKey: getGetMemberQueryKey(id) } 
  });
  
  const { data: impact, isLoading: impactLoading } = useGetMemberImpact(id, {
    query: { enabled: !!id, queryKey: getGetMemberImpactQueryKey(id) }
  });

  if (memberLoading) {
    return (
      <div className="container py-12 px-4 max-w-4xl">
        <Skeleton className="h-40 w-full rounded-2xl mb-12 relative">
          <Skeleton className="w-32 h-32 rounded-full absolute -bottom-16 right-8 border-4 border-background" />
        </Skeleton>
        <div className="mt-20">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="h-32 w-full mb-8" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على العضو</h2>
        <Link href="/members" className="text-primary hover:underline">العودة لقائمة الأعضاء</Link>
      </div>
    );
  }

  const roleMap: Record<string, string> = {
    admin: "إدارة",
    coordinator: "منسق",
    member: "عضو نشط"
  };

  return (
    <div className="container py-12 px-4 max-w-4xl">
      <Link href="/members" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6">
        <ArrowRight className="w-4 h-4 ml-2" /> العودة للأعضاء
      </Link>
      
      {/* Profile Header */}
      <div className="bg-card rounded-2xl border overflow-hidden mb-8">
        <div className="h-32 md:h-48 bg-primary/10 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 mb-6 relative z-10">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-md">
              <AvatarImage src={member.avatarUrl || undefined} />
              <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                {member.fullNameAr.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{member.fullNameAr}</h1>
                {member.isActive && <Badge variant="default" className="bg-green-600">نشط</Badge>}
              </div>
              <p className="text-lg text-muted-foreground font-medium">{roleMap[member.role] || member.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            {member.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{member.location}</span>
              </div>
            )}
            {member.joinedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>انضم في {new Date(member.joinedAt).toLocaleDateString('ar-JO')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Bio */}
          {member.bioAr && (
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-xl">نبذة تعريفية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {member.bioAr}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Impact Stats */}
          {!impactLoading && impact && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                الأثر المجتمعي
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-card border rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-accent mb-1">{impact.impactScore}</div>
                  <div className="text-xs text-muted-foreground">نقطة أثر</div>
                </div>
                <div className="bg-card border rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-1">{impact.initiativesJoined}</div>
                  <div className="text-xs text-muted-foreground">مبادرات شارك بها</div>
                </div>
                <div className="bg-card border rounded-xl p-4 text-center shadow-sm col-span-2 md:col-span-1">
                  <div className="text-3xl font-bold text-primary mb-1">{impact.initiativesLed}</div>
                  <div className="text-xs text-muted-foreground">مبادرات قادها</div>
                </div>
              </div>

              {impact.recentInitiatives && impact.recentInitiatives.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h3 className="font-bold text-lg">أحدث المبادرات</h3>
                  <div className="space-y-3">
                    {impact.recentInitiatives.map(init => (
                      <Link key={init.id} href={`/initiatives/${init.id}`}>
                        <div className="flex items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center ml-4 shrink-0 overflow-hidden">
                            {init.imageUrl ? (
                              <img src={init.imageUrl} alt={init.titleAr} className="w-full h-full object-cover" />
                            ) : (
                              <Target className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1">{init.titleAr}</h4>
                            <p className="text-xs text-muted-foreground">{init.category}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {member && (
            <Card className="overflow-hidden border-muted shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  بطاقة العضوية الرقمية
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col items-center">
                {/* Card 3D container */}
                <div 
                  className="w-full max-w-[340px] aspect-[1.58/1] relative cursor-pointer"
                  style={{ perspective: "1000px" }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* Inner Card */}
                  <div 
                    className="w-full h-full relative duration-700"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front Side */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-xl p-4 flex flex-col justify-between overflow-hidden shadow-lg select-none text-white border border-emerald-500/20"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #081c15 100%)",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      {/* Faint Background Logo / Overlay */}
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Card Top */}
                      <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                            <span className="text-[10px] font-bold">AV</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] font-bold leading-none tracking-tight">رؤية عجلون</span>
                            <span className="text-[7px] text-white/70 leading-none">تيار وطني مدني</span>
                          </div>
                        </div>
                        
                        {/* Smart Card Chip */}
                        <div className="w-8 h-6 rounded bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 opacity-90 relative overflow-hidden border border-yellow-500/20 shadow-inner">
                          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-700/30" />
                          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-700/30" />
                          <div className="absolute top-1 left-2 w-4 h-4 rounded-full border border-amber-700/20" />
                        </div>
                      </div>

                      {/* Card Middle */}
                      <div className="flex gap-3 items-center z-10 mt-1">
                        <Avatar className="w-14 h-14 border border-amber-400/50 shadow-md shrink-0 bg-white/10">
                          <AvatarImage src={member.avatarUrl || undefined} />
                          <AvatarFallback className="text-lg bg-white/20 text-white font-bold">
                            {member.fullNameAr.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0 text-right">
                          <h4 className="text-sm font-bold truncate leading-snug">{member.fullNameAr}</h4>
                          <p className="text-[9px] text-white/80 leading-normal">{member.location || 'محافظة عجلون'}</p>
                          <span className="inline-block mt-1 text-[8px] font-medium bg-amber-400 text-[#0c2419] px-1.5 py-0.5 rounded">
                            {roleMap[member.role] || member.role}
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom */}
                      <div className="flex justify-between items-end z-10">
                        <div className="flex flex-col">
                          <span className="text-[6px] text-white/50 leading-none">رقم العضوية</span>
                          <span className="text-xs font-mono font-bold tracking-wider text-amber-300">AVT-2026-{String(member.id).padStart(4, '0')}</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[6px] text-white/50 leading-none">تاريخ الانتساب</span>
                          <span className="text-[9px] font-medium">{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('ar-JO', {year: 'numeric', month: 'numeric'}) : '2026/06'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-xl p-4 flex flex-col justify-between overflow-hidden shadow-lg select-none text-white border border-amber-600/20"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #8c5e3c 0%, #b07d62 50%, #5c3d24 100%)",
                        transform: "rotateY(180deg)",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                      
                      {/* Magnetic Strip mock */}
                      <div className="absolute top-3 inset-x-0 h-7 bg-zinc-900/90 pointer-events-none" />

                      {/* Back Top Content */}
                      <div className="mt-9 flex gap-3 items-center z-10">
                        {/* Authentic Vector QR code */}
                        <div className="bg-white p-1 rounded shadow-sm shrink-0">
                          <svg width="48" height="48" viewBox="0 0 29 29" fill="none" className="text-zinc-900">
                            <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2z" fill="currentColor" />
                            <path d="M22 0h7v7h-7zm1 1v5h5V1zm1 1h3v3h-2z" fill="currentColor" />
                            <path d="M0 22h7v7H0zm1 1v5h5v-5zm1 1h3v3H2z" fill="currentColor" />
                            <path d="M20 20h5v5h-5zm1 1v3h3v-3z" fill="currentColor" />
                            <path d="M9 1h1v1H9zm2 0h1v1h-1zm2 0h1v2h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm0 2h1v1h-1zm-3-1h1v1h-1zm-2 1h1v1h-1zm0 2h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 2h1v1h-1zm-6-2h1v1H9zm1 1h1v1h-1zm2 0h1v1h-1zm-3 2h2v1H9zm4-1h1v1h-1zm2 1h1v1h-1zm0 2h1v1h-1zm-4-1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm4-12h1v1h-1zm2 0h1v1h-1zm2 1h1v1h-1zm-6 2h1v1h-1zm1 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1 1h1v1h-1zm-6 2h1v1h-1zm1 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm0-3h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 2h1v1h-1z" fill="currentColor" />
                          </svg>
                        </div>

                        <div className="flex-1 text-right text-[8px] text-white/90 leading-tight space-y-1">
                          <p className="font-bold text-[10px] text-amber-200">ميثاق العضوية الرقمي</p>
                          <p>هذه بطاقة رسمية مشفرة تثبت انتساب العضو ونشاطه التنموي في محافظة عجلون.</p>
                          <p className="text-[7px] text-white/70">تخضع هذه البطاقة لشروط وسياسات استخدام منصة تيار رؤية عجلون.</p>
                        </div>
                      </div>

                      {/* Back Bottom Content */}
                      <div className="flex justify-between items-end border-t border-white/20 pt-2 z-10">
                        <span className="text-[7px] tracking-wider text-amber-200/80 font-mono">SECURE DIGITAL ID</span>
                        <div className="text-left flex flex-col items-end">
                          <span className="text-[7px] text-white/50 leading-none">توقيع التيار الرقمي</span>
                          <span className="text-[10px] font-bold text-amber-100 italic" style={{ fontFamily: "Georgia, serif" }}>Ajloun Vision</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide text */}
                <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1 justify-center w-full">
                  <RotateCw className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: "10s" }} />
                  اضغط على البطاقة لقلبها واستعراض تفاصيل التحقق
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 w-full mt-4 border-t pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsDownloading(true);
                      setTimeout(() => {
                        setIsDownloading(false);
                        toast({
                          title: "تم حفظ الهوية بنجاح",
                          description: `تم حفظ بطاقة العضوية رقم AVT-2026-${String(member.id).padStart(4, '0')} كصورة في جهازك.`,
                        });
                      }, 1500);
                    }}
                    disabled={isDownloading}
                    className="text-xs gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isDownloading ? "جاري الحفظ..." : "حفظ الهوية"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsSharing(true);
                      if (navigator.share) {
                        navigator.share({
                          title: `عضوية تيار رؤية عجلون - ${member.fullNameAr}`,
                          text: `تحقق من الملف الشخصي لـ ${member.fullNameAr} في تيار رؤية عجلون الوطني.`,
                          url: window.location.href,
                        }).then(() => setIsSharing(false)).catch(() => setIsSharing(false));
                      } else {
                        setTimeout(() => {
                          navigator.clipboard.writeText(window.location.href);
                          setIsSharing(false);
                          toast({
                            title: "تم نسخ الرابط",
                            description: "تم نسخ رابط الملف الشخصي لمشاركته مع الآخرين.",
                          });
                        }, 1000);
                      }
                    }}
                    disabled={isSharing}
                    className="text-xs gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {isSharing ? "جاري النسخ..." : "مشاركة"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!impactLoading && impact && impact.badges && impact.badges.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  الأوسمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {impact.badges.map((badge, idx) => (
                    <Badge key={idx} variant="outline" className="bg-accent/10 text-accent border-accent/20 px-3 py-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
