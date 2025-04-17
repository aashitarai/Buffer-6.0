import { Link } from "react-router-dom";
import { Github, Linkedin, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-primary bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="pixel-font text-lg font-semibold text-secondary">CodeCraft</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Level up your skills with our retro-inspired learning paths.
            </p>
          </div>
          <div>
            <h3 className="pixel-font text-lg font-semibold text-secondary">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/learning" className="text-muted-foreground hover:text-secondary">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-secondary">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="pixel-font text-lg font-semibold text-secondary">Connect with Founders</h3>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://blog.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary"
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">Blog</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CodeCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}