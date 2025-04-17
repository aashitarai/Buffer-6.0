import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProgressBar } from "@/components/ui/progress-bar";

interface CategoryCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  progress?: {
    completed: number;
    total: number;
  };
}

export function CategoryCard({ id, title, description, imageUrl, progress }: CategoryCardProps) {
  return (
    <Card className="pixel-card overflow-hidden transition-all hover:translate-y-[-4px]">
      <CardHeader className="pb-2">
        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={imageUrl}
              alt={title}
              className="h-16 w-16 object-contain"
            />
          </div>
        )}
        <CardTitle className="pixel-font text-center text-secondary">{title}</CardTitle>
        <CardDescription className="line-clamp-2 text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {progress && (
          <ProgressBar
            value={progress.completed}
            max={progress.total}
            label="Progress"
          />
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/category/${id}`} className="w-full">
          <Button className="pixel-btn w-full border-secondary text-secondary">
            <span className="pixel-font">Explore Path</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}