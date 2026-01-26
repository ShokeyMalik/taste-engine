"use client";

import { NavigationBespoke } from "./components/navigation-bespoke";
import { HeroBespoke } from "./components/hero-bespoke";
import { LogoCloudSimple } from "./components/logo-cloud-simple";
import { FeaturesGrid } from "./components/features-grid";
import { StatsSimple } from "./components/stats-simple";
import { TestimonialsCarousel } from "./components/testimonials-carousel";
import { PricingSimple } from "./components/pricing-simple";
import { FaqAccordion } from "./components/faq-accordion";
import { CtaSimple } from "./components/cta-simple";
import { FooterMultiColumn } from "./components/footer-multi-column";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto space-y-24">
      <NavigationBespoke />
      <HeroBespoke />
      <LogoCloudSimple />
      <FeaturesGrid />
      <StatsSimple />
      <TestimonialsCarousel />
      <PricingSimple />
      <FaqAccordion />
      <CtaSimple />
      <FooterMultiColumn />
      </div>
    </main>
  );
}
