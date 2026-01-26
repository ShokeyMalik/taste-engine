/**
 * Landing Page Block Templates
 *
 * Template generators for landing page blocks (hero, features, pricing, etc.)
 */

import type { AppliedTuners, BlockGenerationInput, BlockGenerationOutput } from '../types';
import type { InspirationProfile } from '../../inspiration/inspiration-profile';
import {
  buildClasses,
  getSpacingClasses,
  getMotionClasses,
  getBorderRadiusClasses,
  getShadowClasses,
  generateComponentName,
  generateFileName,
  placeholders,
  getLucideImport,
  getGridClasses,
  applyTuners,
  getAnimationClasses,
  getArchetype,
  getHarvestedLogo,
  getHarvestedPattern,
  injectSVG,
  indent
} from './base';

// =============================================================================
// HERO TEMPLATES
// =============================================================================

export function generateHeroTemplate(
  input: BlockGenerationInput,
  profile?: InspirationProfile
): BlockGenerationOutput {
  const { tuners, componentLibrary, content } = input;
  let { variant } = input;

  // Archetype override
  const archetype = getArchetype(profile, 'hero');
  if (archetype) variant = archetype;

  // Synthesis Mode: Bespoke for Mixed DNA
  const isMixed = profile && (profile.name.includes('Mixed') || profile.name.includes('Mix') || profile.name.includes('DNA'));
  if (isMixed) variant = 'bespoke';

  const componentName = generateComponentName('hero', variant);

  let code: string;
  let dependencies: string[] = ['lucide-react'];

  switch (variant) {
    case 'bespoke':
      code = generateHeroBespoke(tuners, profile, componentLibrary, content);
      break;
    case 'split':
      code = generateHeroSplit(tuners, profile, componentLibrary, content);
      break;
    case 'gradient-orbs':
      code = generateHeroGradientOrbs(tuners, profile, componentLibrary, content);
      break;
    default:
      code = generateHeroCentered(tuners, profile, componentLibrary, content);
  }

  if (componentLibrary === 'shadcn') {
    dependencies.push('@/components/ui/button');
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies,
    slots: {},
    variantUsed: variant,
    explanation: `Hero section for ${variant} layout synthesized with High Fidelity.`,
  };
}

function generateHeroCentered(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const buttonImport = library === 'shadcn' ? 'import { Button } from "@/components/ui/button";' : '';
  return `${getLucideImport(['ArrowRight'])}
${buttonImport}

export function HeroCentered() {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-background">
      <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tighter">
            ${content?.headline || placeholders.heading(1)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            ${content?.subheadline || placeholders.paragraph('medium')}
          </p>
          <div className="flex justify-center gap-4">
             <Button size="lg">${content?.cta_primary || 'Get Started'}</Button>
          </div>
      </div>
    </section>
  );
}
`;
}

function generateHeroSplit(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const buttonImport = library === 'shadcn' ? 'import { Button } from "@/components/ui/button";' : '';
  return `${getLucideImport(['ArrowRight', 'CheckCircle'])}
${buttonImport}

export function HeroSplit() {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-background">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tighter">
              ${content?.headline || placeholders.heading(1)}
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              ${content?.subheadline || placeholders.paragraph('long')}
            </p>
            <Button size="lg" className="px-10">${content?.cta_primary || 'Explore DNA'}</Button>
          </div>
          <div className="aspect-video bg-muted rounded-[2rem] border border-border overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
          </div>
      </div>
    </section>
  );
}
`;
}

function generateHeroGradientOrbs(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const buttonImport = library === 'shadcn' ? 'import { Button } from "@/components/ui/button";' : '';
  return `${getLucideImport(['Sparkles', 'ArrowRight'])}
${buttonImport}

export function HeroGradientOrbs() {
  return (
    <section className="relative overflow-hidden ${getSpacingClasses(tuners.density, 'section')} bg-background">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-accent/20 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase text-primary mb-12 tracking-widest">
            <Sparkles className="w-3 h-3" />
            Synthesized Design Preview
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.85]">
            ${content?.headline || placeholders.heading(1)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
            ${content?.subheadline || placeholders.paragraph('medium')}
          </p>
          <Button size="lg" className="h-16 px-12 text-lg rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            ${content?.cta_primary || 'Start Synthesis'}
          </Button>
      </div>
    </section>
  );
}
`;
}

