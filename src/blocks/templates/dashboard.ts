/**
 * Dashboard Block Templates
 *
 * Template generators for dashboard blocks (sidebar, data-table, metric-cards, etc.)
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
  getGridClasses,
} from './base';

// =============================================================================
// SIDEBAR TEMPLATES
// =============================================================================

export function generateSidebarTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, inspirationProfile: profile, componentLibrary } = input;
  const componentName = generateComponentName('sidebar', variant);

  let code: string;
  const dependencies: string[] = ['lucide-react'];

  switch (variant) {
    case 'collapsible':
      code = generateSidebarCollapsible(tuners, profile, componentLibrary);
      break;
    case 'mini':
      code = generateSidebarMini(tuners, profile, componentLibrary);
      break;
    case 'with-sections':
      code = generateSidebarWithSections(tuners, profile, componentLibrary);
      break;
    default:
      code = generateSidebarCollapsible(tuners, profile, componentLibrary);
  }

  if (componentLibrary === 'shadcn') {
    dependencies.push('@/components/ui/button', '@/components/ui/tooltip');
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies,
    slots: {},
    variantUsed: variant,
    explanation: `Sidebar with ${variant} behavior.`,
  };
}

function generateSidebarCollapsible(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const buttonImport = library === 'shadcn'
    ? 'import { Button } from "@/components/ui/button";'
    : '';
  const tooltipImport = library === 'shadcn'
    ? 'import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";'
    : '';

  return `"use client";

import { useState } from "react";
${getLucideImport(['Home', 'Users', 'FileText', 'Settings', 'BarChart2', 'ChevronLeft', 'ChevronRight', 'LogOut'])}
${buttonImport}
${tooltipImport}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarCollapsibleProps {
  items?: NavItem[];
  onNavigate?: (href: string) => void;
}

const defaultItems: NavItem[] = [
  { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/", active: true },
  { icon: <Users className="h-5 w-5" />, label: "Users", href: "/users" },
  { icon: <FileText className="h-5 w-5" />, label: "Documents", href: "/documents" },
  { icon: <BarChart2 className="h-5 w-5" />, label: "Analytics", href: "/analytics" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
];

export function SidebarCollapsible({
  items = defaultItems,
  onNavigate,
}: SidebarCollapsibleProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    ${library === 'shadcn' ? '<TooltipProvider>' : ''}
    <aside
      className={\`relative h-screen border-r bg-card transition-all duration-300 \${
        collapsed ? 'w-16' : 'w-64'
      }\`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background flex items-center justify-center ${getMotionClasses(tuners.motion)}"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          T
        </div>
        {!collapsed && (
          <span className="ml-3 font-semibold text-foreground">
            Dashboard
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {items.map((item, i) => (
          ${library === 'shadcn' ? `<Tooltip key={i} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={\`w-full justify-start \${collapsed ? 'px-2' : ''}\`}
                onClick={() => onNavigate?.(item.href)}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>` : `<button
            key={i}
            onClick={() => onNavigate?.(item.href)}
            className={\`w-full flex items-center px-3 py-2 ${getBorderRadiusClasses(profile)} ${getMotionClasses(tuners.motion)} \${
              item.active
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }\`}
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </button>`}
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t">
        ${library === 'shadcn' ? `<Button variant="ghost" className={\`w-full justify-start text-muted-foreground \${collapsed ? 'px-2' : ''}\`}>
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Log out</span>}
        </Button>` : `<button className={\`w-full flex items-center px-3 py-2 ${getBorderRadiusClasses(profile)} text-muted-foreground hover:bg-muted hover:text-foreground ${getMotionClasses(tuners.motion)}\`}>
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Log out</span>}
        </button>`}
      </div>
    </aside>
    ${library === 'shadcn' ? '</TooltipProvider>' : ''}
  );
}
`;
}

function generateSidebarMini(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  return `"use client";

${getLucideImport(['Home', 'Users', 'FileText', 'Settings', 'BarChart2'])}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarMiniProps {
  items?: NavItem[];
  onNavigate?: (href: string) => void;
}

const defaultItems: NavItem[] = [
  { icon: <Home className="h-5 w-5" />, label: "Home", href: "/", active: true },
  { icon: <Users className="h-5 w-5" />, label: "Users", href: "/users" },
  { icon: <FileText className="h-5 w-5" />, label: "Files", href: "/files" },
  { icon: <BarChart2 className="h-5 w-5" />, label: "Stats", href: "/stats" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
];

export function SidebarMini({
  items = defaultItems,
  onNavigate,
}: SidebarMiniProps) {
  return (
    <aside className="h-screen w-16 border-r bg-card flex flex-col items-center py-4">
      {/* Logo */}
      <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold mb-6">
        T
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate?.(item.href)}
            title={item.label}
            className={\`h-10 w-10 flex items-center justify-center rounded-lg ${getMotionClasses(tuners.motion)} \${
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }\`}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </aside>
  );
}
`;
}

