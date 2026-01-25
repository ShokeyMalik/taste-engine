
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSimple() {
  return (
    <section className="py-24" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground">Start free, scale as you grow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {["Free", "Pro", "Enterprise"].map((tier, i) => (
            <div key={tier} className={"rounded-3xl border p-8 flex flex-col " + (i === 1 ? 'border-primary shadow-xl ring-1 ring-primary' : '')}>
              <h3 className="text-xl font-bold">{tier}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${i === 0 ? '0' : i === 1 ? '49' : '99'}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-8 space-y-4 flex-1">
                 {["Unlimited Extraction", "Vibe Context Sync", "MCP Access"].map(item => (
                   <li key={item} className="flex items-center gap-2">
                     <Check className="h-4 w-4 text-primary" />
                     <span className="text-sm">{item}</span>
                   </li>
                 ))}
              </ul>
              <Button className="mt-8" variant={i === 1 ? "default" : "outline"}>Get Started</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