function generateHeroBespoke(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const pattern = getHarvestedPattern(profile);
  const patternBg = pattern ? `<div className="absolute inset-0 opacity-10 -z-10 pointer-events-none">${injectSVG(pattern, "w-full h-full object-cover")}</div>` : '';
  const logo = getHarvestedLogo(profile);
  const logoHero = logo ? `<div className="mb-10 w-fit scale-150 text-primary">${injectSVG(logo, "h-12 w-auto")}</div>` : '';

  const headingFont = profile?.typography.headingFont[0] || 'inherit';
  const motionStyles = profile?.motionCSS ? `<style>{\`${profile.motionCSS}\`}</style>` : '';

  return `${getLucideImport(['Dna', 'Webhook', 'Zap', 'ArrowRight'])}
${library === 'shadcn' ? 'import { Button } from "@/components/ui/button";' : ''}

export function HeroBespoke() {
  return (
    <section className="relative overflow-hidden ${getSpacingClasses(tuners.density, 'section')} min-h-[85vh] flex items-center bg-background text-foreground">
      ${motionStyles}
      ${patternBg}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        <div className="lg:col-span-7">
            ${logoHero}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase text-primary mb-10 tracking-[0.2em] animate-in fade-in slide-in-from-left-4 duration-1000">
                <Dna className="w-3 h-3" />
                Structural DNA Synthesis Active
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] text-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ fontFamily: '${headingFont}' }}>
                ${content?.headline || 'Truly Unique Architecture.'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-12 animate-in fade-in duration-1000 delay-300 font-light">
                ${content?.subheadline || 'This UI was not generated from a template. It is a live synthesis of structural fragments harvested from elite sources.'}
            </p>
            <div className="flex flex-wrap gap-6 items-center animate-in fade-in zoom-in-95 duration-1000 delay-500">
                <Button size="lg" className="h-14 px-10 text-lg rounded-2xl shadow-2xl bg-primary text-primary-foreground hover:scale-105 transition-all font-bold">
                    Generate Yours
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex -space-x-3 items-center">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="w-11 h-11 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-xl">
                            <Webhook className="w-5 h-5 text-primary/50" />
                         </div>
                     ))}
                     <span className="ml-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Mixed Design Origin</span>
                </div>
            </div>
        </div>
        <div className="lg:col-span-5 relative mt-12 lg:mt-0">
             <div className="aspect-square rounded-[4rem] bg-gradient-to-br from-primary/30 via-secondary/10 to-transparent border border-border/50 p-1 backdrop-blur-3xl shadow-3xl group">
                <div className="w-full h-full rounded-[3.8rem] bg-background/50 border border-border p-10 flex flex-col justify-between overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Zap className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div className="text-[8px] font-black text-primary/40 uppercase tracking-[0.3em]">Ready for Production</div>
                    </div>
                    <div className="space-y-6">
                        <div className="w-full h-4 bg-muted/30 rounded-full animate-in slide-in-from-right duration-1000 shadow-inner" />
                        <div className="w-3/4 h-4 bg-muted/30 rounded-full animate-in slide-in-from-right duration-700 delay-200" />
                        <div className="w-full h-32 bg-primary/5 border border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-2 group-hover:bg-primary/10 transition-colors backdrop-blur-sm">
                             <div className="w-16 h-1 bg-primary/20 rounded-full animate-bounce" />
                             <div className="w-24 h-1 bg-primary/20 rounded-full animate-bounce delay-100" />
                             <div className="w-12 h-1 bg-primary/20 rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                </div>
             </div>
             {/* Dynamic Blur Accents */}
             <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
             <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/30 blur-[100px] rounded-full animate-pulse delay-700" />
        </div>
      </div>
    </section>
  );
}
`;
}

// =============================================================================
// NAVIGATION TEMPLATES
// =============================================================================

export function generateNavigationTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  let { variant, tuners, componentLibrary, content } = input;

  const isMixed = profile && (profile.name.includes('Mixed') || profile.name.includes('Mix') || profile.name.includes('DNA'));
  if (isMixed) variant = 'bespoke';

  const componentName = generateComponentName('navigation', variant);

  const customLogo = getHarvestedLogo(profile);
  const logoContent = customLogo ? injectSVG(customLogo, "w-6 h-6 text-primary") : `<span className="font-bold inline-block text-primary">Taste Engine</span>`;

  let code: string;
  if (variant === 'bespoke') {
    code = generateNavigationBespoke(tuners, profile, componentLibrary, content);
  } else {
    code = `
import { Github, Twitter ${customLogo ? '' : ', Sparkles'} } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ${componentName}() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a className="flex items-center space-x-2" href="/">
            ${logoContent}
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
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
`;
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: ['lucide-react', '@/components/ui/button'],
    slots: {},
    variantUsed: variant,
    explanation: `Header navigation bar with ${variant} style.`,
  };
}

