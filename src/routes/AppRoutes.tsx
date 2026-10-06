import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Spinner } from '../components/common/Spinner'
import { AdminLayout } from '../components/layout/AdminLayout'
import { RecordListPage } from '../pages/Data/RecordListPage'
import { LoginPage } from '../pages/Login/LoginPage'
import { NotFoundPage } from '../pages/NotFound/NotFoundPage'
import { RoleListPage } from '../pages/Roles/RoleListPage'
import { SettingsPage } from '../pages/Settings/SettingsPage'
import { UserCreatePage } from '../pages/Users/UserCreatePage'
import { UserDetailPage } from '../pages/Users/UserDetailPage'
import { UserEditPage } from '../pages/Users/UserEditPage'
import { UserListPage } from '../pages/Users/UserListPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

// The dashboard pulls in the charting library, so it is split into its own chunk.
const DashboardPage = lazy(() =>
  import('../pages/Dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<Spinner centered label="Loading dashboard..." />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/new" element={<UserCreatePage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/roles" element={<RoleListPage />} />
          <Route path="/data" element={<RecordListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
