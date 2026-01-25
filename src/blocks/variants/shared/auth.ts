/**
 * Auth Block Variants
 *
 * Authentication forms for login, signup, password reset, etc.
 * Common across all application types.
 */

import { BlockDefinition, AuthVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const loginVariant: BlockVariant<AuthVariant> = {
  id: 'login',
  name: 'Login Form',
  description:
    'Standard login form with email/password and optional social login buttons.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Card',
    'CardContent',
    'CardDescription',
    'CardHeader',
    'CardTitle',
    'CardFooter',
    'Input',
    'Label',
    'Button',
    'Checkbox',
  ],
  radiusPreference: 'rounded',
  tags: ['login', 'signin', 'email', 'password'],
};

const signupVariant: BlockVariant<AuthVariant> = {
  id: 'signup',
  name: 'Sign Up Form',
  description:
    'Registration form with name, email, password, and optional terms acceptance.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Card',
    'CardContent',
    'CardDescription',
    'CardHeader',
    'CardTitle',
    'CardFooter',
    'Input',
    'Label',
    'Button',
    'Checkbox',
  ],
  radiusPreference: 'rounded',
  tags: ['signup', 'register', 'create-account', 'new-user'],
};

const forgotPasswordVariant: BlockVariant<AuthVariant> = {
  id: 'forgot-password',
  name: 'Forgot Password Form',
  description:
    'Password reset request form with email input and confirmation message.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Card',
    'CardContent',
    'CardDescription',
    'CardHeader',
    'CardTitle',
    'CardFooter',
    'Input',
    'Label',
    'Button',
  ],
  radiusPreference: 'rounded',
  tags: ['forgot-password', 'reset', 'recover', 'email'],
};

const magicLinkVariant: BlockVariant<AuthVariant> = {
  id: 'magic-link',
  name: 'Magic Link Login',
  description:
    'Passwordless login via email magic link. Modern and frictionless.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Card',
    'CardContent',
    'CardDescription',
    'CardHeader',
    'CardTitle',
    'CardFooter',
    'Input',
    'Label',
    'Button',
  ],
  radiusPreference: 'rounded',
  tags: ['magic-link', 'passwordless', 'email-login', 'modern'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const authBlock: BlockDefinition<AuthVariant> = {
  type: 'auth',
  category: 'shared',
  name: 'Authentication Form',
  description:
    'Authentication forms for login, signup, password reset, and magic link.',

  variants: [loginVariant, signupVariant, forgotPasswordVariant, magicLinkVariant],

  defaultVariant: 'login',

  props: [
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Form title',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Form description/subtitle',
    },
    {
      name: 'submitText',
      type: 'string',
      required: false,
      description: 'Submit button text',
    },
    {
      name: 'showSocialLogin',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show social login options',
    },
    {
      name: 'socialProviders',
      type: 'array',
      required: false,
      arrayItemType: 'string',
      description: 'Social providers to show (google, github, etc.)',
    },
    {
      name: 'showRememberMe',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show remember me checkbox (login)',
    },
    {
      name: 'showTerms',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show terms acceptance (signup)',
    },
    {
      name: 'termsLink',
      type: 'string',
      required: false,
      description: 'Link to terms of service',
    },
    {
      name: 'privacyLink',
      type: 'string',
      required: false,
      description: 'Link to privacy policy',
    },
    {
      name: 'redirectUrl',
      type: 'string',
      required: false,
      description: 'Redirect URL after success',
    },
    {
      name: 'logoSrc',
      type: 'string',
      required: false,
      description: 'Logo to display above form',
    },
  ],

  slots: [
    {
      name: 'footer',
      description: 'Additional footer content',
      required: false,
      multiple: false,
    },
  ],

  contextHints: {
    pageType: ['auth'],
    tunerHints: {
      abstraction: { min: 0.3, max: 0.6 },
      density: { min: 0.4, max: 0.6 },
    },
  },

  baseShadcnComponents: ['Card', 'Input', 'Label', 'Button'],
  baseDependencies: [],
  keywords: ['auth', 'login', 'signup', 'register', 'password', 'authentication'],
};

export default authBlock;