function generateSidebarWithSections(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  return `"use client";

${getLucideImport(['Home', 'Users', 'FileText', 'Settings', 'BarChart2', 'Inbox', 'Calendar', 'HelpCircle'])}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarWithSectionsProps {
  sections?: NavSection[];
  onNavigate?: (href: string) => void;
}

const defaultSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/", active: true },
      { icon: <Inbox className="h-5 w-5" />, label: "Inbox", href: "/inbox" },
      { icon: <Calendar className="h-5 w-5" />, label: "Calendar", href: "/calendar" },
    ],
  },
  {
    title: "Management",
    items: [
      { icon: <Users className="h-5 w-5" />, label: "Team", href: "/team" },
      { icon: <FileText className="h-5 w-5" />, label: "Documents", href: "/documents" },
      { icon: <BarChart2 className="h-5 w-5" />, label: "Reports", href: "/reports" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
      { icon: <HelpCircle className="h-5 w-5" />, label: "Help", href: "/help" },
    ],
  },
];

export function SidebarWithSections({
  sections = defaultSections,
  onNavigate,
}: SidebarWithSectionsProps) {
  return (
    <aside className="h-screen w-64 border-r bg-card overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          T
        </div>
        <span className="ml-3 font-semibold text-foreground">Dashboard</span>
      </div>

      {/* Sections */}
      <div className="p-4 space-y-6">
        {sections.map((section, i) => (
          <div key={i}>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item, j) => (
                <button
                  key={j}
                  onClick={() => onNavigate?.(item.href)}
                  className={\`w-full flex items-center px-3 py-2 ${getBorderRadiusClasses(profile)} text-sm ${getMotionClasses(tuners.motion)} \${
                    item.active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }\`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
`;
}

// =============================================================================
// METRIC CARDS TEMPLATES
// =============================================================================

export function generateMetricCardsTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, inspirationProfile: profile, componentLibrary } = input;
  const componentName = generateComponentName('metric-cards', variant);

  let code: string;
  const dependencies: string[] = ['lucide-react'];

  switch (variant) {
    case 'simple':
      code = generateMetricCardsSimple(tuners, profile, componentLibrary);
      break;
    case 'with-trend':
      code = generateMetricCardsWithTrend(tuners, profile, componentLibrary);
      break;
    case 'with-sparkline':
      code = generateMetricCardsWithSparkline(tuners, profile, componentLibrary);
      dependencies.push('recharts');
      break;
    default:
      code = generateMetricCardsSimple(tuners, profile, componentLibrary);
  }

  if (componentLibrary === 'shadcn') {
    dependencies.push('@/components/ui/card');
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies,
    slots: {},
    variantUsed: variant,
    explanation: `Metric cards with ${variant} display style.`,
  };
}

