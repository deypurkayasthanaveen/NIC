// MOCK: replace with a real API call when the backend report endpoint exists
export type ReportStatus = 'PENDING' | 'COMPLETED'
export type DisplayStatus = 'completed' | 'pending' | 'expired'

export interface ClientReport {
  clientId: string
  clientName: string
  redirectUrls: string
  status: ReportStatus
  createdAt: string
  completedAt: string | null
  expiresAt: string
}

export class ReportApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ReportApiError'
  }
}

function createDemoReports(): Record<string, ClientReport> {
  const now = Date.now()
  const relativeDate = (offsetMs: number) => new Date(now + offsetMs).toISOString()

  return {
    cl_demo_completed: {
      clientId: 'cl_demo_completed',
      clientName: 'AuthDesk Demo App',
      redirectUrls: 'https://example.com/auth/callback',
      status: 'COMPLETED',
      createdAt: '2026-10-28T10:42:00+05:30',
      completedAt: '2026-10-28T11:05:00+05:30',
      expiresAt: relativeDate(2 * 24 * 60 * 60 * 1000),
    },
    cl_demo_pending: {
      clientId: 'cl_demo_pending',
      clientName: 'Pending Demo Client',
      redirectUrls: 'https://pending.example.com/callback',
      status: 'PENDING',
      createdAt: relativeDate(-20 * 60 * 1000),
      completedAt: null,
      expiresAt: relativeDate(5 * 24 * 60 * 60 * 1000),
    },
    cl_demo_expired: {
      clientId: 'cl_demo_expired',
      clientName: 'Expired Demo Client',
      redirectUrls: 'https://expired.example.com/callback',
      status: 'PENDING',
      createdAt: relativeDate(-30 * 24 * 60 * 60 * 1000),
      completedAt: null,
      expiresAt: relativeDate(-24 * 60 * 60 * 1000),
    },
  }
}

export async function getReport(clientId: string): Promise<ClientReport> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 400))

  const report = createDemoReports()[clientId]
  if (!report) throw new ReportApiError('No report found for this client ID.')
  return report
}

export function deriveDisplayStatus(report: ClientReport): DisplayStatus {
  if (report.status === 'COMPLETED') return 'completed'
  const expiresAt = Date.parse(report.expiresAt)
  if (Number.isFinite(expiresAt) && expiresAt < Date.now()) return 'expired'
  return 'pending'
}
