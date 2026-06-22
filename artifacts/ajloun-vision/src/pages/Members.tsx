import { useListMembers } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Award } from "lucide-react";
import { useState } from "react";

export default function Members() {
  const [search, setSearch] = useState("");
  
  const { data: members, isLoading } = useListMembers();
  
  const filteredMembers = members?.filter(member => {
    return member.fullNameAr.includes(search) || (member.bioAr && member.bioAr.includes(search));
  });

  const roleMap: Record<string, string> = {
    admin: "إدارة",
    coordinator: "منسق",
    member: "عضو نشط"
  };

  return (
    <div className="container py-12 px-4 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">أعضاء التيار</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          مجتمع من المواطنين الملتزمين بنهضة عجلون. تعرف على الطاقات الفاعلة في تيارنا.
        </p>
      </div>

      <div className="max-w-md mx-auto relative mb-12">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="ابحث عن عضو..." 
          className="pl-4 pr-10 text-center rounded-full h-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)
        ) : filteredMembers?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground border rounded-xl bg-muted/20">
            لا يوجد أعضاء يطابقون بحثك.
          </div>
        ) : (
          filteredMembers?.map(member => (
            <Link key={member.id} href={`/members/${member.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-transparent hover:border-primary/20 bg-card">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-muted">
                    <AvatarImage src={member.avatarUrl || undefined} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {member.fullNameAr.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg line-clamp-1 mb-1">{member.fullNameAr}</h3>
                  <Badge variant="secondary" className="mb-3 text-xs font-normal">
                    {roleMap[member.role] || member.role}
                  </Badge>
                  
                  {member.location && (
                    <div className="flex items-center text-xs text-muted-foreground mt-auto">
                      <MapPin className="w-3 h-3 ml-1" />
                      <span className="line-clamp-1">{member.location}</span>
                    </div>
                  )}
                  
                  {member.impactScore !== undefined && member.impactScore > 0 && (
                    <div className="flex items-center gap-1 mt-3 text-xs font-medium text-accent">
                      <Award className="w-4 h-4" />
                      <span>{member.impactScore} نقطة أثر</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
