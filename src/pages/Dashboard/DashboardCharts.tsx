import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyUsers } from '../../data/dashboard'
import styles from './DashboardPage.module.css'

// Recharts renders SVG, so theme colors are passed as CSS variables.
const tooltipStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  color: 'var(--color-text)',
}
const axisTick = { fill: 'var(--color-text-subtle)', fontSize: 12 }
const pieColors = ['var(--color-primary)', 'var(--color-border-strong)']

export function UsersByMonthChart({ data }: { data: MonthlyUsers[] }) {
  return (
    <div className={styles.chart} role="img" aria-label="Bar chart of total users by month">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-surface-muted)' }} />
          <Bar dataKey="users" name="Users" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function UserStatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className={styles.chart} role="img" aria-label="Pie chart of active versus inactive users">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={pieColors[index % pieColors.length]} stroke="var(--color-surface)" />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
