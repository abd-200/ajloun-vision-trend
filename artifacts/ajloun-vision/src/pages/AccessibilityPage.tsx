import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Type, Volume2, MousePointer, Settings2 } from "lucide-react";
import { Link } from "wouter";
import { customFetch } from "@workspace/api-client-react";

const schema = z.object({
  fontSize: z.string().default("medium"),
  highContrast: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
  screenReader: z.boolean().default(false),
  colorBlind: z.string().default("none"),
  largeText: z.boolean().default(false),
});

type Values = z.infer<typeof schema>;

const FONT_SIZES: Record<string, { label: string; class: string }> = {
  small: { label: "صغير", class: "text-sm" },
  medium: { label: "متوسط (افتراضي)", class: "text-base" },
  large: { label: "كبير", class: "text-lg" },
  xlarge: { label: "كبير جداً", class: "text-xl" },
};

export default function AccessibilityPage() {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      fontSize: (user as any)?.accessibilityFontSize || "medium",
      highContrast: (user as any)?.accessibilityHighContrast || false,
      reduceMotion: (user as any)?.accessibilityReduceMotion || false,
      screenReader: (user as any)?.accessibilityScreenReader || false,
      colorBlind: (user as any)?.accessibilityColorBlind || "none",
      largeText: (user as any)?.accessibilityLargeText || false,
    },
  });

  const values = form.watch();

  useEffect(() => {
    const root = document.documentElement;
    if (values.highContrast) root.classList.add("high-contrast");
    else root.classList.remove("high-contrast");
    if (values.reduceMotion) root.classList.add("reduce-motion");
    else root.classList.remove("reduce-motion");
    if (values.largeText) root.classList.add("large-text");
    else root.classList.remove("large-text");
  }, [values.highContrast, values.reduceMotion, values.largeText]);

  const onSave = async (data: Values) => {
    try {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      await customFetch(`${base}/api/auth/accessibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fontSize: data.fontSize,
          highContrast: data.highContrast,
          reduceMotion: data.reduceMotion,
          screenReader: data.screenReader,
          colorBlind: data.colorBlind,
          largeText: data.largeText,
        }),
      });
      toast({ title: "تم حفظ إعدادات إمكانية الوصول" });
    } catch {
      toast({ variant: "destructive", title: "تعذّر الحفظ" });
    }
  };

  return (
    <div className="container py-10 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Settings2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">إعدادات إمكانية الوصول</h1>
        <p className="text-muted-foreground">تخصيص تجربتك لتناسب احتياجاتك</p>
      </div>

      {!isLoggedIn && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mb-6">
          <p className="text-sm text-yellow-800 mb-2">سجّل الدخول لحفظ إعداداتك بشكل دائم</p>
          <Button asChild variant="outline" size="sm"><Link href="/auth">تسجيل الدخول</Link></Button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">حجم الخط</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="fontSize" render={({ field }) => (
                <FormItem>
                  <FormLabel>حجم النص</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FONT_SIZES).map(([val, { label }]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="largeText" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base cursor-pointer">نص كبير للقراءة</FormLabel>
                    <FormDescription>تكبير جميع النصوص للأشخاص ضعاف البصر</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">التباين والألوان</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="highContrast" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base cursor-pointer">تباين عالٍ</FormLabel>
                    <FormDescription>زيادة التباين بين النصوص والخلفية</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="colorBlind" render={({ field }) => (
                <FormItem>
                  <FormLabel>وضع عمى الألوان</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون تعديل</SelectItem>
                      <SelectItem value="deuteranopia">ثنائية اللون الأخضر</SelectItem>
                      <SelectItem value="protanopia">ثنائية اللون الأحمر</SelectItem>
                      <SelectItem value="tritanopia">ثنائية اللون الأزرق</SelectItem>
                      <SelectItem value="achromatopsia">أحادية اللون</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">الحركة وقارئ الشاشة</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="reduceMotion" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base cursor-pointer">تقليل الحركة</FormLabel>
                    <FormDescription>إيقاف الرسوم المتحركة للأشخاص ذوي الإعاقات الإدراكية</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="screenReader" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base cursor-pointer">تحسين قارئ الشاشة</FormLabel>
                    <FormDescription>تعزيز التوافق مع تقنيات قارئات الشاشة مثل NVDA و VoiceOver</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-11" disabled={!isLoggedIn}>
            {isLoggedIn ? "حفظ الإعدادات" : "سجّل الدخول لحفظ الإعدادات"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
