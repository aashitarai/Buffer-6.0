import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/ResourceCard";

interface Resource {
  id: number;
  title: string;
  description?: string;
  link: string;
  type: string;
  level: string;
  completed: boolean;
  note?: string;
}

interface LevelTabsProps {
  resources: Resource[];
  onProgressUpdate: (resourceId: number, completed: boolean) => void;
}

export function LevelTabs({ resources, onProgressUpdate }: LevelTabsProps) {
  const beginnerResources = resources.filter(r => r.level === "beginner");
  const intermediateResources = resources.filter(r => r.level === "intermediate");
  const advancedResources = resources.filter(r => r.level === "advanced");

  return (
    <Tabs defaultValue="beginner" className="w-full">
      <TabsList className="grid w-full grid-cols-3 border-2 border-primary bg-background">
        <TabsTrigger 
          value="beginner" 
          className="pixel-font border-r-2 border-primary data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
        >
          Beginner
        </TabsTrigger>
        <TabsTrigger 
          value="intermediate" 
          className="pixel-font border-r-2 border-primary data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
        >
          Intermediate
        </TabsTrigger>
        <TabsTrigger 
          value="advanced" 
          className="pixel-font data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
        >
          Advanced
        </TabsTrigger>
      </TabsList>
      <TabsContent value="beginner" className="mt-6 space-y-6">
        {beginnerResources.length > 0 ? (
          beginnerResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              title={resource.title}
              description={resource.description}
              link={resource.link}
              type={resource.type}
              completed={resource.completed}
              note={resource.note}
              onProgressUpdate={onProgressUpdate}
            />
          ))
        ) : (
          <p className="pixel-font text-center text-muted-foreground">No beginner resources available yet.</p>
        )}
      </TabsContent>
      <TabsContent value="intermediate" className="mt-6 space-y-6">
        {intermediateResources.length > 0 ? (
          intermediateResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              title={resource.title}
              description={resource.description}
              link={resource.link}
              type={resource.type}
              completed={resource.completed}
              note={resource.note}
              onProgressUpdate={onProgressUpdate}
            />
          ))
        ) : (
          <p className="pixel-font text-center text-muted-foreground">No intermediate resources available yet.</p>
        )}
      </TabsContent>
      <TabsContent value="advanced" className="mt-6 space-y-6">
        {advancedResources.length > 0 ? (
          advancedResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              title={resource.title}
              description={resource.description}
              link={resource.link}
              type={resource.type}
              completed={resource.completed}
              note={resource.note}
              onProgressUpdate={onProgressUpdate}
            />
          ))
        ) : (
          <p className="pixel-font text-center text-muted-foreground">No advanced resources available yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}