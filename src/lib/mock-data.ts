import { subDays, subMonths, format, subHours, subMinutes } from "date-fns"
import type {
  Transaction,
  User,
  ActivityItem,
  DailyAnalytics,
  PageAnalytics,
  TrafficSource,
  DonutSegment,
  JournalEntry,
  Account,
  TrialBalanceEntry,
  AgedReceivable,
  CashFlowItem,
  ExpenseCategory,
  PLItem,
} from "@/types"

// ─── Seeded random for reproducibility ────────────────────────────────────────

function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rng = seededRng(42)
const rand = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
const randFloat = (min: number, max: number) => Number((rng() * (max - min) + min).toFixed(2))
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)]

// ─── P&L time series (12 months) ──────────────────────────────────────────────

export function generatePLData(): PLItem[] {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const baseRevenue = [24000, 26500, 23200, 28800, 31200, 29500, 33600, 35400, 32100, 38200, 41500, 42800]
  const baseCOGS = [9600, 10600, 9280, 11520, 12480, 11800, 13440, 14160, 12840, 15280, 16600, 17120]

  return months.map((month, i) => {
    const revenue = baseRevenue[i] + rand(-800, 800)
    const cogs = baseCOGS[i] + rand(-400, 400)
    const grossProfit = revenue - cogs
    const opex = Math.floor(grossProfit * 0.65) + rand(-500, 500)
    const netIncome = grossProfit - opex

    return {
      month,
      revenue,
      cogs,
      grossProfit,
      opex,
      netIncome,
    }
  })
}

// ─── Daily analytics (30 days) ────────────────────────────────────────────────

export function generateDailyAnalytics(): DailyAnalytics[] {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const base = 3200 + i * 180
    return {
      date: format(date, "MMM d"),
      pageViews: base + rand(-400, 600),
      uniqueVisitors: Math.floor((base + rand(-400, 600)) * 0.68),
      sessions: Math.floor((base + rand(-400, 600)) * 0.82),
      bounceRate: randFloat(32, 58),
    }
  })
}

// ─── Donut chart — expenses by category ──────────────────────────────────────

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { name: "Staff Costs", value: 18420, color: "#3b82f6", percentage: 45.2 },
  { name: "Office & Admin", value: 6830, color: "#10b981", percentage: 16.8 },
  { name: "Marketing", value: 5940, color: "#f59e0b", percentage: 14.6 },
  { name: "Travel", value: 4280, color: "#8b5cf6", percentage: 10.5 },
  { name: "Professional Services", value: 3210, color: "#06b6d4", percentage: 7.9 },
  { name: "IT & Software", value: 2040, color: "#ef4444", percentage: 5.0 },
]

// ─── Transactions ─────────────────────────────────────────────────────────────

const CUSTOMERS = [
  { name: "Acme Corporation", email: "billing@acme.io" },
  { name: "Globex Systems", email: "finance@globex.com" },
  { name: "Initech LLC", email: "accounts@initech.co" },
  { name: "Umbrella Corp", email: "payments@umbrella.dev" },
  { name: "Weyland-Yutani", email: "ar@weyland.tech" },
  { name: "Oscorp Industries", email: "billing@oscorp.io" },
  { name: "Stark Enterprises", email: "ap@stark.com" },
  { name: "Wayne Enterprises", email: "finance@wayne.co" },
  { name: "Cyberdyne Systems", email: "billing@cyberdyne.ai" },
  { name: "Tyrell Corporation", email: "accounts@tyrell.io" },
  { name: "Soylent Corp", email: "billing@soylent.dev" },
  { name: "Nakatomi Trading", email: "finance@nakatomi.jp" },
  { name: "Rekall Industries", email: "ar@rekall.io" },
  { name: "Vandelay Industries", email: "billing@vandelay.com" },
  { name: "Dunder Mifflin", email: "accounts@dundermifflin.co" },
]

const DESCRIPTIONS = [
  "Enterprise Annual License",
  "Professional Seat × 12",
  "Infrastructure Top-up",
  "API Overage Charges",
  "Custom Integration Package",
  "Support Tier Upgrade",
  "White-label License",
  "Onboarding & Setup",
  "Analytics Pro Module",
  "Security Compliance Add-on",
  "SSO Configuration",
  "Data Export Tokens",
  "Priority Support Bundle",
  "Team Workspace (50 seats)",
  "Marketplace Commission",
]

const CATEGORIES: Transaction["category"][] = [
  "software", "software", "infrastructure", "marketing",
  "design", "consulting", "other",
]
const STATUSES: Transaction["status"][] = [
  "completed", "completed", "completed", "pending", "failed", "refunded",
]
const METHODS: Transaction["method"][] = ["card", "wire", "ach", "card", "card"]

