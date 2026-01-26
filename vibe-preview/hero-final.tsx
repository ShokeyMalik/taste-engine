import { Dna, Webhook, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroBespoke() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 min-h-[90vh] flex items-center">
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase text-primary mb-10 tracking-[0.2em]">
                <Dna className="w-3 h-3" />
                Structural DNA Synthesis Active
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.8] text-foreground mb-10" style={{ fontFamily: 'Untitled Sans' }}>
                Ship Synthesized Taste Explorer to Production Faster
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-12">
                The world's first generative design engine that harvests elite UI patterns from your favorite libraries.
            </p>
            <div className="flex flex-wrap gap-6">
                <Button size="lg" className="h-14 px-10 text-lg rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    Generate Yours
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex -space-x-3 items-center">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                            <Webhook className="w-5 h-5 text-muted-foreground/50" />
                         </div>
                     ))}
                     <span className="ml-6 text-sm font-semibold text-muted-foreground">+5 Inspos Mixed</span>
                </div>
            </div>
        </div>
        <div className="lg:col-span-5 relative">
             <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent border border-white/5 p-8 backdrop-blur-3xl shadow-3xl">
                <div className="w-full h-full rounded-[2rem] bg-background/40 border border-white/10 p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <Zap className="w-10 h-10 text-primary animate-pulse" />
                        <div className="w-20 h-2 bg-primary/20 rounded-full" />
                    </div>
                    <div className="space-y-6">
                        <div className="w-full h-4 bg-muted/40 rounded-full" />
                        <div className="w-3/4 h-4 bg-muted/40 rounded-full" />
                        <div className="w-1/2 h-16 bg-primary/10 border border-primary/20 rounded-2xl" />
                    </div>
                </div>
             </div>
             {/* Floating DNA Fragments */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full animate-blob" />
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full animate-blob animation-delay-2000" />
        </div>
      </div>
    </section>
  );
}
