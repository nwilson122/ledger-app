"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/charts/stat-card"
import { AreaChart } from "@/components/charts/area-chart"
import { DonutChart } from "@/components/charts/donut-chart"
import { DataTable } from "@/components/data/data-table"
import { ActivityFeed } from "@/components/data/activity-feed"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Calendar } from "lucide-react"
import {
  generatePLData,
  generateJournalEntries,
  generateBookkeepingActivity,
  EXPENSE_CATEGORIES,
} from "@/lib/mock-data"
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import type { StatCard as StatCardType, JournalEntry } from "@/types"
import { cn } from "@/lib/utils"

// ─── KPI Data ────────────────────────────────────────────────────────────────

const KPI_STATS: StatCardType[] = [
  {
    id: "total-assets",
    title: "Total Assets",
    value: "£1.84M",
    rawValue: 1840000,
    change: 8.7,
    changeLabel: "from last quarter",
    icon: "TrendingUp",
    trend: "up",
    sparkline: [1680000, 1720000, 1750000, 1780000, 1800000, 1820000, 1835000, 1840000],
  },
  {
    id: "revenue-ytd",
    title: "Revenue YTD",
    value: "£342,800",
    rawValue: 342800,
    change: 12.3,
    changeLabel: "vs. last year",
    icon: "PoundSterling",
    trend: "up",
    sparkline: [24000, 26500, 23200, 28800, 31200, 29500, 33600, 35400, 32100, 38200, 41500, 42800],
  },
  {
    id: "accounts-receivable",
    title: "Accounts Receivable",
    value: "£67,200",
    rawValue: 67200,
    change: -5.2,
    changeLabel: "18 outstanding",
    icon: "Receipt",
    trend: "down",
    sparkline: [72000, 69500, 71200, 68800, 70100, 69200, 68500, 67800, 68100, 67500, 67200],
  },
  {
    id: "cash-balance",
    title: "Cash Balance",
    value: "£124,500",
    rawValue: 124500,
    change: 15.8,
    changeLabel: "from last month",
    icon: "Wallet",
    trend: "up",
    sparkline: [105000, 108000, 112000, 115000, 118000, 120000, 122000, 124500],
  },
]

// ─── Journal Entry table columns ──────────────────────────────────────────────

const STATUS_STYLES: Record<JournalEntry["status"], { label: string; className: string }> = {
  posted: { label: "Posted", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  draft: { label: "Draft", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  reconciled: { label: "Reconciled", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  adjusting: { label: "Adjusting", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
}

const journalColumns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {formatDate(String(getValue()))}
      </span>
    ),
  },
  {
    accessorKey: "reference",
    header: "Ref",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs font-medium">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground max-w-[200px] truncate">
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "debitAmount",
    header: "Debit",
    cell: ({ getValue, row }) => (
      <div className="text-right">
        <span className="font-mono font-medium tabular-nums text-xs">
          {Number(getValue()) > 0 ? `£${Number(getValue()).toLocaleString()}` : "-"}
        </span>
        <div className="text-[10px] text-muted-foreground">{row.original.debitAccount}</div>
      </div>
    ),
  },
  {
    accessorKey: "creditAmount",
    header: "Credit",
    cell: ({ getValue, row }) => (
      <div className="text-right">
        <span className="font-mono font-medium tabular-nums text-xs">
          {Number(getValue()) > 0 ? `£${Number(getValue()).toLocaleString()}` : "-"}
        </span>
        <div className="text-[10px] text-muted-foreground">{row.original.creditAccount}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue() as JournalEntry["status"]
      const cfg = STATUS_STYLES[s]
      return (
        <Badge variant="outline" className={cn("text-[10px] font-medium h-5 px-1.5 border", cfg.className)}>
          {cfg.label}
        </Badge>
      )
    },
  },
]

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const plData = useMemo(() => generatePLData(), [])
  const journalEntries = useMemo(() => generateJournalEntries(50), [])
  const activityFeed = useMemo(() => generateBookkeepingActivity(10), [])
  const total = EXPENSE_CATEGORIES.reduce((s, d) => s + d.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ledger — Double-Entry Intelligence"
        description="Complete overview of your financial position and recent bookkeeping activity."
      >
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Calendar className="size-3.5" />
          Last 30 days
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="size-3.5" />
          Export
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
      </PageHeader>

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} animationDelay={i * 80} />
        ))}
      </div>

      {/* ── Row 2: Area Chart + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* P&L Stacked Chart */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-300">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold">Profit & Loss Statement</CardTitle>
                <CardDescription className="text-xs mt-0.5">Monthly P&L breakdown with revenue, COGS, opex, and net income</CardDescription>
              </div>
              <Tabs defaultValue="stacked" className="shrink-0">
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="stacked" className="text-[11px] h-6 px-2.5">Stacked</TabsTrigger>
                  <TabsTrigger value="net" className="text-[11px] h-6 px-2.5">Net Only</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4 pr-2">
            <AreaChart
              data={plData}
              xKey="month"
              series={[
                { key: "revenue", name: "Revenue" },
                { key: "cogs", name: "COGS" },
                { key: "opex", name: "OpEx" },
                { key: "netIncome", name: "Net Income" },
              ]}
              height={260}
              formatY={(v) => `£${(v / 1000).toFixed(0)}K`}
              formatTooltip={(v) => `£${v.toLocaleString()}`}
            />
          </CardContent>
        </Card>

        {/* Expenses by Category Donut */}
        <Card className="border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Expenses by Category</CardTitle>
            <CardDescription className="text-xs">
              £{total.toLocaleString()} total this period
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <DonutChart
              data={EXPENSE_CATEGORIES}
              height={200}
              innerRadius={65}
              outerRadius={90}
              formatValue={(v) => `£${v.toLocaleString()}`}
              centerValue={`£${Math.round(total / 1000)}K`}
              centerLabel="Total"
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Transactions + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journal Entries Table */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent Journal Entries</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Showing the last {journalEntries.length} journal entries across all accounts
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              columns={journalColumns}
              data={journalEntries}
              searchKey="description"
              searchPlaceholder="Search entries..."
            />
          </CardContent>
        </Card>

        {/* Bookkeeping Activity Feed */}
        <Card className="border-border/60 animate-fade-in-up delay-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Bookkeeping Activity</CardTitle>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                Live
              </span>
            </div>
            <CardDescription className="text-xs">Recent accounting events and transactions</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ActivityFeed items={activityFeed} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
