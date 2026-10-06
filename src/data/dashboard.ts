export interface SummaryStat {
  id: string
  label: string
  value: number
  change: string
}

export interface ActivityItem {
  id: number
  message: string
  time: string
}

export interface MonthlyUsers {
  month: string
  users: number
}

export const summaryStats: SummaryStat[] = [
  { id: 'total', label: 'Total Users', value: 1250, change: '+4.2% this month' },
  { id: 'active', label: 'Active Users', value: 1180, change: '94.4% of total' },
  { id: 'inactive', label: 'Inactive Users', value: 70, change: '5.6% of total' },
  { id: 'records', label: 'Total Records', value: 5432, change: '+312 this month' },
]

export const recentActivity: ActivityItem[] = [
  { id: 1, message: 'User John created', time: '5 min ago' },
  { id: 2, message: 'User Smith updated', time: '32 min ago' },
  { id: 3, message: 'New record added', time: '1 hour ago' },
  { id: 4, message: 'User Admin logged in', time: '2 hours ago' },
  { id: 5, message: 'Role Operator updated', time: 'Yesterday' },
]

export const usersByMonth: MonthlyUsers[] = [
  { month: 'Jan', users: 820 },
  { month: 'Feb', users: 880 },
  { month: 'Mar', users: 940 },
  { month: 'Apr', users: 990 },
  { month: 'May', users: 1040 },
  { month: 'Jun', users: 1090 },
  { month: 'Jul', users: 1150 },
  { month: 'Aug', users: 1210 },
  { month: 'Sep', users: 1250 },
]

export const userStatusBreakdown = [
  { name: 'Active', value: 1180 },
  { name: 'Inactive', value: 70 },
]
