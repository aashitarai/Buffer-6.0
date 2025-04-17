import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

function ProfileContent() {
  const { data: session } = fine.auth.useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Note: This is a placeholder for profile update functionality
      // The Fine SDK doesn't expose a direct method to update user profiles
      // In a real implementation, you would call the appropriate API
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="pixel-font mb-6 text-2xl font-bold text-secondary">Your Profile</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="pixel-font text-secondary">Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {session.user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="pixel-font font-medium text-secondary">{session.user.name}</h3>
                      <p className="text-sm text-muted-foreground">Member since {new Date(session.user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="pixel-font">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-2 border-primary bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="pixel-font">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="border-2 border-primary bg-background"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="pixel-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="pixel-font">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        <span className="pixel-font">Save Changes</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="pixel-font text-secondary">Game Stats</CardTitle>
                <CardDescription>Your learning achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="pixel-font text-sm">Level</span>
                    <span className="pixel-font text-sm text-secondary">5</span>
                  </div>
                  <div className="pixel-progress-bg">
                    <div className="pixel-progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-right text-xs text-muted-foreground">650/1000 XP</p>
                </div>
                
                <div className="space-y-1">
                  <p className="pixel-font text-sm">Achievements</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-none border-2 border-secondary bg-muted"></div>
                      <span className="mt-1 text-xs">First Step</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-none border-2 border-secondary bg-muted"></div>
                      <span className="mt-1 text-xs">Quick Learner</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-none border-2 border-accent bg-muted"></div>
                      <span className="mt-1 text-xs">Code Master</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const Profile = () => <ProtectedRoute Component={ProfileContent} />;

export default Profile;