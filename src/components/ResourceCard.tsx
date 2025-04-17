import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, MessageSquare, Save, X } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";

interface ResourceCardProps {
  id: number;
  title: string;
  description?: string;
  link: string;
  type: string;
  completed: boolean;
  note?: string;
  onProgressUpdate: (resourceId: number, completed: boolean) => void;
}

export function ResourceCard({
  id,
  title,
  description,
  link,
  type,
  completed,
  note,
  onProgressUpdate,
}: ResourceCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteContent, setNoteContent] = useState(note || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();

  const handleProgressChange = async (checked: boolean) => {
    if (!session?.user) return;
    
    setIsCompleted(checked);
    onProgressUpdate(id, checked);
    
    try {
      // Check if progress record exists
      const existingProgress = await fine.table("progress")
        .select()
        .eq("userId", session.user.id)
        .eq("resourceId", id);
      
      if (existingProgress && existingProgress.length > 0) {
        // Update existing record
        await fine.table("progress")
          .update({ completed: checked })
          .eq("userId", session.user.id)
          .eq("resourceId", id);
      } else {
        // Create new record
        await fine.table("progress").insert({
          userId: session.user.id,
          resourceId: id,
          completed: checked
        });
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const saveNote = async () => {
    if (!session?.user) return;
    
    setIsSaving(true);
    try {
      // Check if note exists
      const existingNotes = await fine.table("notes")
        .select()
        .eq("userId", session.user.id)
        .eq("resourceId", id);
      
      if (existingNotes && existingNotes.length > 0) {
        // Update existing note
        await fine.table("notes")
          .update({ 
            content: noteContent,
            updatedAt: new Date().toISOString()
          })
          .eq("userId", session.user.id)
          .eq("resourceId", id);
      } else {
        // Create new note
        await fine.table("notes").insert({
          userId: session.user.id,
          resourceId: id,
          content: noteContent
        });
      }
      
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
      setShowNoteEditor(false);
    } catch (error) {
      console.error("Failed to save note:", error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="pixel-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="pixel-font text-lg text-secondary">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={isCompleted} 
              onCheckedChange={handleProgressChange} 
              id={`resource-${id}`}
              className="border-secondary text-secondary"
            />
            <label 
              htmlFor={`resource-${id}`}
              className="pixel-font text-sm text-muted-foreground"
            >
              {isCompleted ? "Completed" : "Mark as complete"}
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="rounded-none border-2 border-accent bg-background px-2 py-1 text-xs text-accent">
            <span className="pixel-font">{type}</span>
          </span>
        </div>
        
        {note && !showNoteEditor && (
          <div className="mt-4 border-2 border-primary bg-muted p-3">
            <div className="flex items-center justify-between">
              <h4 className="pixel-font text-sm font-medium text-primary">Your Notes</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNoteEditor(true)}
                className="text-primary hover:text-primary/80"
              >
                Edit
              </Button>
            </div>
            <p className="mt-1 text-sm">{note}</p>
          </div>
        )}
        
        {showNoteEditor && (
          <div className="mt-4">
            <Textarea
              placeholder="Add your notes here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[100px] border-2 border-primary bg-background"
            />
            <div className="mt-2 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowNoteEditor(false);
                  setNoteContent(note || "");
                }}
                className="border-accent text-accent"
              >
                <X className="mr-1 h-4 w-4" />
                <span className="pixel-font">Cancel</span>
              </Button>
              <Button 
                size="sm" 
                onClick={saveNote}
                disabled={isSaving}
                className="border-secondary bg-secondary text-secondary-foreground"
              >
                <Save className="mr-1 h-4 w-4" />
                <span className="pixel-font">Save Note</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" className="pixel-btn w-full border-primary">
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="pixel-font">Open Resource</span>
          </Button>
        </a>
        
        {!showNoteEditor && !note && (
          <Button 
            variant="ghost" 
            onClick={() => setShowNoteEditor(true)}
            className="ml-2 text-primary hover:text-primary/80"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="pixel-font">Add Note</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}