import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { LevelTabs } from "@/components/LevelTabs";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Schema } from "@/lib/db-types";

interface Resource {
  id: number;
  categoryId: number;
  title: string;
  description?: string | null;
  link: string;
  type: string;
  level: string;
  completed: boolean;
  note?: string;
}

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

function CategoryContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !session?.user) return;

      try {
        // Fetch category
        const categoryData = await fine.table("categories")
          .select()
          .eq("id", parseInt(id));
        
        if (!categoryData || categoryData.length === 0) {
          navigate("/learning");
          return;
        }
        
        // Fetch resources for this category
        const resourcesData = await fine.table("resources")
          .select()
          .eq("categoryId", parseInt(id));
        
        // Fetch user progress
        const userProgress = await fine.table("progress")
          .select()
          .eq("userId", session.user.id);
        
        // Fetch user notes
        const userNotes = await fine.table("notes")
          .select()
          .eq("userId", session.user.id);
        
        // Combine resources with progress and notes
        const resourcesWithProgress = resourcesData.map(resource => {
          const progress = userProgress.find(p => p.resourceId === resource.id);
          const note = userNotes.find(n => n.resourceId === resource.id);
          
          return {
            ...resource,
            completed: progress ? progress.completed : false,
            note: note ? note.content : undefined
          } as Resource;
        });
        
        // Calculate category progress
        const completedResources = resourcesWithProgress.filter(r => r.completed).length;
        
        setCategory({
          id: categoryData[0].id!,
          name: categoryData[0].name,
          description: categoryData[0].description,
          imageUrl: categoryData[0].imageUrl,
          progress: {
            completed: completedResources,
            total: resourcesWithProgress.length
          }
        });
        
        setResources(resourcesWithProgress);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, session]);

  const handleProgressUpdate = (resourceId: number, completed: boolean) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, completed } 
          : resource
      )
    );
    
    // Update category progress
    if (category) {
      const completedCount = resources.filter(r => 
        r.id === resourceId ? completed : r.completed
      ).length;
      
      setCategory({
        ...category,
        progress: {
          completed: completedCount,
          total: resources.length
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <Button 
              className="pixel-btn mb-4 border-accent text-accent"
              onClick={() => navigate("/learning")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="pixel-font">Back</span>
            </Button>
            
            <h1 className="pixel-font text-2xl font-bold text-secondary">{category.name}</h1>
            <p className="mt-2 text-muted-foreground">{category.description}</p>
            
            {category.progress && (
              <div className="mt-4 max-w-md">
                <ProgressBar 
                  value={category.progress.completed} 
                  max={category.progress.total || 1} 
                  label="Your Progress" 
                />
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <LevelTabs 
              resources={resources} 
              onProgressUpdate={handleProgressUpdate} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Category = () => <ProtectedRoute Component={CategoryContent} />;

export default Category;