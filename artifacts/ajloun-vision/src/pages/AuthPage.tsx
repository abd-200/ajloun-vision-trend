import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

const registerSchema = z.object({
  fullNameAr: z.string().min(3, "الاسم الكامل مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const login = useLogin();
  const register = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullNameAr: "", email: "", password: "", confirmPassword: "" },
  });

  const onLogin = (data: LoginValues) => {
    login.mutate({ data: { email: data.email, password: data.password } }, {
      onSuccess: (user) => {
        queryClient.invalidateQueries();
        toast({ title: `مرحباً ${(user as any).fullNameAr || ""}!`, description: "تم تسجيل الدخول بنجاح" });
        setLocation("/feed");
      },
      onError: () => {
        toast({ variant: "destructive", title: "خطأ في تسجيل الدخول", description: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      },
    });
  };

  const onRegister = (data: RegisterValues) => {
    register.mutate({ data: { email: data.email, password: data.password, fullNameAr: data.fullNameAr, fullName: data.fullNameAr } }, {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast({ title: "تم إنشاء الحساب!", description: "أهلاً بك في تيار رؤية عجلون" });
        setLocation("/feed");
      },
      onError: () => {
        toast({ variant: "destructive", title: "خطأ في التسجيل", description: "هذا البريد الإلكتروني مستخدم بالفعل" });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">تيار رؤية عجلون</h1>
          <p className="text-muted-foreground">سجل دخولك أو أنشئ حساباً جديداً</p>
        </div>

        <Card className="shadow-lg border-muted">
          <Tabs defaultValue="login">
            <TabsList className="w-full rounded-none border-b bg-transparent h-12">
              <TabsTrigger value="login" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
                حساب جديد
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
                <CardDescription>أدخل بيانات حسابك للمتابعة</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="email" placeholder="example@email.com" className="pr-9" dir="ltr" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-9" dir="ltr" {...field} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-3 text-muted-foreground hover:text-foreground">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full h-11 text-base" disabled={login.isPending}>
                      {login.isPending ? "جاري الدخول..." : "دخول"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader>
                <CardTitle className="text-xl">إنشاء حساب جديد</CardTitle>
                <CardDescription>أنشئ حسابك وانضم إلى مجتمع عجلون</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
                    <FormField control={registerForm.control} name="fullNameAr" render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="محمد أحمد الخالدي" className="pr-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="email" placeholder="example@email.com" className="pr-9" dir="ltr" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type={showPassword ? "text" : "password"} placeholder="8 أحرف على الأقل" dir="ltr" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>تأكيد كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type={showPassword ? "text" : "password"} placeholder="أعد كتابة كلمة المرور" dir="ltr" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full h-11 text-base" disabled={register.isPending}>
                      {register.isPending ? "جاري الإنشاء..." : "إنشاء الحساب"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