function generateNavigationBespoke(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const logo = getHarvestedLogo(profile);
  const logoNav = logo ? injectSVG(logo, "h-8 w-auto") : `<span className="font-black tracking-tighter text-xl text-primary uppercase">TASTE</span>`;
  const motionStyles = profile?.motionCSS ? `<style>{\`${profile.motionCSS}\`}</style>` : '';

  return `
import { Search, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavigationBespoke() {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-[100]">
        ${motionStyles}
        <div className="bg-background/40 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] px-10 py-5 flex items-center justify-between shadow-2xl transition-all hover:bg-background/60">
            <div className="flex items-center gap-16">
                <a href="/" className="text-foreground transition-transform hover:scale-105 flex items-center gap-2">
                    ${logoNav}
                </a>
                <div className="hidden lg:flex items-center gap-12">
                    {['Engine', 'Synthesis', 'Artifacts', 'Deploy'].map(item => (
                        <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all relative group">
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
                        </a>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-full border border-border">
                    <Search className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Find DNA</span>
                </div>
                <div className="h-6 w-[1px] bg-border mx-2" />
                <Button className="rounded-full px-10 bg-foreground text-background font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                    Sign In
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
                    <LayoutGrid className="w-5 h-5" />
                </Button>
            </div>
        </div>
    </nav>
  );
}
`;
}

// =============================================================================
// FEATURES TEMPLATES
// =============================================================================

export function generateFeaturesTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  const { variant, tuners, componentLibrary, content } = input;
  const componentName = generateComponentName('features', variant);

  const code = generateFeaturesGrid(tuners, profile, componentLibrary, content);

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: ['lucide-react'],
    slots: {},
    variantUsed: variant,
    explanation: `Features section for ${variant} layout.`,
  };
}

function generateFeaturesGrid(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  return `${getLucideImport(['Zap', 'Shield', 'Clock', 'Star'])}
  
  export function FeaturesGrid() {
    return (
      <section className="${getSpacingClasses(tuners.density, 'section')} bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
              ${content?.headline || 'Engineered for Performance.'}
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              ${content?.subheadline || 'Taste Engine utilizes advanced DNA harvesting to ensure your product feels elite.'}
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-12">
            {[
                { title: 'DNA Harvester', desc: 'Deeply extract tokens and motions from any site.' },
                { title: 'Context Aware', desc: 'Automatically adapt to your specific target audience.' },
                { title: 'Pure TS Output', desc: 'No templates. Only industrial-grade functional code.' }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-background border border-border/50 hover:border-primary/50 transition-all group scale-100 hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  `;
}

// Pricing, LogoCloud, etc.
export function generateLogoCloudTemplate(input: BlockGenerationInput): BlockGenerationOutput {
  return {
    code: `export function LogoCloud() { return <div className="py-20 flex justify-center gap-20 opacity-30 grayscale"><div className="font-bold">MICROSOFT</div><div className="font-bold">VERCEL</div><div className="font-bold">STRIPE</div></div>; }`,
    componentName: 'LogoCloud',
    fileName: 'logo-cloud.tsx',
    dependencies: [],
    slots: {},
    variantUsed: 'simple',
    explanation: 'Simple logo cloud.'
  }
}

export function generatePricingTemplate(input: BlockGenerationInput): BlockGenerationOutput {
  return {
    code: `export function Pricing() { return <section className="py-24 text-center"><h2 className="text-5xl font-black mb-10">Simple Pricing.</h2><div className="max-w-xl mx-auto p-12 rounded-[3rem] bg-primary text-primary-foreground shadow-2xl"><div className="text-4xl font-black mb-4">$49/mo</div><p className="mb-8">Full access to the Mixing Console.</p><button className="w-full py-4 bg-background text-foreground rounded-2xl font-bold">Get Pro</button></div></section>; }`,
    componentName: 'Pricing',
    fileName: 'pricing.tsx',
    dependencies: [],
    slots: {},
    variantUsed: 'simple',
    explanation: 'Simple pricing tier.'
  }
}

function generateHeroMinimal(tuners: any, profile: any, lib: any, content: any): string { return ''; }
function generateHeroBento(tuners: any, profile: any, lib: any, content: any): string { return ''; }
function generateHeroVideoBg(tuners: any, profile: any, lib: any, content: any): string { return ''; }
