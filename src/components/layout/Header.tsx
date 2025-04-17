import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fine } from "@/lib/fine";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { data: session } = fine.auth.useSession();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fine.auth.signOut();
    navigate("/");
  };

  return (
    <header className="border-b border-primary bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="pixel-font text-xl font-bold text-secondary">CodeCraft</h1>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="border border-primary text-primary">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-2 border-primary bg-background">
              <nav className="mt-8 flex flex-col gap-4">
                <Link to="/" className="pixel-font text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                {session?.user ? (
                  <>
                    <Link to="/dashboard" className="pixel-font text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/learning" className="pixel-font text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
                      Learning Paths
                    </Link>
                    <Button variant="ghost" className="justify-start px-0 text-accent" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="pixel-font text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/signup" className="pixel-font text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link to="/" className="pixel-font text-sm font-medium transition-colors hover:text-secondary">
            Home
          </Link>
          {session?.user ? (
            <>
              <Link to="/dashboard" className="pixel-font text-sm font-medium transition-colors hover:text-secondary">
                Dashboard
              </Link>
              <Link to="/learning" className="pixel-font text-sm font-medium transition-colors hover:text-secondary">
                Learning Paths
              </Link>
              <Button className="pixel-btn" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button className="pixel-btn border-accent text-accent">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="pixel-btn">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}