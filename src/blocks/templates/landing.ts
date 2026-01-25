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
} from './base';

// =============================================================================
// HERO TEMPLATES
// =============================================================================

export function generateHeroTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, componentLibrary, content } = input;
  const componentName = generateComponentName('hero', variant);

  let code: string;
  let dependencies: string[] = ['lucide-react'];

  switch (variant) {
    case 'centered':
      code = generateHeroCentered(tuners, undefined, componentLibrary, content);
      break;
    case 'split':
      code = generateHeroSplit(tuners, undefined, componentLibrary, content);
      break;
    case 'gradient-orbs':
      code = generateHeroGradientOrbs(tuners, undefined, componentLibrary, content);
      break;
    case 'video-bg':
      code = generateHeroVideoBg(tuners, undefined, componentLibrary, content);
      break;
    case 'minimal':
      code = generateHeroMinimal(tuners, undefined, componentLibrary, content);
      break;
    default:
      code = generateHeroCentered(tuners, undefined, componentLibrary, content);
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
    explanation: `Hero section with ${variant} layout. Uses ${getSpacingClasses(tuners.density, 'section')} for vertical spacing.`,
  };
}

function generateHeroCentered(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';

  const animClass = getAnimationClasses(tuners);

  return `${getLucideImport(['ArrowRight', 'Play'])}
${buttonImport}

interface HeroCenteredProps {
  title?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function HeroCentered({
  title = "${placeholders.heading(1)}",
  description = "${placeholders.paragraph('medium')}",
  primaryCta = "${placeholders.button('primary')}",
  secondaryCta = "${placeholders.button('secondary')}",
  onPrimaryClick,
  onSecondaryClick,
}: HeroCenteredProps) {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} ${animClass}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            ${library === 'shadcn' ? `<Button size="lg" onClick={onPrimaryClick}>
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={onSecondaryClick}>
              {secondaryCta}
            </Button>` : `<button
              onClick={onPrimaryClick}
              className="inline-flex items-center justify-center px-6 py-3 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium ${getMotionClasses(tuners.motion)}"
            >
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={onSecondaryClick}
              className="inline-flex items-center justify-center px-6 py-3 ${getBorderRadiusClasses(profile)} border border-border text-foreground font-medium ${getMotionClasses(tuners.motion)}"
            >
              {secondaryCta}
            </button>`}
          </div>
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
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';

  return `${getLucideImport(['ArrowRight', 'CheckCircle'])}
${buttonImport}

interface HeroSplitProps {
  title?: string;
  description?: string;
  features?: string[];
  primaryCta?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function HeroSplit({
  title = "${placeholders.heading(1)}",
  description = "${placeholders.paragraph('long')}",
  features = ["Lightning fast performance", "Enterprise-grade security", "24/7 support"],
  primaryCta = "${placeholders.button('primary')}",
  imageSrc = "/placeholder.svg",
  imageAlt = "Product screenshot",
}: HeroSplitProps) {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {description}
            </p>
            <ul className="mt-8 space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              ${library === 'shadcn' ? `<Button size="lg">
                {primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>` : `<button className="inline-flex items-center justify-center px-6 py-3 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium ${getMotionClasses(tuners.motion)}">
                {primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>`}
            </div>
          </div>
          <div className="relative lg:ml-4">
            <div className="${getBorderRadiusClasses(profile)} overflow-hidden ${getShadowClasses(profile)}">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-auto"
              />
            </div>
          </div>
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
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';

  return `${getLucideImport(['ArrowRight', 'Sparkles'])}
${buttonImport}

interface HeroGradientOrbsProps {
  title?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export function HeroGradientOrbs({
  title = "${content?.headline || placeholders.heading(1)}",
  description = "${content?.subheadline || placeholders.paragraph('medium')}",
  primaryCta = "${content?.cta_primary || placeholders.button('primary')}",
  secondaryCta = "${content?.cta_secondary || placeholders.button('secondary')}",
}: HeroGradientOrbsProps) {
  return (
    <section className="relative ${getSpacingClasses(tuners.density, 'section')} overflow-hidden">
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
            ${library === 'shadcn' ? `<Button size="lg">
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg">
              {secondaryCta}
            </Button>` : `<button className="inline-flex items-center justify-center px-6 py-3 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium ${getMotionClasses(tuners.motion)}">
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3 ${getBorderRadiusClasses(profile)} text-foreground font-medium ${getMotionClasses(tuners.motion)} hover:bg-muted">
              {secondaryCta}
            </button>`}
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function generateHeroVideoBg(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';

  return `${getLucideImport(['ArrowRight', 'Play'])}
${buttonImport}

interface HeroVideoBgProps {
  title?: string;
  description?: string;
  primaryCta?: string;
  videoSrc?: string;
  posterSrc?: string;
}

export function HeroVideoBg({
  title = "${placeholders.heading(1)}",
  description = "${placeholders.paragraph('medium')}",
  primaryCta = "${placeholders.button('primary')}",
  videoSrc = "/hero-video.mp4",
  posterSrc = "/hero-poster.jpg",
}: HeroVideoBgProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${getSpacingClasses(tuners.density, 'section')}">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-10">
            ${library === 'shadcn' ? `<Button size="lg">
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>` : `<button className="inline-flex items-center justify-center px-6 py-3 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium ${getMotionClasses(tuners.motion)}">
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>`}
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function generateHeroMinimal(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';

  return `${getLucideImport(['ArrowRight'])}
${buttonImport}

interface HeroMinimalProps {
  title?: string;
  description?: string;
  primaryCta?: string;
}

export function HeroMinimal({
  title = "${placeholders.heading(1)}",
  description = "${placeholders.paragraph('short')}",
  primaryCta = "${placeholders.button('primary')}",
}: HeroMinimalProps) {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')}">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {description}
        </p>
        <div className="mt-8">
          ${library === 'shadcn' ? `<Button variant="link" className="px-0">
            {primaryCta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>` : `<a href="#" className="inline-flex items-center text-primary font-medium hover:underline">
            {primaryCta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>`}
        </div>
      </div>
    </section>
  );
}
`;
}

// =============================================================================
// FEATURES TEMPLATES
// =============================================================================

export function generateFeaturesTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, componentLibrary, content } = input;
  const componentName = generateComponentName('features', variant);

  let code: string;
  const dependencies: string[] = ['lucide-react'];

  switch (variant) {
    case 'grid':
      code = generateFeaturesGrid(tuners, undefined, componentLibrary, content);
      break;
    case 'alternating':
      code = generateFeaturesAlternating(tuners, undefined, componentLibrary, content);
      break;
    case 'cards':
      code = generateFeaturesCards(tuners, undefined, componentLibrary, content);
      if (componentLibrary === 'shadcn') dependencies.push('@/components/ui/card');
      break;
    case 'centered':
      code = generateFeaturesCentered(tuners, undefined, componentLibrary, content);
      break;
    default:
      code = generateFeaturesGrid(tuners, undefined, componentLibrary, content);
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies,
    slots: {},
    variantUsed: variant,
    explanation: `Features section with ${variant} layout.`,
  };
}

function generateFeaturesGrid(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  return `${getLucideImport(['Zap', 'Shield', 'Clock', 'Star', 'Check', 'ArrowRight'])}

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
  title = "${content?.headline || placeholders.heading(2)}",
  description = "${content?.subheadline || placeholders.paragraph('medium')}",
  features = ${content ? JSON.stringify([
    { icon: 'Zap', title: content.feature_1, description: content.feature_1_description },
    { icon: 'Shield', title: content.feature_2, description: content.feature_2_description },
    { icon: 'Clock', title: content.feature_3, description: content.feature_3_description },
    { icon: 'Star', title: "Highly Customizable", description: "Tailor every detail to your brand's unique needs." },
    { icon: 'Check', title: "Production Ready", description: "Battle-tested components ready for immediate deployment." },
    { icon: 'ArrowRight', title: "Scalable Architecture", description: "Designed to grow with your product complexity." }
  ], null, 2).replace(/"icon": "([^"]+)"/g, 'icon: <$1 className="h-6 w-6" />') : 'defaultFeatures'},
}: FeaturesGridProps) {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')} bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="${getGridClasses({ sm: 1, md: 2, lg: 3 }, getSpacingClasses(tuners.density, 'component'))} mt-16">
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
`;
}

function generateFeaturesAlternating(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  return `${getLucideImport(['CheckCircle'])}

interface FeatureSection {
  title: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
}

interface FeaturesAlternatingProps {
  features?: FeatureSection[];
}

const defaultFeatures: FeatureSection[] = [
  {
    title: "Powerful Analytics",
    description: "Get deep insights into your business with our comprehensive analytics dashboard.",
    bullets: ["Real-time data", "Custom reports", "Export options"],
    imageSrc: "/feature-1.svg",
    imageAlt: "Analytics dashboard",
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in collaboration tools.",
    bullets: ["Shared workspaces", "Real-time editing", "Comments & mentions"],
    imageSrc: "/feature-2.svg",
    imageAlt: "Team collaboration",
  },
];

export function FeaturesAlternating({
  features = defaultFeatures,
}: FeaturesAlternatingProps) {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {features.map((feature, i) => (
            <div
              key={i}
              className={\`grid lg:grid-cols-2 gap-12 items-center \${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}\`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {feature.title}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  {feature.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {feature.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <img
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  className="w-full h-auto ${getBorderRadiusClasses(profile)} ${getShadowClasses(profile)}"
                />
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

function generateFeaturesCards(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  const cardImport = library === 'shadcn'
    ? 'import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";'
    : '';

  return `${getLucideImport(['Zap', 'Shield', 'Clock', 'Star'])}
${cardImport}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesCardsProps {
  title?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  { icon: <Zap className="h-6 w-6" />, title: "Lightning Fast", description: "Built for speed with optimized performance." },
  { icon: <Shield className="h-6 w-6" />, title: "Secure", description: "Enterprise-grade security built in." },
  { icon: <Clock className="h-6 w-6" />, title: "Reliable", description: "99.9% uptime guarantee." },
  { icon: <Star className="h-6 w-6" />, title: "Top Rated", description: "Loved by thousands." },
];

export function FeaturesCards({
  title = "${placeholders.heading(2)}",
  features = defaultFeatures,
}: FeaturesCardsProps) {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-12">
          {title}
        </h2>

        <div className="${getGridClasses({ sm: 1, md: 2, lg: 4 }, getSpacingClasses(tuners.density, 'component'))}">
          {features.map((feature, i) => (
            ${library === 'shadcn' ? `<Card key={i} className="${getMotionClasses(tuners.motion)}">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>` : `<div key={i} className="${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card ${getMotionClasses(tuners.motion)}">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>`}
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function generateFeaturesCentered(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  content?: any
): string {
  return `${getLucideImport(['Zap', 'Shield', 'Clock'])}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesCenteredProps {
  title?: string;
  description?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  { icon: <Zap className="h-8 w-8" />, title: "Fast", description: "Optimized for speed." },
  { icon: <Shield className="h-8 w-8" />, title: "Secure", description: "Enterprise-grade security." },
  { icon: <Clock className="h-8 w-8" />, title: "Reliable", description: "99.9% uptime." },
];

export function FeaturesCentered({
  title = "${placeholders.heading(2)}",
  description = "${placeholders.paragraph('medium')}",
  features = defaultFeatures,
}: FeaturesCenteredProps) {
  return (
    <section className="${getSpacingClasses(tuners.density, 'section')}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-16">
          {features.map((feature, i) => (
            <div key={i} className="text-center max-w-xs">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
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
`;
}

// =============================================================================
// NAVIGATION TEMPLATES
// =============================================================================

export function generateNavigationTemplate(input: BlockGenerationInput): BlockGenerationOutput {
  const { variant, tuners, componentLibrary, content } = input;
  const componentName = generateComponentName('navigation', variant);
  const code = `
import { Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ${componentName}() {
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
`;
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: ['lucide-react', '@/components/ui/button'],
    slots: {},
    variantUsed: variant,
    explanation: 'Sticky navigation with logo and links.',
  };
}

// =============================================================================
// LOGO CLOUD TEMPLATES
// =============================================================================

export function generateLogoCloudTemplate(input: BlockGenerationInput): BlockGenerationOutput {
  const { variant, tuners, componentLibrary, content } = input;
  const componentName = generateComponentName('logo-cloud', variant);
  const code = `
export function ${componentName}() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
          Trusted by high-performance teams
        </p>
        <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50">
           <span className="text-2xl font-black italic">VERCEL</span>
           <span className="text-2xl font-black italic">STRIPE</span>
           <span className="text-2xl font-black italic">LINEAR</span>
           <span className="text-2xl font-black italic">GITHUB</span>
           <span className="text-2xl font-black italic">NOTION</span>
        </div>
      </div>
    </section>
  );
}
`;
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: [],
    slots: {},
    variantUsed: variant,
    explanation: 'Simple logo cloud showcase.',
  };
}

// =============================================================================
// PRICING TEMPLATES
// =============================================================================

export function generatePricingTemplate(input: BlockGenerationInput): BlockGenerationOutput {
  const { variant, tuners, componentLibrary, content } = input;
  const componentName = generateComponentName('pricing', variant);
  const code = `
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ${componentName}() {
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
                <span className="text-4xl font-bold">$\{i === 0 ? '0' : i === 1 ? '49' : '99'}</span>
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
`;
  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies: ['lucide-react', '@/components/ui/button'],
    slots: {},
    variantUsed: variant,
    explanation: 'Three-tier pricing grid.',
  };
}

// =============================================================================
// EXPORT ALL LANDING TEMPLATES
// =============================================================================

export const landingTemplates = {
  hero: generateHeroTemplate,
  features: generateFeaturesTemplate,
  navigation: generateNavigationTemplate,
  'logo-cloud': generateLogoCloudTemplate,
  pricing: generatePricingTemplate,
};

