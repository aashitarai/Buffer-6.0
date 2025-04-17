import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Loader2 } from "lucide-react";
import type { Schema } from "@/lib/db-types";

interface CategoryProgress {
  id: number;
  name: string;
  completed: number;
  total: number;
  percentage: number;
}

function ProgressContent() {
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;

      try {
        // Fetch categories
        const categories = await fine.table("categories").select();
        
        // Fetch resources
        const resources = await fine.table("resources").select();
        
        // Fetch user progress
        const userProgress = await fine.table("progress")
          .select()
          .eq("userId", session.user.id);
        
        // Calculate progress for each category
        const progressByCategory = categories.map(category => {
          const categoryResources = resources.filter(r => r.categoryId === category.id);
          const completedResources = userProgress.filter(
            p => p.completed && categoryResources.some(r => r.id === p.resourceId)
          );
          
          const completed = completedResources.length;
          const total = categoryResources.length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          return {
            id: category.id!,
            name: category.name,
            completed,
            total,
            percentage
          };
        });
        
        // Calculate overall progress
        const totalResources = resources.length;
        const totalCompleted = userProgress.filter(p => p.completed).length;
        const overallPercentage = totalResources > 0 
          ? Math.round((totalCompleted / totalResources) * 100) 
          : 0;
        
        setCategoryProgress(progressByCategory);
        setOverallProgress({
          completed: totalCompleted,
          total: totalResources,
          percentage: overallPercentage
        });
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="pixel-font mb-6 text-2xl font-bold text-secondary">Your Progress</h1>
          
          <div className="mb-8">
            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="pixel-font text-secondary">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar 
                  value={overallProgress.completed} 
                  max={overallProgress.total || 1} 
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="pixel-font text-sm text-muted-foreground">
                    {overallProgress.completed} of {overallProgress.total} resources completed
                  </p>
                  <p className="pixel-font text-sm font-medium text-secondary">
                    {overallProgress.percentage}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="pixel-font mb-4 text-xl font-semibold text-secondary">Progress by Category</h2>
          <div className="grid gap-4">
            {categoryProgress.map((category) => (
              <Card key={category.id} className="pixel-card">
                <CardHeader className="pb-2">
                  <CardTitle className="pixel-font text-lg text-secondary">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressBar 
                    value={category.completed} 
                    max={category.total || 1} 
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="pixel-font text-sm text-muted-foreground">
                      {category.completed} of {category.total} resources completed
                    </p>
                    <p className="pixel-font text-sm font-medium text-secondary">
                      {category.percentage}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Progress = () => <ProtectedRoute Component={ProgressContent} />;

export default Progress;