function generateMetricCardsSimple(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const cardImport = library === 'shadcn'
    ? 'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";'
    : '';

  return `${getLucideImport(['Users', 'DollarSign', 'ShoppingCart', 'TrendingUp'])}
${cardImport}

interface Metric {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface MetricCardsSimpleProps {
  metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
  { title: "Total Users", value: "12,345", icon: <Users className="h-5 w-5" /> },
  { title: "Revenue", value: "$45,678", icon: <DollarSign className="h-5 w-5" /> },
  { title: "Orders", value: "1,234", icon: <ShoppingCart className="h-5 w-5" /> },
  { title: "Growth", value: "+23%", icon: <TrendingUp className="h-5 w-5" /> },
];

export function MetricCardsSimple({
  metrics = defaultMetrics,
}: MetricCardsSimpleProps) {
  return (
    <div className="${getGridClasses({ sm: 2, md: 2, lg: 4 }, getSpacingClasses(tuners.density, 'component'))}">
      {metrics.map((metric, i) => (
        ${library === 'shadcn' ? `<Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="text-muted-foreground">{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>` : `<div key={i} className="${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card ${getShadowClasses(profile)}">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
            <div className="text-muted-foreground">{metric.icon}</div>
          </div>
          <div className="text-2xl font-bold text-foreground">{metric.value}</div>
        </div>`}
      ))}
    </div>
  );
}
`;
}

function generateMetricCardsWithTrend(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const cardImport = library === 'shadcn'
    ? 'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";'
    : '';

  return `${getLucideImport(['Users', 'DollarSign', 'ShoppingCart', 'TrendingUp', 'TrendingDown'])}
${cardImport}

interface Metric {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
}

interface MetricCardsWithTrendProps {
  metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
  { title: "Total Users", value: "12,345", change: 12.5, changeLabel: "from last month", icon: <Users className="h-5 w-5" /> },
  { title: "Revenue", value: "$45,678", change: 8.2, changeLabel: "from last month", icon: <DollarSign className="h-5 w-5" /> },
  { title: "Orders", value: "1,234", change: -2.4, changeLabel: "from last week", icon: <ShoppingCart className="h-5 w-5" /> },
  { title: "Conversion", value: "3.2%", change: 0.8, changeLabel: "from yesterday", icon: <TrendingUp className="h-5 w-5" /> },
];

export function MetricCardsWithTrend({
  metrics = defaultMetrics,
}: MetricCardsWithTrendProps) {
  return (
    <div className="${getGridClasses({ sm: 2, md: 2, lg: 4 }, getSpacingClasses(tuners.density, 'component'))}">
      {metrics.map((metric, i) => (
        ${library === 'shadcn' ? `<Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="text-muted-foreground">{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={\`inline-flex items-center \${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}\`}>
                {metric.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </span>
              {' '}{metric.changeLabel}
            </p>
          </CardContent>
        </Card>` : `<div key={i} className="${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card ${getShadowClasses(profile)}">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
            <div className="text-muted-foreground">{metric.icon}</div>
          </div>
          <div className="text-2xl font-bold text-foreground">{metric.value}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className={\`inline-flex items-center \${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}\`}>
              {metric.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {metric.change >= 0 ? '+' : ''}{metric.change}%
            </span>
            {' '}{metric.changeLabel}
          </p>
        </div>`}
      ))}
    </div>
  );
}
`;
}

function generateMetricCardsWithSparkline(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const cardImport = library === 'shadcn'
    ? 'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";'
    : '';

  return `${getLucideImport(['Users', 'DollarSign', 'TrendingUp'])}
${cardImport}
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Metric {
  title: string;
  value: string;
  change: number;
  data: { value: number }[];
  icon: React.ReactNode;
}

interface MetricCardsWithSparklineProps {
  metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
  {
    title: "Total Users",
    value: "12,345",
    change: 12.5,
    data: [{ value: 10 }, { value: 15 }, { value: 12 }, { value: 18 }, { value: 22 }, { value: 20 }, { value: 25 }],
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: 8.2,
    data: [{ value: 30 }, { value: 35 }, { value: 32 }, { value: 40 }, { value: 38 }, { value: 45 }, { value: 50 }],
    icon: <DollarSign className="h-5 w-5" />,
  },
];