export function generateTransactions(count = 50): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const customer = pick(CUSTOMERS)
    const daysAgo = rand(0, 60)
    return {
      id: `TXN-${String(10000 + i).padStart(6, "0")}`,
      date: format(subDays(new Date(), daysAgo), "yyyy-MM-dd"),
      description: pick(DESCRIPTIONS),
      amount: randFloat(299, 24999),
      status: pick(STATUSES),
      category: pick(CATEGORIES),
      customer: customer.name,
      customerEmail: customer.email,
      method: pick(METHODS),
    }
  })
}

// ─── Users ────────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Alex", "Sarah", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Blake",
  "Avery", "Cameron", "Sage", "Devon", "Kendall", "Skyler", "Peyton",
  "Harper", "Finley", "Rowan", "Phoenix", "River",
]
const LAST_NAMES = [
  "Chen", "Park", "Williams", "Johnson", "Martinez", "Thompson", "Garcia",
  "Anderson", "Wilson", "Moore", "Taylor", "Jackson", "White", "Harris",
  "Clark", "Lewis", "Robinson", "Walker", "Hall", "Allen",
]
const DOMAINS = ["acme.io", "globex.com", "initech.co", "stark.com", "wayne.co"]
const ROLES: User["role"][] = ["admin", "editor", "viewer", "billing"]
const STATUSES_USER: User["status"][] = ["active", "active", "active", "inactive", "pending"]
const PLANS: User["plan"][] = ["starter", "pro", "pro", "enterprise"]

