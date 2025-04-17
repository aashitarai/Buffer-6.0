import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Header } from "@/components/layout/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Loader2 } from "lucide-react";
import type { Schema } from "@/lib/db-types";

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  progress?: {
    completed: number;
    total: number;
  };
}

function DashboardContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState({ completed: 0, total: 0 });
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;

      try {
        // Fetch categories
        const categoriesData = await fine.table("categories").select();
        
        // Fetch resources
        const resources = await fine.table("resources").select();
        
        // Fetch user progress
        const userProgress = await fine.table("progress")
          .select()
          .eq("userId", session.user.id);
        
        // Calculate progress for each category
        const categoriesWithProgress = categoriesData.map(category => {
          const categoryResources = resources.filter(r => r.categoryId === category.id);
          const completedResources = userProgress.filter(
            p => p.completed && categoryResources.some(r => r.id === p.resourceId)
          );
          
          return {
            id: category.id!,
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl,
            progress: {
              completed: completedResources.length,
              total: categoryResources.length
            }
          };
        });
        
        // Calculate overall progress
        const totalResources = resources.length;
        const totalCompleted = userProgress.filter(p => p.completed).length;
        
        setCategories(categoriesWithProgress);
        setOverallProgress({
          completed: totalCompleted,
          total: totalResources
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
          <h1 className="pixel-font mb-6 text-2xl font-bold text-secondary">Dashboard</h1>
          
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
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="pixel-font">{overallProgress.completed} of {overallProgress.total} resources completed</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="pixel-font mb-4 text-xl font-semibold text-secondary">Your Learning Paths</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                title={category.name}
                description={category.description}
                imageUrl={category.imageUrl || undefined}
                progress={category.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => <ProtectedRoute Component={DashboardContent} />;

export default Dashboard;