export function MetricCardsWithSparkline({
  metrics = defaultMetrics,
}: MetricCardsWithSparklineProps) {
  return (
    <div className="${getGridClasses({ sm: 1, md: 2 }, getSpacingClasses(tuners.density, 'component'))}">
      {metrics.map((metric, i) => (
        ${library === 'shadcn' ? `<Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="text-2xl font-bold mt-1">{metric.value}</div>
              <p className="text-xs mt-1">
                <span className={\`\${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}\`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
                {' '}from last period
              </p>
            </div>
            <div className="text-muted-foreground">{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>` : `<div key={i} className="${getSpacingClasses(tuners.density, 'card')} ${getBorderRadiusClasses(profile)} border bg-card ${getShadowClasses(profile)}">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
              <div className="text-2xl font-bold text-foreground mt-1">{metric.value}</div>
              <p className="text-xs mt-1">
                <span className={\`\${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}\`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
                {' '}from last period
              </p>
            </div>
            <div className="text-muted-foreground">{metric.icon}</div>
          </div>
          <div className="h-16 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metric.data}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>`}
      ))}
    </div>
  );
}
`;
}

// =============================================================================
// DATA TABLE TEMPLATES
// =============================================================================

export function generateDataTableTemplate(
  input: BlockGenerationInput
): BlockGenerationOutput {
  const { variant, tuners, inspirationProfile: profile, componentLibrary } = input;
  const componentName = generateComponentName('data-table', variant);

  const code = generateDataTableBasic(tuners, profile, componentLibrary);
  const dependencies: string[] = ['lucide-react'];

  if (componentLibrary === 'shadcn') {
    dependencies.push(
      '@/components/ui/table',
      '@/components/ui/button',
      '@/components/ui/badge',
      '@/components/ui/dropdown-menu'
    );
  }

  return {
    code,
    componentName,
    fileName: generateFileName(componentName),
    dependencies,
    slots: {},
    variantUsed: variant,
    explanation: `Data table with ${variant} functionality.`,
  };
}

function generateDataTableBasic(
  tuners: AppliedTuners,
  profile?: InspirationProfile,
  library?: string
): string {
  const imports = library === 'shadcn'
    ? `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";`
    : '';

  return `${getLucideImport(['MoreHorizontal', 'ChevronLeft', 'ChevronRight'])}
${imports}

interface DataRow {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
}

interface DataTableBasicProps {
  data?: DataRow[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const defaultData: DataRow[] = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "active", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "active", role: "User" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", status: "pending", role: "User" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", status: "inactive", role: "Editor" },
];

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

export function DataTableBasic({
  data = defaultData,
  onEdit,
  onDelete,
}: DataTableBasicProps) {
  return (
    <div className="${getBorderRadiusClasses(profile)} border overflow-hidden">
      ${library === 'shadcn' ? `<Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[row.status]}>
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(row.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(row.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>` : `<table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row) => (
            <tr key={row.id} className="${getMotionClasses(tuners.motion)} hover:bg-muted/50">
              <td className="px-4 py-3 text-sm font-medium text-foreground">{row.name}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{row.email}</td>
              <td className="px-4 py-3">
                <span className={\`inline-flex px-2 py-1 text-xs font-medium rounded-full \${statusColors[row.status]}\`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{row.role}</td>
              <td className="px-4 py-3">
                <button className="p-1 rounded hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>`}

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        <span className="text-sm text-muted-foreground">
          Showing 1-{data.length} of {data.length} results
        </span>
        <div className="flex items-center gap-2">
          ${library === 'shadcn' ? `<Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>` : `<button className="p-2 rounded border bg-background text-muted-foreground" disabled>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="p-2 rounded border bg-background text-muted-foreground" disabled>
            <ChevronRight className="h-4 w-4" />
          </button>`}
        </div>
      </div>
    </div>
  );
}
`;
}

// =============================================================================
// EXPORT ALL DASHBOARD TEMPLATES
// =============================================================================

export const dashboardTemplates = {
  sidebar: generateSidebarTemplate,
  'metric-cards': generateMetricCardsTemplate,
  'data-table': generateDataTableTemplate,
};
