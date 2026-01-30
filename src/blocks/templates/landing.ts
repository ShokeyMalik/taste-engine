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
  getHarvestedImage,
  getFallbackImage,
  getLayoutSection,
  getGridColumns,
  injectSVG,
  indent,
  // Profile-driven helpers
  getHarvestedAsset,
  getHarvestedAssets,
  getProfileCSSVariables,
  getTypographyStyles,
  getHeadingStyle,
  getProfileMotionClasses,
  getProfileSpacing,
  getProfileBorderRadius,
  getProfileShadow,
  getProfileStyleTag,
  getGradientStyle,
  getProfileCardClasses,
  getProfileButtonClasses,
  // Elite design pattern helpers
  getGlassMorphismClasses,
  getGradientBorderClasses,
  generateFloatingOrbsJSX,
  getGradientTextClasses,
  getOrganicContainerClasses,
  getEliteCardClasses,
  getSectionBackgroundJSX,
  getHeroBackgroundImageJSX,
  getDecorativeSVGJSX,
  getEntranceAnimationClasses,
  getIconComponent,
  getEliteSectionClasses,
  getGradientAnimationCSS,
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
  if (archetype && variant !== 'synthesized') variant = archetype;

  // Synthesis Mode: Bespoke for Mixed DNA
  const isMixed = profile && (profile.name.includes('Mixed') || profile.name.includes('Mix') || profile.name.includes('DNA'));
  if (isMixed) variant = 'bespoke';

  const componentName = generateComponentName('hero', variant);

  let code: string;
  let dependencies: string[] = ['lucide-react'];

  switch (variant) {
    case 'synthesized':
      code = generateHeroSynthesized(tuners, profile, componentLibrary, content);
      break;
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
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const pattern = getHarvestedPattern(profile);
  const patternBg = pattern ? `<div className="absolute inset-0 opacity-5 pointer-events-none">${injectSVG(pattern, "w-full h-full object-cover")}</div>` : '';
  const buttonClasses = getProfileButtonClasses(profile, 'primary');
  const sectionSpacing = getProfileSpacing(profile, 'section');

  // Elite design patterns
  const floatingOrbs = generateFloatingOrbsJSX(profile);
  const sectionBackground = getSectionBackgroundJSX(profile, 'hero');
  const heroBackgroundImage = getHeroBackgroundImageJSX(profile);
  const entranceClasses = getEntranceAnimationClasses(profile);
  const gradientTextClasses = getGradientTextClasses(profile);
  const organicClasses = getOrganicContainerClasses(profile);
  const gradientAnimationCSS = getGradientAnimationCSS();

  // Check for glass morphism to add badge
  const usesGlass = profile?.containerStyles?.glassMorphism;
  const badgeClasses = usesGlass
    ? 'bg-white/10 backdrop-blur-xl border border-white/20'
    : 'border border-primary/20 bg-primary/5';

  return `${getLucideImport(['ArrowRight', 'Sparkles'])}
${buttonImport}

export function HeroCentered() {
  return (
    <section className="${sectionSpacing} bg-background relative overflow-hidden min-h-[90vh] flex items-center">
      ${styleTag}
      <style dangerouslySetInnerHTML={{ __html: \`${gradientAnimationCSS}\` }} />

      ${heroBackgroundImage}
      ${patternBg}
      ${sectionBackground}
      ${floatingOrbs}

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full ${badgeClasses} text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8 ${entranceClasses}">
            <Sparkles className="w-3 h-3" />
            <span>Design DNA Synthesis</span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 ${gradientTextClasses} ${entranceClasses}"
            style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
          >
            ${content?.headline || placeholders.heading(1)}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light ${entranceClasses}" style={{ fontFamily: '${typo.bodyFont}', animationDelay: '0.2s' }}>
            ${content?.subheadline || placeholders.paragraph('medium')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 ${entranceClasses}" style={{ animationDelay: '0.4s' }}>
             <Button size="lg" className="${buttonClasses} h-14 px-10 text-lg ${organicClasses} shadow-2xl shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all">
               ${content?.cta_primary || 'Get Started'}
               <ArrowRight className="ml-2 h-5 w-5" />
             </Button>
             <Button size="lg" variant="outline" className="h-14 px-10 text-lg ${organicClasses} backdrop-blur-sm">
               ${content?.cta_secondary || 'Learn More'}
             </Button>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex items-center justify-center gap-6 ${entranceClasses}" style={{ animationDelay: '0.6s' }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary/60">{i}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">500+</span> teams shipping with Taste Engine
            </p>
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
  const motionStyles = profile?.motionCSS ? `<style dangerouslySetInnerHTML={{ __html: \`${escapeTemplate(profile.motionCSS)}\` }} />` : '';

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

function generateHeroSynthesized(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const buttonImport = library === 'shadcn' ? 'import { Button } from "@/components/ui/button";' : '';
  const pattern = getHarvestedPattern(profile);
  const logo = getHarvestedLogo(profile);
  const image = getHarvestedImage(profile) || getFallbackImage(content?.image_query || 'product UI');
  const motionStyle = profile?.motionCSS
    ? `<style dangerouslySetInnerHTML={{ __html: \`${escapeTemplate(profile.motionCSS)}\` }} />`
    : '';
  const heroSection = getLayoutSection(profile, 'hero');
  const heroArchetype = heroSection?.layout || profile?.archetypes?.hero || 'centered';
  const logoMark = logo ? injectSVG(logo, 'h-10 w-10 text-primary') : '<span className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Taste</span>';

  if (heroArchetype === 'bento') {
    return `${getLucideImport(['Sparkles', 'ArrowRight'])}
${buttonImport}

export function HeroSynthesized() {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-background relative overflow-hidden">
      ${motionStyle}
      ${pattern ? `<div className="absolute inset-0 opacity-10">${injectSVG(pattern, 'w-full h-full')}</div>` : ''}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
        <div className="space-y-8 ${getMotionClasses(tuners.motion)}">
          <div className="flex items-center gap-3">
            ${logoMark}
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Synthesized UI</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
            ${content?.headline || placeholders.heading(1)}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            ${content?.subheadline || placeholders.paragraph('medium')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground">${content?.cta_primary || 'Get Started'}</Button>
            <Button size="lg" variant="outline">${content?.cta_secondary || 'See the demo'}</Button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-primary/10 p-6 border border-primary/20 backdrop-blur">
              <Sparkles className="h-6 w-6 text-primary mb-4" />
              <p className="text-sm font-semibold text-foreground">Archetype-aware layout</p>
              <p className="text-xs text-muted-foreground">Derived from inspiration structure.</p>
            </div>
            <div className="rounded-3xl bg-muted/40 p-6 border border-border">
              <p className="text-3xl font-black text-foreground">98%</p>
              <p className="text-xs text-muted-foreground">Component fidelity</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background/60 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live DNA</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-6 h-24 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
`;
  }

  if (heroArchetype === 'split' || heroSection?.layout === 'split') {
    return `${getLucideImport(['ArrowRight', 'CheckCircle'])}
${buttonImport}

export function HeroSynthesized() {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-background">
      ${motionStyle}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 ${getMotionClasses(tuners.motion)}">
          <div className="flex items-center gap-3">
            ${logoMark}
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Synthesized UI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
            ${content?.headline || placeholders.heading(1)}
          </h1>
          <p className="text-lg text-muted-foreground">
            ${content?.subheadline || placeholders.paragraph('medium')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">${content?.cta_primary || 'Get Started'}</Button>
            <Button size="lg" variant="outline">${content?.cta_secondary || 'Book a demo'}</Button>
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-xl">
          <img src="${image}" alt="${content?.image_alt || 'Product preview'}" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
`;
  }

  return generateHeroCentered(tuners, profile, library, content);
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
  if (variant === 'synthesized') {
    code = generateNavigationSynthesized(tuners, profile, componentLibrary, content);
  } else if (variant === 'bespoke') {
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

function generateNavigationSynthesized(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const headerType = profile?.archetypes?.header || 'sticky';
  const logo = getHarvestedLogo(profile);
  const logoNav = logo ? injectSVG(logo, 'h-7 w-auto text-primary') : '<span className="font-black tracking-tight text-lg text-primary">Taste</span>';
  const motionStyles = profile?.motionCSS ? `<style dangerouslySetInnerHTML={{ __html: \`${escapeTemplate(profile.motionCSS)}\` }} />` : '';
  const positionClass = headerType === 'floating'
    ? 'fixed top-6 left-1/2 -translate-x-1/2 max-w-6xl'
    : headerType === 'sticky'
    ? 'sticky top-0'
    : 'relative';

  return `
import { Button } from "@/components/ui/button";

export function NavigationSynthesized() {
  return (
    <nav className="${positionClass} z-50 w-full">
      ${motionStyles}
      <div className="mx-auto flex items-center justify-between bg-background/80 backdrop-blur border border-border/60 rounded-2xl px-6 py-3 shadow-lg">
        <a href="/" className="flex items-center gap-2">
          ${logoNav}
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground hidden sm:inline">Inspired</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {(content?.links || ['Product', 'Solutions', 'Pricing', 'Docs']).map((item: string) => (
            <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {item}
            </a>
          ))}
        </div>
        <Button className="bg-primary text-primary-foreground">${content?.cta_primary || 'Launch'}</Button>
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

  let code = generateFeaturesGrid(tuners, profile, componentLibrary, content);
  if (variant === 'synthesized') {
    code = generateFeaturesSynthesized(tuners, profile, componentLibrary, content);
  }

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

function generateFeaturesSynthesized(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const icons = profile?.assets?.icons?.slice(0, 4) || [];
  const iconSvgs = icons.map((svg) => injectSVG(svg, 'h-5 w-5 text-primary')).join('');
  const iconMarkup = iconSvgs || '<span className="h-5 w-5 text-primary">★</span>';
  const featuresSection = getLayoutSection(profile, 'features');
  const items = content?.features || [
    { title: 'Structural DNA', desc: placeholders.paragraph('short') },
    { title: 'Motion Fidelity', desc: placeholders.paragraph('short') },
    { title: 'Asset Harvest', desc: placeholders.paragraph('short') },
    { title: 'Responsive by default', desc: placeholders.paragraph('short') },
  ];
  const featureImage = getHarvestedImage(profile) || getFallbackImage(content?.image_query || 'abstract UI');

  if (featuresSection?.layout === 'bento') {
    const cols = getGridColumns(featuresSection.columns || 3);
    return `
export function FeaturesSynthesized() {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid ${cols} gap-4">
          {${JSON.stringify(items)}.map((item, index) => (
            <div key={item.title} className="rounded-3xl border border-border/60 bg-card/60 p-6 ${getMotionClasses(tuners.motion)}">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">${iconMarkup}</span>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc || item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
  }

  if (featuresSection?.layout === 'split') {
    return `
export function FeaturesSynthesized() {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-background">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Synthesized</p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            ${content?.heading || placeholders.heading(2)}
          </h2>
          <p className="text-muted-foreground">${content?.subheading || placeholders.paragraph('medium')}</p>
        </div>
        <div className="space-y-4">
          {${JSON.stringify(items)}.map((item, index) => (
            <div key={item.title} className="rounded-2xl border border-border/60 p-5 bg-card/60 ${getMotionClasses(tuners.motion)}">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">${iconMarkup}</span>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc || item.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl overflow-hidden border border-border/60 shadow-lg">
          <img src="${featureImage}" alt="${content?.image_alt || 'Feature preview'}" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
`;
  }

  return `
export function FeaturesSynthesized() {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Synthesized</p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              ${content?.heading || placeholders.heading(2)}
            </h2>
            <p className="text-muted-foreground">${content?.subheading || placeholders.paragraph('medium')}</p>
          </div>
          <div className="grid gap-4">
            {${JSON.stringify(items)}.map((item, index) => (
              <div key={item.title} className="${getMotionClasses(tuners.motion)} border border-border/60 rounded-2xl p-5 bg-card/60">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">${iconMarkup}</span>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc || item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function generateFeaturesGrid(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');
  const borderRadius = getProfileBorderRadius(profile);

  // Elite design patterns
  const eliteCardClasses = getEliteCardClasses(profile);
  const entranceClasses = getEntranceAnimationClasses(profile);
  const floatingOrbs = generateFloatingOrbsJSX(profile);
  const gradientBorderClasses = getGradientBorderClasses(profile);
  const organicClasses = getOrganicContainerClasses(profile);
  const glassMorphismClasses = getGlassMorphismClasses(profile);

  // Get harvested icons and decorative SVGs
  const icons = getHarvestedAssets(profile, 'icons', 3);
  const decorativeSvgs = profile?.visualAssets?.decorativeSvgs || [];

  const features = content?.features || [
    { title: 'DNA Harvester', desc: 'Deeply extract tokens, motions, and structural patterns from any elite site.' },
    { title: 'Context Aware', desc: 'Automatically adapt layouts and components to your specific target audience.' },
    { title: 'Pure TS Output', desc: 'No templates. Only industrial-grade functional TypeScript code.' }
  ];

  return `${getLucideImport(['Zap', 'Shield', 'Sparkles', 'ArrowUpRight'])}

export function FeaturesGrid() {
  ${icons.length > 0 ? `const icons = [${icons.map(svg => `() => <span dangerouslySetInnerHTML={{ __html: \`${svg.replace(/`/g, '\\`').replace(/<svg/g, '<svg className="w-8 h-8"')}\` }} />`).join(', ')}];` : ''}
  const fallbackIcons = [Zap, Shield, Sparkles];

  return (
    <section className="${sectionSpacing} bg-background relative overflow-hidden">
      ${styleTag}

      {/* Background treatments */}
      ${floatingOrbs}
      ${decorativeSvgs.length > 0 ? `<div className="absolute inset-0 opacity-5 pointer-events-none" dangerouslySetInnerHTML={{ __html: \`${decorativeSvgs[0]?.replace(/`/g, '\\`') || ''}\` }} />` : ''}

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20 ${entranceClasses}">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
            <Sparkles className="w-3 h-3" />
            Features
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6"
            style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
          >
            ${content?.headline || 'Engineered for Performance.'}
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed" style={{ fontFamily: '${typo.bodyFont}' }}>
            ${content?.subheadline || 'Taste Engine utilizes advanced DNA harvesting to ensure your product feels elite.'}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {${JSON.stringify(features)}.map((f, i) => {
            const IconComponent = fallbackIcons[i % fallbackIcons.length];
            return (
              <div
                key={i}
                className="group relative ${eliteCardClasses} ${organicClasses} p-10 hover:border-primary/30 ${entranceClasses}"
                style={{ animationDelay: \`\${i * 0.1}s\` }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 ${organicClasses} bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Icon container with glow */}
                <div className="relative w-16 h-16 ${borderRadius} bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                  ${icons.length > 0 ? '{icons[i % icons.length]?.() || <IconComponent className="w-8 h-8" />}' : '<IconComponent className="w-8 h-8" />'}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-light mb-6">
                  {f.desc}
                </p>

                {/* Learn more link */}
                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all">
                  Learn more
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;
}

// Pricing, LogoCloud, etc.
export function generateLogoCloudTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  const styleTag = getProfileStyleTag(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');
  const motionClasses = getProfileMotionClasses(profile, 'card');

  // Get harvested logos from profile
  const logos = getHarvestedAssets(profile, 'logos', 6);

  let code: string;

  if (logos.length > 0) {
    // Use harvested logos
    code = `
export function LogoCloud() {
  const logos = [
    ${logos.map((svg, i) => `{ name: 'Brand ${i + 1}', svg: \`${svg.replace(/`/g, '\\`')}\` }`).join(',\n    ')}
  ];

  return (
    <section className="${sectionSpacing} bg-muted/30 border-y border-border/50">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading teams</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground ${motionClasses}"
              dangerouslySetInnerHTML={{ __html: logo.svg.replace('<svg', '<svg class="w-6 h-6"') }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
`;
  } else {
    // Fallback to text logos
    code = `
export function LogoCloud() {
  const companies = ['Linear', 'Vercel', 'Stripe', 'Notion', 'Figma', 'Raycast'];

  return (
    <section className="${sectionSpacing} bg-muted/30 border-y border-border/50">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading teams</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company) => (
            <div key={company} className="text-muted-foreground/60 hover:text-foreground ${motionClasses} font-bold tracking-tight">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
  }

  return {
    code,
    componentName: 'LogoCloud',
    fileName: 'logo-cloud.tsx',
    dependencies: [],
    slots: {},
    variantUsed: 'simple',
    explanation: 'Logo cloud with harvested or fallback branding.'
  };
}

export function generatePricingTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  const { variant, tuners, content } = input;
  const componentName = generateComponentName('pricing', variant || 'simple');
  let code = generatePricingSimple(tuners, content, profile);
  if (variant === 'synthesized') {
    code = generatePricingSynthesized(tuners, content, profile);
  }
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: [],
    slots: {},
    variantUsed: variant || 'simple',
    explanation: 'Pricing section.'
  }
}

function generatePricingSimple(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const cardClasses = getProfileCardClasses(profile);
  const buttonClasses = getProfileButtonClasses(profile, 'primary');
  const sectionSpacing = getProfileSpacing(profile, 'section');

  return `
export function PricingSimple() {
  return (
    <section className="${sectionSpacing} text-center bg-background relative">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-4xl md:text-5xl font-black mb-10 text-foreground"
          style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
        >
          ${content?.heading || 'Simple Pricing.'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(content?.plans || [
            { name: 'Starter', price: '$19', desc: 'For early teams' },
            { name: 'Pro', price: '$49', desc: 'For growing teams' },
            { name: 'Enterprise', price: 'Let\\'s talk', desc: 'For large orgs' },
          ]).map((plan: any) => (
            <div key={plan.name} className="${cardClasses} p-8">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{plan.name}</div>
              <div className="text-3xl font-black text-foreground mb-2">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: '${typo.bodyFont}' }}>{plan.desc}</p>
              <button className="${buttonClasses} w-full">
                {plan.cta || 'Choose plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function generatePricingSynthesized(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const cardClasses = getProfileCardClasses(profile);
  const buttonClasses = getProfileButtonClasses(profile, 'primary');
  const sectionSpacing = getProfileSpacing(profile, 'section');

  return `
export function PricingSynthesized() {
  return (
    <section className="${sectionSpacing} bg-background relative">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Synthesized</p>
            <h2
              className="text-4xl font-black text-foreground"
              style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
            >
              ${content?.heading || 'Plans that scale with you'}
            </h2>
            <p className="text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>${content?.subheading || placeholders.paragraph('short')}</p>
          </div>
          <button className="${buttonClasses}">Start free trial</button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(content?.plans || [
            { name: 'Core', price: '$29', desc: 'Foundations for teams' },
            { name: 'Growth', price: '$79', desc: 'Scale without limits' },
            { name: 'Enterprise', price: 'Custom', desc: 'Security + compliance' },
          ]).map((plan: any) => (
            <div key={plan.name} className="${cardClasses} p-8">
              <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
              <div className="text-4xl font-black text-foreground mb-3">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: '${typo.bodyFont}' }}>{plan.desc}</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                {(plan.features || ['Unlimited projects', 'Design synthesis', 'Governance guardrails']).map((f: string) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button className="${buttonClasses} w-full">Choose {plan.name}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

export function generateTestimonialsTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  const { variant, tuners, content } = input;
  const componentName = generateComponentName('testimonials', variant || 'grid');
  let code = generateTestimonialsGrid(tuners, content, profile);
  if (variant === 'synthesized') {
    code = generateTestimonialsSynthesized(tuners, content, profile);
  }
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: [],
    slots: {},
    variantUsed: variant || 'grid',
    explanation: 'Testimonials section.',
  };
}

function generateTestimonialsGrid(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const items = content?.testimonials || [
    { quote: 'Taste Engine delivered a UI that felt handcrafted.', author: 'Lia Park', role: 'Product Lead' },
    { quote: 'Our conversion rate jumped after the redesign.', author: 'Marco Reyes', role: 'Growth' },
    { quote: 'The motion details are unreal.', author: 'Samir Q', role: 'Design' },
  ];
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const cardClasses = getProfileCardClasses(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');

  // Get harvested images for avatars
  const avatarImages = getHarvestedAssets(profile, 'images', 3);

  return `
export function TestimonialsGrid() {
  ${avatarImages.length > 0 ? `const avatars = ${JSON.stringify(avatarImages)};` : ''}

  return (
    <section className="${sectionSpacing} bg-muted/30 relative">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-black text-foreground"
            style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
          >
            ${content?.heading || 'Loved by teams'}
          </h2>
          <p className="text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>${content?.subheading || placeholders.paragraph('short')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {${JSON.stringify(items)}.map((t, i) => (
            <div key={i} className="${cardClasses} p-6">
              <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: '${typo.bodyFont}' }}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                ${avatarImages.length > 0 ? `<img src={avatars[i % avatars.length]} alt={t.author} className="w-10 h-10 rounded-full object-cover" />` : '<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{t.author.charAt(0)}</div>'}
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function generateTestimonialsSynthesized(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const items = content?.testimonials || [
    { quote: 'Every section felt bespoke and intentional.', author: 'Avery Lin', role: 'Founder' },
    { quote: 'Governed changes without slowing us down.', author: 'Rhea Patel', role: 'VP Eng' },
  ];
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const cardClasses = getProfileCardClasses(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');

  return `
export function TestimonialsSynthesized() {
  return (
    <section className="${sectionSpacing} bg-background relative">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_1.2fr] gap-10 items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Social Proof</p>
          <h2
            className="text-4xl font-black text-foreground"
            style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
          >
            ${content?.heading || 'Trusted by teams shipping faster'}
          </h2>
          <p className="text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>${content?.subheading || placeholders.paragraph('short')}</p>
        </div>
        <div className="space-y-4">
          {${JSON.stringify(items)}.map((t, i) => (
            <div key={i} className="${cardClasses} p-6">
              <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: '${typo.bodyFont}' }}>"{t.quote}"</p>
              <div className="text-sm font-semibold text-foreground">{t.author}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

export function generateStatsTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  const { variant, tuners, content } = input;
  const componentName = generateComponentName('stats', variant || 'simple');
  let code = generateStatsSimple(tuners, content, profile);
  if (variant === 'synthesized') {
    code = generateStatsSynthesized(tuners, content, profile);
  }
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: [],
    slots: {},
    variantUsed: variant || 'simple',
    explanation: 'Stats section.',
  };
}

function generateStatsSimple(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const stats = content?.stats || [
    { value: '99.9%', label: 'Uptime' },
    { value: '3x', label: 'Faster iteration' },
    { value: '50+', label: 'Design signals' },
  ];
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');

  return `
export function StatsSimple() {
  return (
    <section className="${sectionSpacing} bg-background relative">
      ${styleTag}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
        {${JSON.stringify(stats)}.map((s, i) => (
          <div key={i}>
            <div
              className="text-4xl font-black text-foreground"
              style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight} }}
            >
              {s.value}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function generateStatsSynthesized(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const stats = content?.stats || [
    { value: '120k', label: 'Monthly sessions' },
    { value: '18%', label: 'Conversion lift' },
    { value: '7 days', label: 'Time to deploy' },
  ];
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const cardClasses = getProfileCardClasses(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');

  return `
export function StatsSynthesized() {
  return (
    <section className="${sectionSpacing} bg-muted/30 relative">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        {${JSON.stringify(stats)}.map((s, i) => (
          <div key={i} className="${cardClasses} p-6">
            <div
              className="text-3xl font-black text-foreground"
              style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight} }}
            >
              {s.value}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2" style={{ fontFamily: '${typo.bodyFont}' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

export function generateCtaTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  const { variant, tuners, content } = input;
  const componentName = generateComponentName('cta', variant || 'simple');
  let code = generateCtaSimple(tuners, content, profile);
  if (variant === 'synthesized') {
    code = generateCtaSynthesized(tuners, content, profile);
  }
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: [],
    slots: {},
    variantUsed: variant || 'simple',
    explanation: 'CTA section.',
  };
}

function generateCtaSimple(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const primaryButtonClasses = getProfileButtonClasses(profile, 'primary');
  const secondaryButtonClasses = getProfileButtonClasses(profile, 'secondary');
  const sectionSpacing = getProfileSpacing(profile, 'section');
  const pattern = getHarvestedPattern(profile);
  const patternBg = pattern ? `<div className="absolute inset-0 opacity-5 pointer-events-none">${injectSVG(pattern, "w-full h-full object-cover")}</div>` : '';
  const gradientStyle = getGradientStyle(profile);

  return `
export function CtaSimple() {
  return (
    <section className="${sectionSpacing} bg-background relative overflow-hidden">
      ${styleTag}
      ${patternBg}
      {/* Gradient accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${gradientStyle.includes('style=') ? '' : gradientStyle} blur-[120px] rounded-full opacity-30" ${gradientStyle.includes('style=') ? gradientStyle : ''} />

      <div className="max-w-4xl mx-auto px-6 text-center space-y-4 relative z-10">
        <h2
          className="text-4xl font-black text-foreground"
          style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
        >
          ${content?.heading || 'Ready to ship a better UI?'}
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>${content?.subheading || placeholders.paragraph('short')}</p>
        <div className="flex justify-center gap-4 pt-4">
          <button className="${primaryButtonClasses}">${content?.cta_primary || 'Get started'}</button>
          <button className="${secondaryButtonClasses}">${content?.cta_secondary || 'Talk to sales'}</button>
        </div>
      </div>
    </section>
  );
}
`;
}

function generateCtaSynthesized(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const cardClasses = getProfileCardClasses(profile);
  const primaryButtonClasses = getProfileButtonClasses(profile, 'primary');
  const secondaryButtonClasses = getProfileButtonClasses(profile, 'secondary');
  const sectionSpacing = getProfileSpacing(profile, 'section');
  const gradientStyle = getGradientStyle(profile);

  return `
export function CtaSynthesized() {
  return (
    <section className="${sectionSpacing} bg-background relative overflow-hidden">
      ${styleTag}
      {/* Gradient accent */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] ${gradientStyle.includes('style=') ? '' : gradientStyle} blur-[100px] rounded-full opacity-20" ${gradientStyle.includes('style=') ? gradientStyle : ''} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="${cardClasses} grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-center p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Conversion</p>
            <h2
              className="text-4xl font-black text-foreground"
              style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}
            >
              ${content?.heading || 'Launch your inspired UI today'}
            </h2>
            <p className="text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>${content?.subheading || placeholders.paragraph('short')}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button className="${primaryButtonClasses}">${content?.cta_primary || 'Start free trial'}</button>
            <button className="${secondaryButtonClasses}">${content?.cta_secondary || 'View docs'}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

export function generateFooterTemplate(input: BlockGenerationInput, profile?: InspirationProfile): BlockGenerationOutput {
  const { variant, tuners, content } = input;
  const componentName = generateComponentName('footer', variant || 'simple');
  let code = generateFooterSimple(tuners, content, profile);
  if (variant === 'synthesized') {
    code = generateFooterSynthesized(tuners, content, profile);
  }
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: [],
    slots: {},
    variantUsed: variant || 'simple',
    explanation: 'Footer section.',
  };
}

function generateFooterSimple(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');
  const logo = getHarvestedLogo(profile);
  const logoMark = logo ? injectSVG(logo, 'h-6 w-auto text-primary') : '<span className="font-bold text-primary">Taste Engine</span>';

  return `
export function FooterSimple() {
  return (
    <footer className="${sectionSpacing} border-t border-border/60 bg-background">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          ${logoMark}
          <span className="text-sm text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>${content?.copyright || '© 2026 Taste Engine.'}</span>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          {(content?.links || ['Privacy', 'Terms', 'Security']).map((l: string) => (
            <a key={l} href="#" className="hover:text-foreground transition-colors" style={{ fontFamily: '${typo.bodyFont}' }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
`;
}

function generateFooterSynthesized(tuners: AppliedTuners, content?: any, profile?: InspirationProfile): string {
  const styleTag = getProfileStyleTag(profile);
  const typo = getTypographyStyles(profile);
  const sectionSpacing = getProfileSpacing(profile, 'section');
  const logo = getHarvestedLogo(profile);
  const logoMark = logo ? injectSVG(logo, 'h-8 w-auto text-primary') : '<span className="text-lg font-black text-foreground">Taste Engine</span>';

  return `
export function FooterSynthesized() {
  return (
    <footer className="${sectionSpacing} border-t border-border/60 bg-background">
      ${styleTag}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6">
        <div className="space-y-3">
          ${logoMark}
          <p className="text-sm text-muted-foreground" style={{ fontFamily: '${typo.bodyFont}' }}>${content?.tagline || 'Governed UI synthesis for modern teams.'}</p>
        </div>
        {(content?.columns || [
          { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
          { title: 'Company', links: ['About', 'Careers', 'Contact'] },
          { title: 'Resources', links: ['Docs', 'API', 'Support'] },
        ]).map((col: any, i: number) => (
          <div key={i}>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{col.title}</div>
            <ul className="space-y-2 text-sm">
              {col.links.map((l: string) => (
                <li key={l}><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: '${typo.bodyFont}' }}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
`;
}

function escapeTemplate(input: string) {
  return input.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function generateHeroMinimal(tuners: any, profile: any, lib: any, content: any): string { return ''; }
function generateHeroBento(tuners: any, profile: any, lib: any, content: any): string { return ''; }
function generateHeroVideoBg(tuners: any, profile: any, lib: any, content: any): string { return ''; }
