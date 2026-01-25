import { Zap, Shield, Clock, Star, Check, ArrowRight } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  title?: string;
  description?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  { icon: <Zap className="h-6 w-6" />, title: "Lightning Fast", description: "Built for speed with optimized performance at every level." },
  { icon: <Shield className="h-6 w-6" />, title: "Secure by Default", description: "Enterprise-grade security with end-to-end encryption." },
  { icon: <Clock className="h-6 w-6" />, title: "99.9% Uptime", description: "Reliable infrastructure you can count on, always." },
  { icon: <Star className="h-6 w-6" />, title: "Top Rated", description: "Loved by thousands of customers worldwide." },
  { icon: <Check className="h-6 w-6" />, title: "Easy Setup", description: "Get started in minutes, not hours." },
  { icon: <ArrowRight className="h-6 w-6" />, title: "Scalable", description: "Grows with your business needs." },
];

export function FeaturesGrid({
  title = "Why High-fidelity UI Engineers and Vibe Coders love Taste Engine",
  description = "Everything you need to build amazing products",
  features = [
  {
    icon: <Zap className="h-6 w-6" />,
    "title": "Design system",
    "description": "Optimized for speed and performance"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    "title": "Ai",
    "description": "Built with developers in mind"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    "title": "Claude code",
    "description": "Battle-tested and reliable"
  },
  {
    icon: <Star className="h-6 w-6" />,
    "title": "Highly Customizable",
    "description": "Tailor every detail to your brand's unique needs."
  },
  {
    icon: <Check className="h-6 w-6" />,
    "title": "Production Ready",
    "description": "Battle-tested components ready for immediate deployment."
  },
  {
    icon: <ArrowRight className="h-6 w-6" />,
    "title": "Scalable Architecture",
    "description": "Designed to grow with your product complexity."
  }
],
}: FeaturesGridProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
