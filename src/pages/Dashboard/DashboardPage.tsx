import { Database, UserCheck, UserX, Users } from 'lucide-react'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { PageHeader } from '../../components/common/PageHeader'
import { Spinner } from '../../components/common/Spinner'
import { useAsync } from '../../hooks/useAsync'
import { dashboardService } from '../../services/dashboardService'
import { formatNumber } from '../../utils/format'
import { UserStatusChart, UsersByMonthChart } from './DashboardCharts'
import styles from './DashboardPage.module.css'

const statIcons: Record<string, typeof Users> = {
  total: Users,
  active: UserCheck,
  inactive: UserX,
  records: Database,
}

export function DashboardPage() {
  const { data, error, isLoading, reload } = useAsync(dashboardService.getDashboard)

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of users, records, and recent activity." />

      {isLoading && <Spinner centered label="Loading dashboard..." />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {data && (
        <>
          <div className={styles.stats}>
            {data.stats.map((stat) => {
              const Icon = statIcons[stat.id] ?? Users
              return (
                <Card key={stat.id}>
                  <div className={styles.stat}>
                    <div>
                      <p className={styles.statLabel}>{stat.label}</p>
                      <p className={styles.statValue}>{formatNumber(stat.value)}</p>
                      <p className={styles.statChange}>{stat.change}</p>
                    </div>
                    <span className={styles.statIcon} aria-hidden="true">
                      <Icon size={20} />
                    </span>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className={styles.grid}>
            <Card title="Users by month" description="Total registered users, current year">
              <UsersByMonthChart data={data.usersByMonth} />
            </Card>
            <Card title="Active vs inactive" description="Current user status">
              <UserStatusChart data={data.statusBreakdown} />
            </Card>
          </div>

          <Card title="Recent Activity">
            {data.activity.length === 0 ? (
              <EmptyState title="No recent activity" description="Activity will appear here as changes are made." />
            ) : (
              <ul className={styles.activity}>
                {data.activity.map((item) => (
                  <li key={item.id} className={styles.activityItem}>
                    <span>{item.message}</span>
                    <span className={styles.activityTime}>{item.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </>
  )
}