export function generateUsers(count = 30): User[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const domain = pick(DOMAINS)
    return {
      id: `USR-${String(1000 + i).padStart(5, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
      role: pick(ROLES),
      status: pick(STATUSES_USER),
      joinedAt: format(subMonths(new Date(), rand(1, 24)), "yyyy-MM-dd"),
      lastSeen: format(subHours(new Date(), rand(0, 168)), "yyyy-MM-dd'T'HH:mm:ss"),
      plan: pick(PLANS),
      revenue: randFloat(500, 48000),
    }
  })
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export function generateActivityFeed(count = 12): ActivityItem[] {
  const events: Array<{
    type: ActivityItem["type"]
    title: string
    desc: string
  }> = [
    { type: "user_signup", title: "New user registered", desc: "alex.chen@acme.io joined Pro plan" },
    { type: "purchase", title: "New purchase", desc: "Globex Systems upgraded to Enterprise — $12,400/yr" },
    { type: "plan_upgrade", title: "Plan upgraded", desc: "Initech LLC moved from Starter → Pro" },
    { type: "refund", title: "Refund processed", desc: "$2,399 refunded to Oscorp Industries" },
    { type: "deploy", title: "Deployment succeeded", desc: "v4.2.1 deployed to production — 0 errors" },
    { type: "alert", title: "Anomaly detected", desc: "Unusual login from IP 185.220.x.x — blocked" },
    { type: "purchase", title: "New purchase", desc: "Weyland-Yutani signed Enterprise — $48,000/yr" },
    { type: "export", title: "Data exported", desc: "Full transaction export by billing@wayne.co" },
    { type: "user_signup", title: "New user registered", desc: "morgan.taylor@cyberdyne.ai joined Starter" },
    { type: "plan_upgrade", title: "Plan upgraded", desc: "Nakatomi Trading upgraded to Enterprise" },
    { type: "comment", title: "Support ticket resolved", desc: "Ticket #8842 closed — API latency issue" },
    { type: "plan_downgrade", title: "Plan downgraded", desc: "Rekall Industries moved to Starter plan" },
  ]

  return events.slice(0, count).map((e, i) => ({
    id: `ACT-${i + 1}`,
    type: e.type,
    title: e.title,
    description: e.desc,
    timestamp: format(subMinutes(new Date(), i * 18 + rand(2, 15)), "yyyy-MM-dd'T'HH:mm:ss"),
    user: {
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    },
  }))
}

// ─── Page analytics ──────────────────────────────────────────────────────────

export const PAGE_ANALYTICS: PageAnalytics[] = [
  { path: "/dashboard", title: "Dashboard Overview", views: 24830, uniqueVisitors: 18420, avgDuration: 287, bounceRate: 22.4, change: 12.3 },
  { path: "/analytics", title: "Analytics", views: 18640, uniqueVisitors: 14290, avgDuration: 342, bounceRate: 18.7, change: 28.1 },
  { path: "/settings", title: "Settings", views: 12310, uniqueVisitors: 9840, avgDuration: 198, bounceRate: 31.2, change: -4.3 },
  { path: "/users", title: "User Management", views: 9870, uniqueVisitors: 7620, avgDuration: 412, bounceRate: 15.8, change: 18.9 },
  { path: "/billing", title: "Billing & Plans", views: 7430, uniqueVisitors: 5890, avgDuration: 264, bounceRate: 27.3, change: 6.4 },
  { path: "/reports", title: "Reports", views: 5820, uniqueVisitors: 4710, avgDuration: 518, bounceRate: 11.2, change: 41.7 },
  { path: "/integrations", title: "Integrations", views: 4290, uniqueVisitors: 3480, avgDuration: 334, bounceRate: 24.6, change: 15.2 },
  { path: "/api-keys", title: "API Keys", views: 3140, uniqueVisitors: 2820, avgDuration: 156, bounceRate: 38.9, change: -9.1 },
]

// ─── Traffic sources ──────────────────────────────────────────────────────────

export const TRAFFIC_SOURCES: TrafficSource[] = [
  { source: "Organic Search", visitors: 38420, percentage: 42.3, change: 18.4 },
  { source: "Direct", visitors: 21840, percentage: 24.1, change: 7.2 },
  { source: "Referral", visitors: 14290, percentage: 15.7, change: 32.8 },
  { source: "Social Media", visitors: 9870, percentage: 10.9, change: -3.4 },
  { source: "Email Campaign", visitors: 4680, percentage: 5.2, change: 22.1 },
  { source: "Paid Search", visitors: 1760, percentage: 1.9, change: -11.7 },
]

// ─── Top pages by views (bar chart) ──────────────────────────────────────────

export function generateTopPagesBarData() {
  return PAGE_ANALYTICS.slice(0, 6).map((p) => ({
    page: p.title.replace(" Overview", "").replace(" Management", ""),
    views: p.views,
    visitors: p.uniqueVisitors,
  }))
}

// ─── Accounting Mock Data ─────────────────────────────────────────────────────

export const CHART_OF_ACCOUNTS: Account[] = [
  { id: "1000", code: "1000", name: "Current Account", type: "asset", balance: 124500, isActive: true },
  { id: "1001", code: "1001", name: "Savings Account", type: "asset", balance: 45000, isActive: true },
  { id: "1200", code: "1200", name: "Accounts Receivable", type: "asset", balance: 67200, isActive: true },
  { id: "1300", code: "1300", name: "Inventory", type: "asset", balance: 23400, isActive: true },
  { id: "1500", code: "1500", name: "Office Equipment", type: "asset", balance: 15600, isActive: true },
  { id: "1600", code: "1600", name: "Computer Equipment", type: "asset", balance: 8900, isActive: true },
  { id: "2000", code: "2000", name: "Accounts Payable", type: "liability", balance: 28300, isActive: true },
  { id: "2100", code: "2100", name: "VAT Liability", type: "liability", balance: 12800, isActive: true },
  { id: "2200", code: "2200", name: "PAYE/NI Liability", type: "liability", balance: 8900, isActive: true },
  { id: "3000", code: "3000", name: "Share Capital", type: "equity", balance: 100000, isActive: true },
  { id: "3100", code: "3100", name: "Retained Earnings", type: "equity", balance: 156200, isActive: true },
  { id: "4000", code: "4000", name: "Sales Revenue", type: "revenue", balance: 342800, isActive: true },
  { id: "4100", code: "4100", name: "Consulting Revenue", type: "revenue", balance: 89600, isActive: true },
  { id: "5000", code: "5000", name: "Cost of Goods Sold", type: "expense", balance: 137120, isActive: true },
  { id: "6000", code: "6000", name: "Staff Costs", type: "expense", balance: 156000, isActive: true },
  { id: "6100", code: "6100", name: "Office Rent", type: "expense", balance: 24000, isActive: true },
  { id: "6200", code: "6200", name: "Marketing", type: "expense", balance: 18400, isActive: true },
  { id: "6300", code: "6300", name: "Professional Fees", type: "expense", balance: 12600, isActive: true },
]

const CUSTOMERS_UK = [
  "TechFlow Solutions Ltd", "Digital Dynamics UK", "Innovate Systems", "CloudCore Ltd",
  "DataStream Technologies", "NextGen Solutions", "Apex Digital", "FutureTech Ltd",
  "SmartOps UK", "CyberLogic Systems", "ProActive Solutions", "TechForward Ltd",
  "Digital Edge UK", "InnovateTech", "CloudNine Solutions", "DataBridge Ltd"
]

const DESCRIPTIONS_ACCOUNTING = [
  "Invoice #INV-2401", "Salary Payment - January", "Office Rent - Q1 Payment",
  "Marketing Campaign - Digital Ads", "Professional Consulting Services",
  "Equipment Purchase - Laptops", "Utility Bills - Electricity",
  "Insurance Premium - Business", "VAT Payment to HMRC",
  "Bank Charges", "Travel Expenses - Client Meeting",
  "Software Subscription - Annual", "Stationery Supplies",
  "Telephone & Internet", "Cleaning Services"
]

export function generateJournalEntries(count = 50): JournalEntry[] {
  const statuses: JournalEntry["status"][] = ["posted", "posted", "posted", "draft", "reconciled"]

  return Array.from({ length: count }, (_, i) => {
    const daysAgo = rand(0, 90)
    const amount = randFloat(150, 15000)

    return {
      id: `JE-${String(2024000 + i).padStart(7, "0")}`,
      date: format(subDays(new Date(), daysAgo), "yyyy-MM-dd"),
      reference: `REF-${String(1000 + i).padStart(4, "0")}`,
      description: pick(DESCRIPTIONS_ACCOUNTING),
      debitAccount: pick(CHART_OF_ACCOUNTS.filter(a => a.type === "asset" || a.type === "expense")).code,
      creditAccount: pick(CHART_OF_ACCOUNTS.filter(a => a.type === "liability" || a.type === "revenue")).code,
      debitAmount: amount,
      creditAmount: amount,
      status: pick(statuses),
      createdBy: "Sarah Smith",
      createdAt: format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss"),
    }
  })
}

export function generateTrialBalance(): TrialBalanceEntry[] {
  return CHART_OF_ACCOUNTS.map(account => {
    const isDebitNormal = account.type === "asset" || account.type === "expense"
    return {
      accountCode: account.code,
      accountName: account.name,
      debit: isDebitNormal ? account.balance : 0,
      credit: isDebitNormal ? 0 : account.balance,
      balance: account.balance,
    }
  })
}

export function generateAgedReceivables(): AgedReceivable[] {
  const invoiceRefs = Array.from({ length: 18 }, (_, i) => `INV-24${String(100 + i).padStart(3, "0")}`)

  return invoiceRefs.map((ref, i) => {
    const daysOutstanding = rand(5, 120)
    let ageGroup: AgedReceivable["ageGroup"]
    if (daysOutstanding <= 30) ageGroup = "0-30"
    else if (daysOutstanding <= 60) ageGroup = "31-60"
    else if (daysOutstanding <= 90) ageGroup = "61-90"
    else ageGroup = "90+"

    return {
      customer: pick(CUSTOMERS_UK),
      invoiceRef: ref,
      amount: randFloat(1200, 8500),
      daysOutstanding,
      ageGroup,
    }
  })
}

export function generateCashFlow(): CashFlowItem[] {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
  let cumulativeCash = 98000

  return months.map((month) => {
    const operating = randFloat(15000, 35000)
    const investing = randFloat(-8000, -2000)
    const financing = randFloat(-3000, 5000)
    const netCashFlow = operating + investing + financing
    cumulativeCash += netCashFlow

    return {
      month,
      operating,
      investing,
      financing,
      netCashFlow,
      cumulativeCash,
    }
  })
}

export function generateBookkeepingActivity(count = 12): ActivityItem[] {
  const events = [
    { type: "purchase" as const, title: "Invoice posted", desc: "INV-2425 from TechFlow Solutions - £4,200 + VAT" },
    { type: "user_signup" as const, title: "Payment received", desc: "£8,500 received from Digital Dynamics UK" },
    { type: "export" as const, title: "Journal entry created", desc: "JE-2024157 - Office rent accrual for March" },
    { type: "alert" as const, title: "VAT return due", desc: "Q1 2024 VAT return due 7 May - £12,800 liability" },
    { type: "purchase" as const, title: "Bank reconciliation", desc: "Current account reconciled - 3 outstanding items" },
    { type: "deploy" as const, title: "Payroll processed", desc: "March payroll processed - £13,000 total staff costs" },
    { type: "refund" as const, title: "Credit note issued", desc: "CN-2424 issued to CloudCore Ltd - £1,200" },
    { type: "comment" as const, title: "Trial balance generated", desc: "March trial balance - balanced at £1,840,000" },
    { type: "purchase" as const, title: "Expense claim approved", desc: "Travel expenses - £680 claimed by Sarah Johnson" },
    { type: "user_signup" as const, title: "New supplier added", desc: "Professional Services UK added to supplier list" },
    { type: "export" as const, title: "Management reports", desc: "P&L and Balance Sheet exported for board meeting" },
    { type: "plan_upgrade" as const, title: "Fixed asset addition", desc: "Computer equipment purchased - £3,200 capitalised" },
  ]

  return events.slice(0, count).map((e, i) => ({
    id: `ACT-${i + 1}`,
    type: e.type,
    title: e.title,
    description: e.desc,
    timestamp: format(subMinutes(new Date(), i * 25 + rand(5, 20)), "yyyy-MM-dd'T'HH:mm:ss"),
    user: {
      name: "Sarah Smith", // Primary bookkeeper
    },
  }))
}
