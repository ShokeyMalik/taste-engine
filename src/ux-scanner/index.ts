/**
 * UX Context Scanner
 *
 * Scans a codebase to extract UX context for intelligent design decisions.
 * This enables the Taste Engine to understand:
 * - WHAT the product does (domain/industry)
 * - WHO uses it (audience personas)
 * - HOW they use it (key workflows)
 * - WHAT matters most (content hierarchy)
 *
 * Two modes:
 * 1. MCP Mode - Auto-scans codebase, extracts everything
 * 2. Interactive Mode - User provides/refines via UI
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

// =============================================================================
// TYPES
// =============================================================================

export interface UXContextManifest {
  // Meta
  scanDate: string;
  repoPath: string;
  confidence: number; // 0-1, how confident we are in the extraction

  // Domain Detection
  domain: {
    industry: Industry;
    subDomain?: string;
    description: string;
    keywords: string[];
    confidence: number;
  };

  // Audience Personas
  audiences: AudiencePersona[];

  // Key Workflows
  workflows: Workflow[];

  // Content Hierarchy
  contentHierarchy: ContentHierarchy;

  // Existing Patterns (learned from codebase)
  patterns: ExistingPatterns;

  // Recommendations
  recommendations: UXRecommendation[];
}

export type Industry =
  | 'hospitality'
  | 'ecommerce'
  | 'saas'
  | 'healthcare'
  | 'fintech'
  | 'education'
  | 'social'
  | 'productivity'
  | 'developer-tools'
  | 'marketing'
  | 'crm'
  | 'unknown';

export interface AudiencePersona {
  id: string;
  name: string;
  role: string;
  description: string;
  goals: string[];
  painPoints: string[];
  techSavviness: 'low' | 'medium' | 'high';
  frequency: 'daily' | 'weekly' | 'occasional';
  priority: 'primary' | 'secondary' | 'tertiary';
  detectedFrom: string[]; // Which files/patterns led to this detection
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  persona: string; // Which persona uses this
  steps: WorkflowStep[];
  frequency: 'critical' | 'frequent' | 'occasional' | 'rare';
  complexity: 'simple' | 'moderate' | 'complex';
  relatedRoutes: string[];
  relatedComponents: string[];
}

export interface WorkflowStep {
  order: number;
  action: string;
  component?: string;
  route?: string;
}

export interface ContentHierarchy {
  // What should be most prominent
  primary: ContentItem[];
  // Important but secondary
  secondary: ContentItem[];
  // Tertiary/supporting
  tertiary: ContentItem[];
  // Actions by priority
  actions: {
    primary: string[]; // "New Booking", "Check In"
    secondary: string[]; // "Export", "Filter"
    contextual: string[]; // "Edit", "Delete"
  };
}

export interface ContentItem {
  type: 'metric' | 'list' | 'form' | 'chart' | 'notification' | 'navigation';
  name: string;
  description: string;
  dataSource?: string;
  importance: number; // 0-1
}

export interface ExistingPatterns {
  // Layout patterns found
  layouts: LayoutPattern[];
  // Component patterns found
  components: UXComponentPattern[];
  // Navigation structure
  navigation: NavigationPattern;
  // Data display patterns
  dataDisplay: DataDisplayPattern[];
}

export interface LayoutPattern {
  name: string;
  structure: string; // e.g., "sidebar-main", "header-content-footer"
  usedIn: string[];
  frequency: number;
}

export interface UXComponentPattern {
  type: string; // "stat-card", "data-table", "form", etc.
  variants: string[];
  usedIn: string[];
  props: string[];
}

export interface NavigationPattern {
  type: 'sidebar' | 'topnav' | 'tabs' | 'hybrid';
  levels: number;
  items: NavigationItem[];
}

export interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
  children?: NavigationItem[];
  audience?: string;
}

export interface DataDisplayPattern {
  type: 'table' | 'cards' | 'list' | 'grid' | 'timeline';
  usedFor: string[];
  features: string[]; // "pagination", "sorting", "filtering"
}

export interface UXRecommendation {
  type: 'layout' | 'component' | 'workflow' | 'hierarchy';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  implementation?: string;
}

// =============================================================================
// DOMAIN DETECTION PATTERNS
// =============================================================================

const DOMAIN_PATTERNS: Record<Industry, {
  keywords: string[];
  filePatterns: string[];
  routePatterns: string[];
  componentPatterns: string[];
}> = {
  hospitality: {
    keywords: [
      'hotel', 'booking', 'reservation', 'guest', 'room', 'check-in', 'checkout',
      'folio', 'housekeeping', 'front-desk', 'occupancy', 'rate', 'tariff',
      'amenities', 'concierge', 'hospitality', 'lodging', 'accommodation'
    ],
    filePatterns: ['booking', 'guest', 'room', 'folio', 'checkin', 'housekeeping'],
    routePatterns: ['/booking', '/guest', '/room', '/folio', '/check-in', '/dashboard'],
    componentPatterns: ['BookingForm', 'GuestCard', 'RoomGrid', 'FolioTable', 'OccupancyChart']
  },
  ecommerce: {
    keywords: [
      'product', 'cart', 'checkout', 'order', 'inventory', 'sku', 'shipping',
      'payment', 'catalog', 'price', 'discount', 'coupon', 'customer', 'wishlist'
    ],
    filePatterns: ['product', 'cart', 'order', 'inventory', 'checkout'],
    routePatterns: ['/product', '/cart', '/checkout', '/order', '/catalog'],
    componentPatterns: ['ProductCard', 'CartItem', 'OrderSummary', 'CheckoutForm']
  },
  saas: {
    keywords: [
      'subscription', 'plan', 'billing', 'usage', 'api', 'integration', 'webhook',
      'tenant', 'workspace', 'team', 'member', 'permission', 'role', 'dashboard'
    ],
    filePatterns: ['subscription', 'billing', 'usage', 'integration', 'workspace'],
    routePatterns: ['/settings', '/billing', '/integrations', '/team', '/api'],
    componentPatterns: ['PricingTable', 'UsageChart', 'TeamMembers', 'IntegrationCard']
  },
  healthcare: {
    keywords: [
      'patient', 'appointment', 'prescription', 'diagnosis', 'medical', 'health',
      'doctor', 'clinic', 'hospital', 'treatment', 'record', 'ehr', 'insurance'
    ],
    filePatterns: ['patient', 'appointment', 'prescription', 'medical', 'health'],
    routePatterns: ['/patient', '/appointment', '/records', '/prescriptions'],
    componentPatterns: ['PatientCard', 'AppointmentForm', 'MedicalHistory']
  },
  fintech: {
    keywords: [
      'transaction', 'payment', 'account', 'balance', 'transfer', 'wallet',
      'invoice', 'expense', 'budget', 'bank', 'card', 'loan', 'credit', 'kyc'
    ],
    filePatterns: ['transaction', 'payment', 'account', 'wallet', 'invoice'],
    routePatterns: ['/transactions', '/accounts', '/payments', '/invoices'],
    componentPatterns: ['TransactionList', 'AccountCard', 'PaymentForm', 'BalanceWidget']
  },
  education: {
    keywords: [
      'course', 'student', 'lesson', 'assignment', 'grade', 'teacher', 'class',
      'curriculum', 'enrollment', 'quiz', 'certificate', 'learning', 'module'
    ],
    filePatterns: ['course', 'student', 'lesson', 'assignment', 'grade'],
    routePatterns: ['/courses', '/students', '/lessons', '/assignments', '/grades'],
    componentPatterns: ['CourseCard', 'LessonPlayer', 'AssignmentForm', 'GradeBook']
  },
  social: {
    keywords: [
      'post', 'feed', 'follow', 'like', 'comment', 'share', 'profile', 'friend',
      'message', 'notification', 'story', 'timeline', 'community', 'group'
    ],
    filePatterns: ['post', 'feed', 'profile', 'message', 'notification'],
    routePatterns: ['/feed', '/profile', '/messages', '/notifications', '/groups'],
    componentPatterns: ['PostCard', 'FeedList', 'ProfileHeader', 'CommentThread']
  },
  productivity: {
    keywords: [
      'task', 'project', 'todo', 'calendar', 'schedule', 'note', 'document',
      'collaboration', 'deadline', 'milestone', 'board', 'kanban', 'sprint'
    ],
    filePatterns: ['task', 'project', 'calendar', 'note', 'document'],
    routePatterns: ['/tasks', '/projects', '/calendar', '/notes', '/documents'],
    componentPatterns: ['TaskList', 'ProjectBoard', 'CalendarView', 'NoteEditor']
  },
  'developer-tools': {
    keywords: [
      'repository', 'commit', 'branch', 'deploy', 'build', 'pipeline', 'log',
      'debug', 'api', 'sdk', 'cli', 'webhook', 'environment', 'config'
    ],
    filePatterns: ['repository', 'deploy', 'build', 'pipeline', 'config'],
    routePatterns: ['/repos', '/deployments', '/builds', '/logs', '/settings'],
    componentPatterns: ['RepoList', 'DeploymentStatus', 'BuildLog', 'ConfigEditor']
  },
  marketing: {
    keywords: [
      'campaign', 'lead', 'conversion', 'analytics', 'email', 'audience',
      'segment', 'funnel', 'landing', 'ab-test', 'engagement', 'roi'
    ],
    filePatterns: ['campaign', 'lead', 'analytics', 'email', 'segment'],
    routePatterns: ['/campaigns', '/leads', '/analytics', '/emails', '/audiences'],
    componentPatterns: ['CampaignCard', 'LeadTable', 'AnalyticsChart', 'EmailBuilder']
  },
  crm: {
    keywords: [
      'contact', 'lead', 'opportunity', 'deal', 'pipeline', 'customer',
      'account', 'activity', 'note', 'task', 'sales', 'revenue'
    ],
    filePatterns: ['contact', 'lead', 'opportunity', 'deal', 'pipeline'],
    routePatterns: ['/contacts', '/leads', '/deals', '/pipeline', '/accounts'],
    componentPatterns: ['ContactCard', 'DealPipeline', 'ActivityTimeline', 'OpportunityBoard']
  },
  unknown: {
    keywords: [],
    filePatterns: [],
    routePatterns: [],
    componentPatterns: []
  }
};

// =============================================================================
// AUDIENCE DETECTION PATTERNS
// =============================================================================

const AUDIENCE_INDICATORS: Record<string, {
  keywords: string[];
  routePatterns: string[];
  componentPatterns: string[];
  persona: Partial<AudiencePersona>;
}> = {
  admin: {
    keywords: ['admin', 'superadmin', 'administrator', 'management', 'settings'],
    routePatterns: ['/admin', '/super-admin', '/settings', '/management'],
    componentPatterns: ['AdminPanel', 'UserManagement', 'SystemSettings'],
    persona: {
      role: 'Administrator',
      techSavviness: 'high',
      frequency: 'daily',
      goals: ['System configuration', 'User management', 'Access control']
    }
  },
  operator: {
    keywords: ['staff', 'operator', 'employee', 'frontdesk', 'front-desk', 'agent'],
    routePatterns: ['/dashboard', '/operations', '/tasks', '/queue'],
    componentPatterns: ['Dashboard', 'TaskList', 'OperationsView', 'QueueManager'],
    persona: {
      role: 'Operations Staff',
      techSavviness: 'medium',
      frequency: 'daily',
      goals: ['Process transactions', 'Manage daily operations', 'Handle customer requests']
    }
  },
  manager: {
    keywords: ['manager', 'report', 'analytics', 'performance', 'overview', 'insights'],
    routePatterns: ['/reports', '/analytics', '/insights', '/performance'],
    componentPatterns: ['ReportViewer', 'AnalyticsDashboard', 'PerformanceChart'],
    persona: {
      role: 'Manager',
      techSavviness: 'medium',
      frequency: 'daily',
      goals: ['Monitor performance', 'Generate reports', 'Make decisions']
    }
  },
  customer: {
    keywords: ['customer', 'client', 'user', 'guest', 'member', 'subscriber'],
    routePatterns: ['/account', '/profile', '/my-', '/bookings', '/orders'],
    componentPatterns: ['AccountSettings', 'ProfileView', 'MyBookings', 'OrderHistory'],
    persona: {
      role: 'End Customer',
      techSavviness: 'low',
      frequency: 'occasional',
      goals: ['Complete transactions', 'View status', 'Manage account']
    }
  },
  developer: {
    keywords: ['api', 'developer', 'integration', 'webhook', 'sdk', 'documentation'],
    routePatterns: ['/api', '/developers', '/docs', '/integrations'],
    componentPatterns: ['ApiDocs', 'WebhookConfig', 'IntegrationGuide'],
    persona: {
      role: 'Developer',
      techSavviness: 'high',
      frequency: 'occasional',
      goals: ['Integrate systems', 'Access API', 'Build extensions']
    }
  }
};

// =============================================================================
// SCANNER CLASS
// =============================================================================

export class UXContextScanner {
  private repoPath: string;
  private fileCache: Map<string, string> = new Map();
  private routeCache: string[] = [];
  private componentCache: string[] = [];

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  /**
   * Main scan function - extracts full UX context from codebase
   */
  async scan(): Promise<UXContextManifest> {
    console.log(`[UX Scanner] Starting scan of ${this.repoPath}`);

    // Phase 1: Collect files
    await this.collectFiles();

    // Phase 2: Detect domain
    const domain = this.detectDomain();

    // Phase 3: Detect audiences
    const audiences = this.detectAudiences();

    // Phase 4: Extract workflows
    const workflows = this.extractWorkflows(domain.industry, audiences);

    // Phase 5: Build content hierarchy
    const contentHierarchy = this.buildContentHierarchy(domain.industry, audiences);

    // Phase 6: Extract existing patterns
    const patterns = this.extractPatterns();

    // Phase 7: Generate recommendations
    const recommendations = this.generateRecommendations(domain, audiences, workflows, patterns);

    // Calculate overall confidence
    const confidence = this.calculateConfidence(domain, audiences, workflows);

    return {
      scanDate: new Date().toISOString(),
      repoPath: this.repoPath,
      confidence,
      domain,
      audiences,
      workflows,
      contentHierarchy,
      patterns,
      recommendations
    };
  }

  /**
   * Collect all relevant files from the codebase
   */
  private async collectFiles(): Promise<void> {
    const srcPath = join(this.repoPath, 'src');
    if (!existsSync(srcPath)) {
      console.warn('[UX Scanner] No src directory found');
      return;
    }

    const scanDir = (dir: string) => {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules, dist, etc.
          if (!['node_modules', 'dist', 'build', '.git', 'coverage'].includes(item)) {
            scanDir(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = extname(item);
          if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
            try {
              const content = readFileSync(fullPath, 'utf-8');
              this.fileCache.set(fullPath, content);

              // Extract routes
              const routeMatches = content.match(/path=["']([^"']+)["']/g);
              if (routeMatches) {
                routeMatches.forEach(match => {
                  const route = match.match(/path=["']([^"']+)["']/)?.[1];
                  if (route && !this.routeCache.includes(route)) {
                    this.routeCache.push(route);
                  }
                });
              }

              // Extract component names
              const componentMatch = content.match(/(?:export\s+(?:const|function|class)\s+|export\s+default\s+(?:function\s+)?)([\w]+)/g);
              if (componentMatch) {
                componentMatch.forEach(match => {
                  const name = match.replace(/export\s+(const|function|class|default\s+function\s*)\s*/g, '').trim();
                  if (name && /^[A-Z]/.test(name) && !this.componentCache.includes(name)) {
                    this.componentCache.push(name);
                  }
                });
              }
            } catch (e) {
              // Skip unreadable files
            }
          }
        }
      }
    };

    scanDir(srcPath);
    console.log(`[UX Scanner] Collected ${this.fileCache.size} files, ${this.routeCache.length} routes, ${this.componentCache.length} components`);
  }

  /**
   * Detect the domain/industry of the application
   */
  private detectDomain(): UXContextManifest['domain'] {
    const scores: Record<Industry, number> = {} as Record<Industry, number>;

    // Initialize scores
    Object.keys(DOMAIN_PATTERNS).forEach(industry => {
      scores[industry as Industry] = 0;
    });

    // Combine all file content for analysis
    const allContent = Array.from(this.fileCache.values()).join(' ').toLowerCase();
    const allFileNames = Array.from(this.fileCache.keys()).map(f => basename(f).toLowerCase());

    // Score each industry
    for (const [industry, patterns] of Object.entries(DOMAIN_PATTERNS)) {
      // Keyword matches (weighted by frequency)
      for (const keyword of patterns.keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = allContent.match(regex);
        if (matches) {
          scores[industry as Industry] += matches.length * 2;
        }
      }

      // File name matches (strong signal)
      for (const pattern of patterns.filePatterns) {
        const matchingFiles = allFileNames.filter(f => f.includes(pattern));
        scores[industry as Industry] += matchingFiles.length * 10;
      }

      // Route matches (strong signal)
      for (const routePattern of patterns.routePatterns) {
        const matchingRoutes = this.routeCache.filter(r => r.includes(routePattern));
        scores[industry as Industry] += matchingRoutes.length * 15;
      }

      // Component matches (very strong signal)
      for (const compPattern of patterns.componentPatterns) {
        const matchingComponents = this.componentCache.filter(c =>
          c.toLowerCase().includes(compPattern.toLowerCase())
        );
        scores[industry as Industry] += matchingComponents.length * 20;
      }
    }

    // Find winner
    const sortedIndustries = Object.entries(scores)
      .filter(([industry]) => industry !== 'unknown')
      .sort(([, a], [, b]) => b - a);

    const [topIndustry, topScore] = sortedIndustries[0] || ['unknown', 0];
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalScore > 0 ? Math.min(topScore / totalScore, 0.95) : 0;

    // Extract keywords that matched
    const matchedKeywords = DOMAIN_PATTERNS[topIndustry as Industry]?.keywords.filter(kw =>
      allContent.includes(kw.toLowerCase())
    ) || [];

    // Generate description
    const descriptions: Record<Industry, string> = {
      hospitality: 'Hotel/hospitality management platform for managing bookings, guests, and property operations',
      ecommerce: 'E-commerce platform for managing products, orders, and customer transactions',
      saas: 'SaaS platform with subscription management, billing, and team collaboration features',
      healthcare: 'Healthcare management system for patient records, appointments, and medical workflows',
      fintech: 'Financial technology platform for payments, transactions, and account management',
      education: 'Education platform for courses, students, and learning management',
      social: 'Social platform for user interactions, content sharing, and community engagement',
      productivity: 'Productivity tool for task management, project tracking, and collaboration',
      'developer-tools': 'Developer tools platform for code management, deployments, and integrations',
      marketing: 'Marketing platform for campaigns, leads, and analytics',
      crm: 'CRM platform for contact management, sales pipeline, and customer relationships',
      unknown: 'Unable to determine specific domain - general web application'
    };

    return {
      industry: topIndustry as Industry,
      description: descriptions[topIndustry as Industry],
      keywords: matchedKeywords.slice(0, 10),
      confidence
    };
  }

  /**
   * Detect audience personas from the codebase
   */
  private detectAudiences(): AudiencePersona[] {
    const audiences: AudiencePersona[] = [];
    const allContent = Array.from(this.fileCache.values()).join(' ').toLowerCase();

    for (const [audienceId, indicators] of Object.entries(AUDIENCE_INDICATORS)) {
      const detectedFrom: string[] = [];
      let score = 0;

      // Check keywords
      for (const keyword of indicators.keywords) {
        if (allContent.includes(keyword)) {
          score += 5;
          detectedFrom.push(`keyword: ${keyword}`);
        }
      }

      // Check routes
      for (const routePattern of indicators.routePatterns) {
        const matchingRoutes = this.routeCache.filter(r => r.includes(routePattern));
        if (matchingRoutes.length > 0) {
          score += matchingRoutes.length * 10;
          detectedFrom.push(`routes: ${matchingRoutes.join(', ')}`);
        }
      }

      // Check components
      for (const compPattern of indicators.componentPatterns) {
        const matchingComponents = this.componentCache.filter(c =>
          c.toLowerCase().includes(compPattern.toLowerCase())
        );
        if (matchingComponents.length > 0) {
          score += matchingComponents.length * 15;
          detectedFrom.push(`components: ${matchingComponents.join(', ')}`);
        }
      }

      // Only add if we have enough confidence
      if (score > 20 && detectedFrom.length > 0) {
        const priority: AudiencePersona['priority'] =
          score > 100 ? 'primary' : score > 50 ? 'secondary' : 'tertiary';

        audiences.push({
          id: audienceId,
          name: `${audienceId.charAt(0).toUpperCase()}${audienceId.slice(1)} User`,
          role: indicators.persona.role || audienceId,
          description: `Users who ${indicators.persona.goals?.[0]?.toLowerCase() || 'interact with the system'}`,
          goals: indicators.persona.goals || [],
          painPoints: [],
          techSavviness: indicators.persona.techSavviness || 'medium',
          frequency: indicators.persona.frequency || 'occasional',
          priority,
          detectedFrom
        });
      }
    }

    // Sort by priority
    return audiences.sort((a, b) => {
      const priorityOrder = { primary: 0, secondary: 1, tertiary: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Extract key workflows from the codebase
   */
  private extractWorkflows(industry: Industry, audiences: AudiencePersona[]): Workflow[] {
    const workflows: Workflow[] = [];

    // Industry-specific workflow patterns
    const workflowPatterns: Record<Industry, { name: string; keywords: string[]; routes: string[] }[]> = {
      hospitality: [
        { name: 'Create Booking', keywords: ['booking', 'reservation', 'new booking'], routes: ['/booking', '/new-booking'] },
        { name: 'Guest Check-in', keywords: ['checkin', 'check-in', 'arrival'], routes: ['/check-in', '/checkin'] },
        { name: 'Guest Check-out', keywords: ['checkout', 'check-out', 'departure'], routes: ['/check-out', '/checkout'] },
        { name: 'Room Management', keywords: ['room', 'housekeeping', 'maintenance'], routes: ['/rooms', '/housekeeping'] },
        { name: 'Payment Processing', keywords: ['payment', 'folio', 'invoice', 'billing'], routes: ['/folio', '/payment'] },
        { name: 'Reporting', keywords: ['report', 'analytics', 'dashboard'], routes: ['/reports', '/dashboard'] }
      ],
      ecommerce: [
        { name: 'Browse Products', keywords: ['product', 'catalog', 'search'], routes: ['/products', '/catalog'] },
        { name: 'Add to Cart', keywords: ['cart', 'basket', 'add'], routes: ['/cart'] },
        { name: 'Checkout', keywords: ['checkout', 'payment', 'order'], routes: ['/checkout'] },
        { name: 'Order Management', keywords: ['order', 'fulfillment', 'shipping'], routes: ['/orders'] }
      ],
      saas: [
        { name: 'User Onboarding', keywords: ['onboard', 'setup', 'welcome'], routes: ['/onboarding', '/setup'] },
        { name: 'Team Management', keywords: ['team', 'member', 'invite'], routes: ['/team', '/members'] },
        { name: 'Billing Management', keywords: ['billing', 'subscription', 'plan'], routes: ['/billing', '/subscription'] }
      ],
      healthcare: [],
      fintech: [],
      education: [],
      social: [],
      productivity: [],
      'developer-tools': [],
      marketing: [],
      crm: [],
      unknown: []
    };

    const patterns = workflowPatterns[industry] || [];
    const allContent = Array.from(this.fileCache.values()).join(' ').toLowerCase();

    for (const pattern of patterns) {
      // Check if this workflow exists in codebase
      const keywordMatches = pattern.keywords.filter(kw => allContent.includes(kw)).length;
      const routeMatches = pattern.routes.filter(r =>
        this.routeCache.some(route => route.includes(r))
      ).length;

      if (keywordMatches > 0 || routeMatches > 0) {
        const relatedRoutes = this.routeCache.filter(r =>
          pattern.routes.some(pr => r.includes(pr))
        );

        const relatedComponents = this.componentCache.filter(c =>
          pattern.keywords.some(kw => c.toLowerCase().includes(kw))
        );

        workflows.push({
          id: pattern.name.toLowerCase().replace(/\s+/g, '-'),
          name: pattern.name,
          description: `Workflow for ${pattern.name.toLowerCase()}`,
          persona: audiences[0]?.id || 'operator',
          steps: [], // Would need deeper analysis to extract steps
          frequency: keywordMatches > 5 ? 'critical' : keywordMatches > 2 ? 'frequent' : 'occasional',
          complexity: relatedComponents.length > 5 ? 'complex' : relatedComponents.length > 2 ? 'moderate' : 'simple',
          relatedRoutes,
          relatedComponents
        });
      }
    }

    return workflows;
  }

  /**
   * Build content hierarchy based on domain and audiences
   */
  private buildContentHierarchy(industry: Industry, audiences: AudiencePersona[]): ContentHierarchy {
    // Industry-specific content priorities
    const hierarchies: Record<Industry, ContentHierarchy> = {
      hospitality: {
        primary: [
          { type: 'metric', name: 'Occupancy Rate', description: 'Current room occupancy', importance: 1 },
          { type: 'metric', name: 'Revenue', description: 'Daily/monthly revenue', importance: 0.95 },
          { type: 'list', name: 'Arrivals Today', description: 'Expected check-ins', importance: 0.9 },
          { type: 'list', name: 'Departures Today', description: 'Expected check-outs', importance: 0.85 }
        ],
        secondary: [
          { type: 'metric', name: 'ADR', description: 'Average Daily Rate', importance: 0.7 },
          { type: 'metric', name: 'RevPAR', description: 'Revenue per Available Room', importance: 0.65 },
          { type: 'chart', name: 'Occupancy Trend', description: 'Historical occupancy', importance: 0.6 }
        ],
        tertiary: [
          { type: 'list', name: 'Housekeeping Status', description: 'Room cleaning status', importance: 0.4 },
          { type: 'notification', name: 'Guest Requests', description: 'Pending requests', importance: 0.35 }
        ],
        actions: {
          primary: ['New Booking', 'Check In', 'Check Out'],
          secondary: ['Room Assignment', 'Add Payment', 'Generate Report'],
          contextual: ['Edit Booking', 'Cancel Booking', 'Send Confirmation']
        }
      },
      ecommerce: {
        primary: [
          { type: 'metric', name: 'Daily Sales', description: 'Total sales today', importance: 1 },
          { type: 'metric', name: 'Orders', description: 'Pending orders count', importance: 0.95 },
          { type: 'list', name: 'Recent Orders', description: 'Latest orders', importance: 0.9 }
        ],
        secondary: [
          { type: 'metric', name: 'Conversion Rate', description: 'Visitor to customer', importance: 0.7 },
          { type: 'chart', name: 'Sales Trend', description: 'Historical sales', importance: 0.6 }
        ],
        tertiary: [
          { type: 'list', name: 'Low Stock', description: 'Products needing restock', importance: 0.4 }
        ],
        actions: {
          primary: ['Add Product', 'Process Order', 'Create Discount'],
          secondary: ['Update Inventory', 'Generate Report'],
          contextual: ['Edit Product', 'Cancel Order', 'Refund']
        }
      },
      saas: {
        primary: [
          { type: 'metric', name: 'Active Users', description: 'Current active users', importance: 1 },
          { type: 'metric', name: 'MRR', description: 'Monthly recurring revenue', importance: 0.95 }
        ],
        secondary: [
          { type: 'metric', name: 'Churn Rate', description: 'Customer churn', importance: 0.7 },
          { type: 'chart', name: 'Growth', description: 'User growth trend', importance: 0.6 }
        ],
        tertiary: [],
        actions: {
          primary: ['Create Workspace', 'Invite Member'],
          secondary: ['Manage Billing', 'Configure Settings'],
          contextual: ['Edit', 'Delete', 'Export']
        }
      },
      healthcare: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      fintech: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      education: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      social: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      productivity: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      'developer-tools': { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      marketing: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      crm: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } },
      unknown: { primary: [], secondary: [], tertiary: [], actions: { primary: [], secondary: [], contextual: [] } }
    };

    return hierarchies[industry] || hierarchies.unknown;
  }

  /**
   * Extract existing patterns from the codebase
   */
  private extractPatterns(): ExistingPatterns {
    const layouts: LayoutPattern[] = [];
    const components: UXComponentPattern[] = [];
    const dataDisplay: DataDisplayPattern[] = [];

    // Detect layout patterns
    const allContent = Array.from(this.fileCache.values()).join(' ');

    if (allContent.includes('Sidebar') || allContent.includes('sidebar')) {
      layouts.push({
        name: 'Sidebar Layout',
        structure: 'sidebar-main',
        usedIn: this.componentCache.filter(c => c.toLowerCase().includes('layout')),
        frequency: (allContent.match(/sidebar/gi) || []).length
      });
    }

    if (allContent.includes('AppShell') || allContent.includes('shell')) {
      layouts.push({
        name: 'App Shell',
        structure: 'header-sidebar-main',
        usedIn: this.componentCache.filter(c => c.toLowerCase().includes('shell')),
        frequency: (allContent.match(/appshell|shell/gi) || []).length
      });
    }

    // Detect component patterns
    const componentTypes = ['Card', 'Table', 'Form', 'List', 'Grid', 'Chart', 'Modal', 'Dialog'];
    for (const type of componentTypes) {
      const matches = this.componentCache.filter(c => c.includes(type));
      if (matches.length > 0) {
        components.push({
          type: type.toLowerCase(),
          variants: matches,
          usedIn: [],
          props: []
        });
      }
    }

    // Detect data display patterns
    if (this.componentCache.some(c => c.includes('Table') || c.includes('DataTable'))) {
      dataDisplay.push({
        type: 'table',
        usedFor: ['bookings', 'transactions', 'users'],
        features: ['pagination', 'sorting', 'filtering']
      });
    }

    if (this.componentCache.some(c => c.includes('Card'))) {
      dataDisplay.push({
        type: 'cards',
        usedFor: ['metrics', 'summaries'],
        features: []
      });
    }

    // Extract navigation
    const navigation: NavigationPattern = {
      type: layouts.some(l => l.structure.includes('sidebar')) ? 'sidebar' : 'topnav',
      levels: 2,
      items: this.routeCache.slice(0, 10).map(route => ({
        label: route.split('/').pop()?.replace(/-/g, ' ') || route,
        route
      }))
    };

    return {
      layouts,
      components,
      navigation,
      dataDisplay
    };
  }

  /**
   * Generate UX recommendations based on analysis
   */
  private generateRecommendations(
    domain: UXContextManifest['domain'],
    audiences: AudiencePersona[],
    workflows: Workflow[],
    patterns: ExistingPatterns
  ): UXRecommendation[] {
    const recommendations: UXRecommendation[] = [];

    // Check for missing patterns
    if (domain.industry === 'hospitality') {
      if (!patterns.components.some(c => c.type === 'chart')) {
        recommendations.push({
          type: 'component',
          priority: 'medium',
          title: 'Add Occupancy Charts',
          description: 'Visual occupancy trends help managers make decisions quickly',
          rationale: 'Hospitality managers rely heavily on visual occupancy data for pricing and staffing decisions'
        });
      }

      if (audiences.some(a => a.priority === 'primary' && a.frequency === 'daily')) {
        recommendations.push({
          type: 'workflow',
          priority: 'high',
          title: 'Optimize Daily Operations View',
          description: 'Create a single-screen view for all daily operations',
          rationale: 'Primary users access the system daily and need quick access to arrivals, departures, and tasks'
        });
      }
    }

    // General recommendations
    if (patterns.layouts.length === 0) {
      recommendations.push({
        type: 'layout',
        priority: 'high',
        title: 'Establish Consistent Layout',
        description: 'Define a consistent layout pattern across all pages',
        rationale: 'Consistent layouts reduce cognitive load and improve user efficiency'
      });
    }

    if (workflows.filter(w => w.frequency === 'critical').length > 3) {
      recommendations.push({
        type: 'hierarchy',
        priority: 'high',
        title: 'Prioritize Critical Workflows',
        description: 'Too many critical workflows detected - consider prioritization',
        rationale: 'When everything is critical, nothing is. Focus on the top 2-3 most important workflows'
      });
    }

    return recommendations;
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(
    domain: UXContextManifest['domain'],
    audiences: AudiencePersona[],
    workflows: Workflow[]
  ): number {
    let confidence = 0;

    // Domain confidence (40%)
    confidence += domain.confidence * 0.4;

    // Audience confidence (30%)
    const audienceConfidence = audiences.length > 0
      ? Math.min(audiences.filter(a => a.detectedFrom.length > 2).length / 3, 1)
      : 0;
    confidence += audienceConfidence * 0.3;

    // Workflow confidence (30%)
    const workflowConfidence = workflows.length > 0
      ? Math.min(workflows.length / 5, 1)
      : 0;
    confidence += workflowConfidence * 0.3;

    return Math.round(confidence * 100) / 100;
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Scan a codebase and return UX context
 */
export async function scanUXContext(repoPath: string): Promise<UXContextManifest> {
  const scanner = new UXContextScanner(repoPath);
  return scanner.scan();
}

/**
 * Quick scan - returns just the domain and primary audience
 */
export async function quickScan(repoPath: string): Promise<{
  domain: Industry;
  primaryAudience: string;
  confidence: number;
}> {
  const manifest = await scanUXContext(repoPath);
  return {
    domain: manifest.domain.industry,
    primaryAudience: manifest.audiences[0]?.name || 'Unknown',
    confidence: manifest.confidence
  };
}

// =============================================================================
// CONTEXT-AWARE DESIGN INTEGRATION
// =============================================================================

/**
 * Generate design recommendations based on UX context
 * This helps guide the inspiration module to make industry-appropriate choices
 */
export function getDesignGuidelines(manifest: UXContextManifest): {
  colorTemperature: 'warm' | 'neutral' | 'cool';
  informationDensity: 'low' | 'medium' | 'high';
  primaryInteractionMode: 'read' | 'input' | 'mixed';
  recommendedInspiration: string[];
  avoidInspiration: string[];
  componentPriorities: string[];
  layoutRecommendation: string;
} {
  const industry = manifest.domain.industry;
  const primaryAudience = manifest.audiences[0];
  const criticalWorkflows = manifest.workflows.filter(w => w.frequency === 'critical' || w.frequency === 'frequent');

  // Industry-specific design guidelines
  const industryGuidelines: Record<Industry, {
    colorTemperature: 'warm' | 'neutral' | 'cool';
    informationDensity: 'low' | 'medium' | 'high';
    recommendedInspiration: string[];
    avoidInspiration: string[];
  }> = {
    hospitality: {
      colorTemperature: 'warm',
      informationDensity: 'medium',
      recommendedInspiration: ['airbnb', 'booking.com', 'marriott', 'linear'],
      avoidInspiration: ['github', 'stripe-docs']
    },
    ecommerce: {
      colorTemperature: 'neutral',
      informationDensity: 'high',
      recommendedInspiration: ['shopify', 'amazon', 'stripe'],
      avoidInspiration: ['linear', 'notion']
    },
    saas: {
      colorTemperature: 'cool',
      informationDensity: 'medium',
      recommendedInspiration: ['linear', 'notion', 'stripe', 'vercel'],
      avoidInspiration: ['airbnb', 'booking.com']
    },
    healthcare: {
      colorTemperature: 'cool',
      informationDensity: 'medium',
      recommendedInspiration: ['apple', 'stripe'],
      avoidInspiration: ['discord', 'spotify']
    },
    fintech: {
      colorTemperature: 'cool',
      informationDensity: 'high',
      recommendedInspiration: ['stripe', 'revolut', 'mercury'],
      avoidInspiration: ['airbnb', 'discord']
    },
    education: {
      colorTemperature: 'warm',
      informationDensity: 'medium',
      recommendedInspiration: ['notion', 'coursera', 'duolingo'],
      avoidInspiration: ['github', 'stripe']
    },
    social: {
      colorTemperature: 'neutral',
      informationDensity: 'low',
      recommendedInspiration: ['discord', 'twitter', 'instagram'],
      avoidInspiration: ['stripe', 'linear']
    },
    productivity: {
      colorTemperature: 'neutral',
      informationDensity: 'medium',
      recommendedInspiration: ['linear', 'notion', 'todoist', 'figma'],
      avoidInspiration: ['airbnb', 'instagram']
    },
    'developer-tools': {
      colorTemperature: 'cool',
      informationDensity: 'high',
      recommendedInspiration: ['github', 'vercel', 'linear', 'raycast'],
      avoidInspiration: ['airbnb', 'instagram']
    },
    marketing: {
      colorTemperature: 'warm',
      informationDensity: 'medium',
      recommendedInspiration: ['hubspot', 'mailchimp', 'intercom'],
      avoidInspiration: ['github', 'stripe']
    },
    crm: {
      colorTemperature: 'neutral',
      informationDensity: 'high',
      recommendedInspiration: ['salesforce', 'hubspot', 'linear'],
      avoidInspiration: ['instagram', 'discord']
    },
    unknown: {
      colorTemperature: 'neutral',
      informationDensity: 'medium',
      recommendedInspiration: ['linear', 'stripe', 'notion'],
      avoidInspiration: []
    }
  };

  const guidelines = industryGuidelines[industry];

  // Determine primary interaction mode based on workflows
  const formWorkflows = criticalWorkflows.filter(w =>
    w.relatedComponents.some(c => c.toLowerCase().includes('form'))
  );
  const listWorkflows = criticalWorkflows.filter(w =>
    w.relatedComponents.some(c =>
      c.toLowerCase().includes('table') ||
      c.toLowerCase().includes('list') ||
      c.toLowerCase().includes('grid')
    )
  );

  let primaryInteractionMode: 'read' | 'input' | 'mixed' = 'mixed';
  if (formWorkflows.length > listWorkflows.length * 1.5) {
    primaryInteractionMode = 'input';
  } else if (listWorkflows.length > formWorkflows.length * 1.5) {
    primaryInteractionMode = 'read';
  }

  // Component priorities based on detected patterns
  const componentPriorities: string[] = [];
  manifest.patterns.components
    .sort((a, b) => b.variants.length - a.variants.length)
    .slice(0, 5)
    .forEach(c => componentPriorities.push(c.type));

  // Layout recommendation
  let layoutRecommendation = 'standard';
  if (primaryAudience?.frequency === 'daily' && primaryAudience?.techSavviness !== 'low') {
    layoutRecommendation = 'power-user'; // Dense sidebar, keyboard shortcuts
  } else if (primaryAudience?.techSavviness === 'low') {
    layoutRecommendation = 'guided'; // Simpler navigation, more whitespace
  }

  return {
    colorTemperature: guidelines.colorTemperature,
    informationDensity: guidelines.informationDensity,
    primaryInteractionMode,
    recommendedInspiration: guidelines.recommendedInspiration,
    avoidInspiration: guidelines.avoidInspiration,
    componentPriorities,
    layoutRecommendation
  };
}

/**
 * Create a complete context package for the Taste Engine
 * Combines UX context with design guidelines for context-aware design generation
 */
export interface TasteEngineContext {
  manifest: UXContextManifest;
  guidelines: ReturnType<typeof getDesignGuidelines>;
  summary: {
    industry: Industry;
    primaryAudience: string;
    criticalWorkflows: string[];
    designApproach: string;
  };
}

export async function createTasteEngineContext(repoPath: string): Promise<TasteEngineContext> {
  const scanner = new UXContextScanner(repoPath);
  const manifest = await scanner.scan();
  const guidelines = getDesignGuidelines(manifest);

  // Generate human-readable summary
  const criticalWorkflows = manifest.workflows
    .filter(w => w.frequency === 'critical' || w.frequency === 'frequent')
    .map(w => w.name);

  let designApproach = '';
  if (manifest.domain.industry === 'hospitality') {
    designApproach = 'Warm, professional interface optimized for quick operations. ';
    designApproach += 'Prioritize scannable data tables, fast booking flows, and real-time status displays. ';
    designApproach += 'Use warm accents to create a welcoming feel while maintaining operational efficiency.';
  } else if (manifest.domain.industry === 'saas') {
    designApproach = 'Clean, modern interface with focus on productivity. ';
    designApproach += 'Emphasize keyboard shortcuts, dense information display, and quick actions.';
  } else {
    designApproach = `${guidelines.colorTemperature} color palette with ${guidelines.informationDensity} information density. `;
    designApproach += `Optimized for ${guidelines.primaryInteractionMode} interactions.`;
  }

  return {
    manifest,
    guidelines,
    summary: {
      industry: manifest.domain.industry,
      primaryAudience: manifest.audiences[0]?.name || 'General User',
      criticalWorkflows,
      designApproach
    }
  };
}

export default UXContextScanner;
