import { useState, useRef } from "react";
import { useListPosts, useCreatePost, useLikePost, useDeletePost } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Trash2, Send, Image, Filter } from "lucide-react";
import { Link } from "wouter";
import { getListPostsQueryKey } from "@workspace/api-client-react";
import CommentsSection from "@/components/feed/CommentsSection";

const CATEGORIES = [
  { value: "all", label: "الكل" },
  { value: "general", label: "عام" },
  { value: "initiative", label: "مبادرة" },
  { value: "opportunity", label: "فرصة" },
  { value: "announcement", label: "إعلان" },
  { value: "volunteering", label: "تطوع" },
];

export default function Feed() {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("general");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const createPost = useCreatePost();
  const likePost = useLikePost();
  const deletePost = useDeletePost();

  const params = filterCategory !== "all" ? { category: filterCategory } : {};
  const { data: posts, isLoading } = useListPosts({ params });

  const handlePost = () => {
    if (!content.trim()) return;
    createPost.mutate({ data: { content, category } }, {
      onSuccess: () => {
        setContent("");
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
        toast({ title: "تم نشر المنشور" });
      },
      onError: () => toast({ variant: "destructive", title: "خطأ", description: "تعذّر نشر المنشور" }),
    });
  };

  const handleLike = (id: number) => {
    likePost.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() }),
    });
  };

  const handleDelete = (id: number) => {
    deletePost.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
        toast({ title: "تم حذف المنشور" });
      },
    });
  };

  return (
    <div className="container py-8 px-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">المنشورات المجتمعية</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoggedIn ? (
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.fullNameAr?.charAt(0) || "؟"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="ما الذي يدور في ذهنك حول عجلون؟"
                  className="min-h-[80px] resize-none border-0 bg-muted/30 focus-visible:ring-1"
                />
                <div className="flex items-center justify-between">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-32 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.slice(1).map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handlePost} disabled={!content.trim() || createPost.isPending} size="sm" className="gap-2">
                    <Send className="w-4 h-4" />
                    نشر
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground mb-3">سجّل الدخول للمشاركة في النقاشات</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl mb-4" />)
      ) : posts?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>لا توجد منشورات حتى الآن. كن الأول!</p>
        </div>
      ) : posts?.map(post => (
        <Card key={post.id} className="mb-4 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {(post as any).authorNameAr?.charAt(0) || "م"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-foreground">{(post as any).authorNameAr || "عضو"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date((post as any).createdAt).toLocaleDateString("ar-JO", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{getCategoryLabel(post.category)}</Badge>
                {(user?.id === (post as any).userId || user?.role === "admin") && (
                  <button onClick={() => handleDelete(post.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-foreground leading-relaxed mb-4 text-sm whitespace-pre-wrap">{post.content}</p>
            {(post as any).imageUrl && (
              <img src={(post as any).imageUrl} alt="صورة المنشور" className="rounded-lg w-full max-h-72 object-cover mb-4" />
            )}
            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
              <button
                onClick={() => isLoggedIn ? handleLike(post.id) : toast({ description: "سجّل الدخول أولاً" })}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span>{(post as any).likesCount || 0}</span>
              </button>
              <button
                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{(post as any).commentsCount || 0} تعليق</span>
              </button>
            </div>
            {expandedPost === post.id && (
              <CommentsSection postId={post.id} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getCategoryLabel(cat?: string) {
  return CATEGORIES.find(c => c.value === cat)?.label || cat || "عام";
}
