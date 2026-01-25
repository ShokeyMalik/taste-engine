/**
 * Testimonials Block Variants
 *
 * Social proof sections showcasing customer reviews and testimonials.
 * Builds trust and credibility with potential customers.
 */

import { BlockDefinition, TestimonialsVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const carouselVariant: BlockVariant<TestimonialsVariant> = {
  id: 'carousel',
  name: 'Testimonial Carousel',
  description:
    'Testimonials in a sliding carousel. Good for many testimonials without taking up much space.',
  complexity: 'moderate',
  requiredDependencies: ['embla-carousel-react'],
  optionalDependencies: ['embla-carousel-autoplay'],
  shadcnComponents: ['Carousel', 'CarouselContent', 'CarouselItem', 'Avatar'],
  radiusPreference: 'rounded',
  tags: ['carousel', 'slider', 'compact', 'animated'],
};

const gridVariant: BlockVariant<TestimonialsVariant> = {
  id: 'grid',
  name: 'Testimonial Grid',
  description:
    'Testimonials displayed in a responsive grid of cards. All visible at once.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Card', 'CardContent', 'Avatar', 'AvatarImage', 'AvatarFallback'],
  radiusPreference: 'rounded',
  tags: ['grid', 'cards', 'visible', 'simple'],
};

const singleFeaturedVariant: BlockVariant<TestimonialsVariant> = {
  id: 'single-featured',
  name: 'Single Featured Testimonial',
  description:
    'One large, prominent testimonial with quote marks. Perfect for a powerful customer story.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Avatar', 'AvatarImage', 'AvatarFallback'],
  radiusPreference: 'default',
  tags: ['featured', 'single', 'quote', 'prominent'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const testimonialsBlock: BlockDefinition<TestimonialsVariant> = {
  type: 'testimonials',
  category: 'landing',
  name: 'Testimonials Section',
  description:
    'Display customer testimonials and reviews to build social proof and trust.',

  variants: [carouselVariant, gridVariant, singleFeaturedVariant],

  defaultVariant: 'carousel',

  props: [
    {
      name: 'heading',
      type: 'string',
      required: false,
      default: 'What our customers say',
      description: 'Section heading',
    },
    {
      name: 'subheading',
      type: 'string',
      required: false,
      description: 'Section subheading',
    },
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description:
        'Array of testimonial objects with quote, author, role, company, and avatar',
    },
    {
      name: 'showRating',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show star ratings',
    },
    {
      name: 'showCompanyLogo',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show company logos alongside testimonials',
    },
    {
      name: 'autoplay',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Auto-rotate carousel (for carousel variant)',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'ecommerce', 'startup', 'hospitality'],
    pageType: ['marketing'],
    tunerHints: {
      narrative: { min: 0.5, max: 0.9 },
    },
  },

  baseShadcnComponents: ['Avatar'],
  baseDependencies: [],
  keywords: [
    'testimonials',
    'reviews',
    'quotes',
    'social-proof',
    'customers',
    'feedback',
  ],
};

export default testimonialsBlock;
