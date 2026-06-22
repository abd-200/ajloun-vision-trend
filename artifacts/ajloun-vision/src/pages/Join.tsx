import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMember } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const joinSchema = z.object({
  fullNameAr: z.string().min(3, "الاسم الكامل مطلوب بالعربية"),
  fullName: z.string().min(3, "Full name is required").optional().or(z.literal("")),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  location: z.string().min(2, "المنطقة مطلوبة"),
  bioAr: z.string().optional()
});

type JoinFormValues = z.infer<typeof joinSchema>;

export default function Join() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMember = useCreateMember();

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      fullNameAr: "",
      fullName: "",
      email: "",
      location: "",
      bioAr: ""
    }
  });

  const onSubmit = (data: JoinFormValues) => {
    // Fill in required English fields implicitly if not provided
    const payload = {
      ...data,
      fullName: data.fullName || data.fullNameAr,
      role: "member" as const
    };

    createMember.mutate({ data: payload }, {
      onSuccess: () => {
        toast({
          title: "تم التسجيل بنجاح!",
          description: "أهلاً بك في تيار رؤية عجلون. تم إنشاء حسابك بنجاح.",
        });
        setLocation("/members");
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: "لم نتمكن من إتمام التسجيل. يرجى المحاولة مرة أخرى.",
        });
      }
    });
  };

  return (
    <div className="container py-16 px-4 max-w-3xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 text-primary">
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">انضم إلى التيار</h1>
        <p className="text-lg text-muted-foreground">
          نؤمن بأن التغيير الحقيقي يبدأ من المواطن. كن جزءاً من المنصة التي تصنع الفرق في عجلون.
        </p>
      </div>

      <Card className="border-muted shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>نموذج التسجيل</CardTitle>
          <CardDescription>يرجى تعبئة بياناتك للإنضمام كعضو في التيار</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullNameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل (بالعربية)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسمك الكامل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@email.com" dir="ltr" className="text-left" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنطقة / البلدة في عجلون</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: مدينة عجلون، عنجرة، كفرنجة..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bioAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نبذة عنك واهتماماتك (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="أخبرنا عن خبراتك، مهاراتك، وما تطمح لتحقيقه في عجلون..." 
                        className="resize-none min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg border border-dashed">
                عند إتمام التسجيل، فإنك توافق على{" "}
                <Link href="/join-terms" className="text-primary font-bold hover:underline">
                  تعليمات وشروط الانضمام
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="text-primary font-bold hover:underline">
                  سياسة الخصوصية
                </Link>{" "}
                الخاصة بـمنصة تيار رؤية عجلون.
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg h-14" 
                disabled={createMember.isPending}
              >
                {createMember.isPending ? "جاري التسجيل..." : "تسجيل الانضمام"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
