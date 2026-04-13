// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string | number
  disabled?: boolean
  external?: boolean
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

// ─── KPI / Stats ─────────────────────────────────────────────────────────────

export interface StatCard {
  id: string
  title: string
  value: string
  rawValue: number
  change: number
  changeLabel: string
  icon: string
  trend: "up" | "down" | "neutral"
  sparkline: number[]
  prefix?: string
  suffix?: string
}

// ─── Charts ──────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  date: string
  [key: string]: string | number
}

export interface DonutSegment {
  name: string
  value: number
  color: string
}

// ─── Transactions ────────────────────────────────────────────────────────────

export type TransactionStatus = "completed" | "pending" | "failed" | "refunded"
export type TransactionCategory =
  | "software"
  | "marketing"
  | "infrastructure"
  | "design"
  | "consulting"
  | "other"

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  status: TransactionStatus
  category: TransactionCategory
  customer: string
  customerEmail: string
  method: "card" | "wire" | "ach" | "crypto"
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "editor" | "viewer" | "billing"
export type UserStatus = "active" | "inactive" | "pending" | "suspended"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  joinedAt: string
  lastSeen: string
  plan: "starter" | "pro" | "enterprise"
  revenue: number
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface PageAnalytics extends Record<string, string | number> {
  path: string
  title: string
  views: number
  uniqueVisitors: number
  avgDuration: number
  bounceRate: number
  change: number
}

export interface TrafficSource {
  source: string
  visitors: number
  percentage: number
  change: number
}

export interface DailyAnalytics extends Record<string, string | number> {
  date: string
  pageViews: number
  uniqueVisitors: number
  sessions: number
  bounceRate: number
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export type ActivityType =
  | "user_signup"
  | "purchase"
  | "refund"
  | "plan_upgrade"
  | "plan_downgrade"
  | "export"
  | "alert"
  | "deploy"
  | "comment"

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  metadata?: Record<string, string | number>
}

// ─── Accounting Types ─────────────────────────────────────────────────────────

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense"
export type JournalEntryStatus = "draft" | "posted" | "reconciled" | "adjusting"

export interface Account {
  id: string
  code: string
  name: string
  type: AccountType
  balance: number
  parentId?: string
  isActive: boolean
}

export interface JournalEntry {
  id: string
  date: string
  reference: string
  description: string
  debitAccount: string
  creditAccount: string
  debitAmount: number
  creditAmount: number
  status: JournalEntryStatus
  createdBy: string
  createdAt: string
}

export interface TrialBalanceEntry {
  accountCode: string
  accountName: string
  debit: number
  credit: number
  balance: number
}

export interface AgedReceivable {
  customer: string
  invoiceRef: string
  amount: number
  daysOutstanding: number
  ageGroup: "0-30" | "31-60" | "61-90" | "90+"
}

export interface CashFlowItem {
  month: string
  operating: number
  investing: number
  financing: number
  netCashFlow: number
  cumulativeCash: number
}

export interface ExpenseCategory {
  name: string
  value: number
  color: string
  percentage: number
}

export interface PLItem extends Record<string, string | number> {
  month: string
  revenue: number
  cogs: number
  grossProfit: number
  opex: number
  netIncome: number
}

// ─── Global App State ─────────────────────────────────────────────────────────

export interface AppState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  commandMenuOpen: boolean
  setCommandMenuOpen: (open: boolean) => void
}
