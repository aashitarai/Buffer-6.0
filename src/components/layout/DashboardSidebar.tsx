import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart2, BookOpen, Home, User } from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Learning Paths",
    icon: BookOpen,
    href: "/learning",
  },
  {
    title: "Progress",
    icon: BarChart2,
    href: "/progress",
  },
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
];

export function DashboardSidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r border-primary bg-background">
      <div className="flex h-14 items-center border-b border-primary px-4">
        <Link to="/" className="flex items-center">
          <h1 className="pixel-font text-lg font-bold text-secondary">CodeCraft</h1>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center rounded-none border-2 px-3 py-2 text-sm font-medium",
                  location.pathname === item.href
                    ? "border-secondary bg-muted text-secondary"
                    : "border-transparent text-muted-foreground hover:border-primary hover:text-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span className="pixel-font">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}