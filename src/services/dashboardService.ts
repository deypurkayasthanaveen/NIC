import { recentActivity, summaryStats, userStatusBreakdown, usersByMonth } from '../data/dashboard'
import { mockResponse } from './mockDelay'

export const dashboardService = {
  getDashboard() {
    return mockResponse({
      stats: summaryStats,
      activity: recentActivity,
      usersByMonth,
      statusBreakdown: userStatusBreakdown,
    })
  },
}
