
import { Github, Twitter , Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavigationSticky() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold inline-block">Taste Engine</span>
          </a>
          <div className="hidden md:flex gap-6">
            <a className="text-sm font-medium transition-colors hover:text-primary" href="#features">Features</a>
            <a className="text-sm font-medium transition-colors hover:text-primary" href="#pricing">Pricing</a>
            <a className="text-sm font-medium transition-colors hover:text-primary" href="#docs">Docs</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
             <Github className="h-4 w-4" />
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
