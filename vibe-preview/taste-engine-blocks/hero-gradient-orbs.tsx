import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroGradientOrbsProps {
  title?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export function HeroGradientOrbs({
  title = "Ship Taste Engine to Production Faster",
  description = "The Unified Design Intelligence Platform for High-Productivity Vibe Coding. Extract design tokens, high-fidelity assets, and global motion codes from any URL. Powering your IDE with real-world design context via MCP.",
  primaryCta = "Get Started Free",
  secondaryCta = "View Documentation",
}: HeroGradientOrbsProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium text-muted-foreground mb-8">
            <Sparkles className="h-4 w-4" />
            Introducing our latest update
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg">
              {secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
