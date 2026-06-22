import { useState } from "react";
import { useListComments, useCreateComment } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react";
import { getListCommentsQueryKey } from "@workspace/api-client-react";

export default function CommentsSection({ postId }: { postId: number }) {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const createComment = useCreateComment();

  const { data: comments, isLoading } = useListComments(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    createComment.mutate({ id: postId, data: { content: text } }, {
      onSuccess: () => {
        setText("");
        queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(postId) });
      },
      onError: () => toast({ variant: "destructive", title: "خطأ في التعليق" }),
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
      {isLoading ? (
        <Skeleton className="h-10" />
      ) : comments?.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-2">لا تعليقات بعد</p>
      ) : (
        comments?.map(c => (
          <div key={c.id} className="flex gap-2 items-start">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="text-xs bg-muted">{(c as any).authorNameAr?.charAt(0) || "م"}</AvatarFallback>
            </Avatar>
            <div className="bg-muted/40 rounded-lg px-3 py-2 flex-1">
              <p className="text-xs font-medium text-foreground mb-0.5">{(c as any).authorNameAr || "عضو"}</p>
              <p className="text-xs text-muted-foreground">{c.content}</p>
            </div>
          </div>
        ))
      )}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="اكتب تعليقاً..."
            className="h-8 text-sm"
          />
          <Button type="submit" size="sm" className="h-8 px-3" disabled={createComment.isPending}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      )}
    </div>
  );
}
