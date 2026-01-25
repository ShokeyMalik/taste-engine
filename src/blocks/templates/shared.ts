/**
 * Shared Block Templates
 *
 * Template generators for shared blocks (auth, empty-state, error-page, loading)
 */

import type { AppliedTuners, BlockGenerationInput, BlockGenerationOutput } from '../types';
import type { InspirationProfile } from '../../inspiration/inspiration-profile';
import {
  getSpacingClasses,
  getMotionClasses,
  getBorderRadiusClasses,
  getShadowClasses,
  generateComponentName,
  generateFileName,
  getLucideImport,
} from './base';

// =============================================================================
// AUTH TEMPLATES
// =============================================================================

export function generateAuthTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, inspirationProfile: profile, componentLibrary } = input;
  const componentName = generateComponentName('auth', variant);

  let code: string;
  const dependencies: string[] = ['lucide-react'];

  switch (variant) {
    case 'login':
      code = generateAuthLogin(tuners, profile, componentLibrary);
      break;
    case 'register':
      code = generateAuthRegister(tuners, profile, componentLibrary);
      break;
    case 'forgot-password':
      code = generateAuthForgotPassword(tuners, profile, componentLibrary);
      break;
    case 'magic-link':
      code = generateAuthMagicLink(tuners, profile, componentLibrary);
      break;
    default:
      code = generateAuthLogin(tuners, profile, componentLibrary);
  }

  if (componentLibrary === 'shadcn') {
    dependencies.push(
      '@/components/ui/card',
      '@/components/ui/button',
      '@/components/ui/input',
      '@/components/ui/label'
    );
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies,
    slots: {},
    variantUsed: variant,
    explanation: `Authentication form with ${variant} variant.`,
  };
}

function generateAuthLogin(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const imports = library === 'shadcn'
    ? `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";`
    : '';

  return `"use client";

import { useState } from "react";
${getLucideImport(['Mail', 'Lock', 'Eye', 'EyeOff', 'Github', 'Loader2'])}
${imports}

interface AuthLoginProps {
  onSubmit?: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  loading?: boolean;
}

export function AuthLogin({
  onSubmit,
  onGoogleLogin,
  onGithubLogin,
  loading = false,
}: AuthLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center ${getSpacingClasses(tuners.density, 'card')}">
      ${library === 'shadcn' ? `<Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={onGoogleLogin}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" onClick={onGithubLogin}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>` : `<div className="w-full max-w-md ${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card ${getShadowClasses(profile)}">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2 ${getBorderRadiusClasses(profile)} border bg-background text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 ${getBorderRadiusClasses(profile)} border bg-background text-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium ${getMotionClasses(tuners.motion)}"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">Sign up</a>
        </p>
      </div>`}
    </div>
  );
}
`;
}

function generateAuthRegister(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const imports = library === 'shadcn'
    ? `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";`
    : '';

  return `"use client";

import { useState } from "react";
${getLucideImport(['User', 'Mail', 'Lock', 'Eye', 'EyeOff', 'Loader2'])}
${imports}

interface AuthRegisterProps {
  onSubmit?: (name: string, email: string, password: string) => void;
  loading?: boolean;
}

export function AuthRegister({
  onSubmit,
  loading = false,
}: AuthRegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(name, email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center ${getSpacingClasses(tuners.density, 'card')}">
      ${library === 'shadcn' ? `<Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>` : `<div className="w-full max-w-md ${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
          <p className="text-muted-foreground mt-1">Enter your details to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 ${getBorderRadiusClasses(profile)} border bg-background text-foreground"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-2 ${getBorderRadiusClasses(profile)} border bg-background text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="w-full px-4 py-2 ${getBorderRadiusClasses(profile)} border bg-background text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>`}
    </div>
  );
}
`;
}

function generateAuthForgotPassword(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  return `"use client";

import { useState } from "react";
${getLucideImport(['Mail', 'ArrowLeft', 'Loader2'])}

export function AuthForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center ${getSpacingClasses(tuners.density, 'card')}">
      <div className="w-full max-w-md ${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
            <p className="text-muted-foreground mt-2">
              We've sent password reset instructions to {email}
            </p>
            <a href="/login" className="inline-flex items-center mt-6 text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </a>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
              <p className="text-muted-foreground mt-1">
                Enter your email and we'll send you reset instructions
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 ${getBorderRadiusClasses(profile)} border bg-background text-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium flex items-center justify-center"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send reset link
              </button>
            </form>
            <a href="/login" className="flex items-center justify-center mt-6 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
`;
}

function generateAuthMagicLink(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  return `"use client";

import { useState } from "react";
${getLucideImport(['Mail', 'Sparkles', 'Loader2'])}

export function AuthMagicLink() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center ${getSpacingClasses(tuners.density, 'card')}">
      <div className="w-full max-w-md ${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
            <p className="text-muted-foreground mt-2">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Click the link in your email to sign in instantly. No password needed!
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Sign in with magic link</h1>
              <p className="text-muted-foreground mt-1">
                Enter your email to receive a passwordless sign-in link
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 ${getBorderRadiusClasses(profile)} border bg-background text-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium flex items-center justify-center"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send magic link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
`;
}

// =============================================================================
// EMPTY STATE TEMPLATE
// =============================================================================

export function generateEmptyStateTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, inspirationProfile: profile, componentLibrary } = input;
  const componentName = generateComponentName('empty-state', variant);

  const code = generateEmptyStateBasic(tuners, profile, componentLibrary);
  const dependencies: string[] = ['lucide-react'];

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
    explanation: `Empty state with ${variant} style.`,
  };
}

