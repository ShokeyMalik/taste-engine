/**
 * Landing Block Variants
 *
 * All block definitions for landing pages and marketing sites.
 */

export { heroBlock, default as hero } from './hero';
export { navigationBlock, default as navigation } from './navigation';
export { featuresBlock, default as features } from './features';
export { pricingBlock, default as pricing } from './pricing';
export { testimonialsBlock, default as testimonials } from './testimonials';
export { faqBlock, default as faq } from './faq';
export { ctaBlock, default as cta } from './cta';
export { footerBlock, default as footer } from './footer';
export { logoCloudBlock, default as logoCloud } from './logo-cloud';
export { statsBlock, default as stats } from './stats';

import { heroBlock } from './hero';
import { navigationBlock } from './navigation';
import { featuresBlock } from './features';
import { pricingBlock } from './pricing';
import { testimonialsBlock } from './testimonials';
import { faqBlock } from './faq';
import { ctaBlock } from './cta';
import { footerBlock } from './footer';
import { logoCloudBlock } from './logo-cloud';
import { statsBlock } from './stats';

import type { BlockDefinition } from '../../types';

/**
 * All landing page block definitions
 */
export const landingBlocks: BlockDefinition[] = [
  heroBlock,
  navigationBlock,
  featuresBlock,
  pricingBlock,
  testimonialsBlock,
  faqBlock,
  ctaBlock,
  footerBlock,
  logoCloudBlock,
  statsBlock,
];

export default landingBlocks;
