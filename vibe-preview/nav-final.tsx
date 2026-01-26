
import { Search, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavigationBespoke() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
        <div className="bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-4 flex items-center justify-between shadow-2xl shadow-black/50">
            <div className="flex items-center gap-12">
                <a href="/" className="text-foreground transition-transform hover:scale-110">
                    <span className="font-bold tracking-tighter text-lg underline decoration-primary underline-offset-8">MIXER</span>
                </a>
                <div className="hidden lg:flex items-center gap-10">
                    {['Engine', 'Synthesis', 'Artifacts', 'Deploy'].map(item => (
                        <a key={item} href="#" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">{item}</a>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                    <Search className="w-4 h-4" />
                </Button>
                <div className="h-4 w-[1px] bg-white/10 mx-2" />
                <Button className="rounded-full px-8 bg-foreground text-background font-bold hover:bg-foreground/90 transition-all">
                    Sign In
                </Button>
            </div>
        </div>
    </nav>
  );
}