function generateEmptyStateBasic(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';

  return `${getLucideImport(['FileQuestion', 'Plus'])}
${buttonImport}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = <FileQuestion className="h-12 w-12" />,
  title = "No items found",
  description = "Get started by creating your first item.",
  actionLabel = "Create new",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center ${getSpacingClasses(tuners.density, 'section')} text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      ${library === 'shadcn' ? `<Button onClick={onAction}>
        <Plus className="mr-2 h-4 w-4" />
        {actionLabel}
      </Button>` : `<button
        onClick={onAction}
        className="inline-flex items-center px-4 py-2 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium ${getMotionClasses(tuners.motion)}"
      >
        <Plus className="mr-2 h-4 w-4" />
        {actionLabel}
      </button>`}
    </div>
  );
}
`;
}

// =============================================================================
// ERROR PAGE TEMPLATE
// =============================================================================

export function generateErrorPageTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, inspirationProfile: profile, componentLibrary } = input;
  const componentName = generateComponentName('error-page', variant);

  const code = generateErrorPageBasic(tuners, profile, componentLibrary, variant);
  const dependencies: string[] = ['lucide-react'];

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
    explanation: `Error page for ${variant} errors.`,
  };
}

function generateErrorPageBasic(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  variant?: string
): string {
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';

  const errorConfig = {
    '404': { code: '404', title: 'Page not found', description: "Sorry, we couldn't find the page you're looking for." },
    '500': { code: '500', title: 'Server error', description: 'Something went wrong on our end. Please try again later.' },
    'generic': { code: 'Error', title: 'Something went wrong', description: 'An unexpected error occurred. Please try again.' },
  };

  const config = errorConfig[variant as keyof typeof errorConfig] || errorConfig['generic'];

  return `${getLucideImport(['Home', 'RefreshCw', 'ArrowLeft'])}
${buttonImport}

interface ErrorPageProps {
  code?: string;
  title?: string;
  description?: string;
  onGoHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

export function ErrorPage${variant === '404' ? '404' : variant === '500' ? '500' : 'Generic'}({
  code = "${config.code}",
  title = "${config.title}",
  description = "${config.description}",
  onGoHome,
  onGoBack,
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ${getSpacingClasses(tuners.density, 'card')} text-center">
      <p className="text-8xl font-bold text-muted-foreground/20 mb-4">
        {code}
      </p>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        {title}
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        ${library === 'shadcn' ? `<Button variant="outline" onClick={onGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
        <Button onClick={onGoHome}>
          <Home className="mr-2 h-4 w-4" />
          Go home
        </Button>` : `<button
          onClick={onGoBack}
          className="inline-flex items-center px-4 py-2 ${getBorderRadiusClasses(profile)} border text-foreground font-medium ${getMotionClasses(tuners.motion)}"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </button>
        <button
          onClick={onGoHome}
          className="inline-flex items-center px-4 py-2 ${getBorderRadiusClasses(profile)} bg-primary text-primary-foreground font-medium ${getMotionClasses(tuners.motion)}"
        >
          <Home className="mr-2 h-4 w-4" />
          Go home
        </button>`}
      </div>
    </div>
  );
}
`;
}

// =============================================================================
// LOADING TEMPLATE
// =============================================================================

export function generateLoadingTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, inspirationProfile: profile, componentLibrary } = input;
  const componentName = generateComponentName('loading', variant);

  const code = generateLoadingBasic(tuners, profile, componentLibrary, variant);
  const dependencies: string[] = [];

  if (componentLibrary === 'shadcn') {
    dependencies.push('@/components/ui/skeleton');
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies,
    slots: {},
    variantUsed: variant,
    explanation: `Loading state with ${variant} animation.`,
  };
}

function generateLoadingBasic(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string,
  variant?: string
): string {
  if (variant === 'skeleton' && library === 'shadcn') {
    return `import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 ${getSpacingClasses(tuners.density, 'card')}">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
    </div>
  );
}
`;
  }

  return `export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    </div>
  );
}
`;
}

// =============================================================================
// EXPORT ALL SHARED TEMPLATES
// =============================================================================

export const sharedTemplates = {
  auth: generateAuthTemplate,
  'empty-state': generateEmptyStateTemplate,
  'error-page': generateErrorPageTemplate,
  loading: generateLoadingTemplate,
};
