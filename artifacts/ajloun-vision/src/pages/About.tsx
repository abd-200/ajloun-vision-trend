import { useListKnowledge } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Lightbulb, Compass, Milestone, Flag } from "lucide-react";

export default function About() {
  const { data: knowledge, isLoading } = useListKnowledge();

  const getSection = (category: string) => {
    return knowledge?.filter(k => k.category === category).sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
  };

  const vision = getSection("vision");
  const mission = getSection("mission");
  const pillars = getSection("pillars");
  const goals = getSection("goals");
  const values = getSection("values");

  if (isLoading) {
    return (
      <div className="container py-16 px-4 max-w-4xl space-y-12">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 px-4 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">عن تيار رؤية عجلون</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          حركة مجتمعية مستقلة تهدف إلى توحيد الجهود لتحقيق تنمية مستدامة وشاملة في محافظة عجلون، من خلال تمكين المواطنين وتوجيه الطاقات نحو مشاريع ذات أثر حقيقي.
        </p>
      </div>

      <div className="space-y-16">
        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8">
          {vision.length > 0 && (
            <Card className="bg-primary/5 border-none shadow-sm overflow-hidden">
              <div className="h-2 w-full bg-primary" />
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Lightbulb className="w-8 h-8 text-primary" />
                  رؤيتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vision.map(v => (
                    <div key={v.id}>
                      <h4 className="font-bold mb-2">{v.titleAr}</h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{v.contentAr}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {mission.length > 0 && (
            <Card className="bg-accent/5 border-none shadow-sm overflow-hidden">
              <div className="h-2 w-full bg-accent" />
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Target className="w-8 h-8 text-accent" />
                  رسالتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mission.map(m => (
                    <div key={m.id}>
                      <h4 className="font-bold mb-2">{m.titleAr}</h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{m.contentAr}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Values */}
        {values.length > 0 && (
          <section className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 justify-center">
              <Compass className="w-7 h-7 text-primary" />
              قيمنا الأساسية
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {values.map(v => (
                <div key={v.id} className="text-center p-4">
                  <h4 className="font-bold text-lg mb-2 text-foreground">{v.titleAr}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.contentAr}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pillars */}
        {pillars.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">الركائز الاستراتيجية</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pillars.map((p, i) => (
                <Card key={p.id} className="hover:shadow-md transition-shadow border-muted">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                      {i + 1}
                    </div>
                    <CardTitle className="text-xl">{p.titleAr}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{p.contentAr}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Goals */}
        {goals.length > 0 && (
          <section className="bg-muted/30 rounded-2xl p-8 md:p-12 border">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Milestone className="w-8 h-8 text-primary" />
              أهدافنا
            </h2>
            <div className="space-y-6">
              {goals.map(g => (
                <div key={g.id} className="flex items-start gap-4 bg-background p-6 rounded-xl shadow-sm border">
                  <Flag className="w-6 h-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">{g.titleAr}</h4>
                    <p className="text-muted-foreground leading-relaxed">{g.contentAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
