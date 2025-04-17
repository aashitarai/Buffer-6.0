import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function TestimonialCard({ content, author }: TestimonialCardProps) {
  return (
    <Card className="pixel-card h-full">
      <CardContent className="pt-6">
        <Quote className="mb-4 h-6 w-6 text-accent" />
        <p className="text-md">{content}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-4">
          <Avatar className="border-2 border-primary">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {author.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="pixel-font text-sm font-medium text-secondary">{author.name}</p>
            <p className="text-sm text-muted-foreground">{author.role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}