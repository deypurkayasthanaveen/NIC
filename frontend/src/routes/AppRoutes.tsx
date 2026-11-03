import { useState } from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { isFrontendAuthenticated } from '../services/authService'
import { DetailsPage } from '../pages/Details/DetailsPage'
import { LoginPage } from '../pages/Login/LoginPage'
import { NotFoundPage } from '../pages/NotFound/NotFoundPage'
import { ReportPage } from '../pages/Report/ReportPage'
import { SubmitFormPage } from '../pages/Submit/SubmitFormPage'
import { WelcomePage } from '../pages/Welcome/WelcomePage'

function RequireAuthentication() {
  const location = useLocation()
  const [authenticated] = useState<boolean | null>(() => {
    try {
      return isFrontendAuthenticated()
    } catch {
      return null
    }
  })

  if (authenticated === null) {
    return (
      <p className="m-auto p-6 text-center text-sm text-red-400" role="alert">
        Unable to verify sign-in status in this tab. Please enable session storage to continue.{' '}
        <Link to="/login">Go to login</Link>
      </p>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/submit-form" element={<SubmitFormPage />} />
      <Route path="/details" element={<DetailsPage />} />
      <Route element={<RequireAuthentication />}>
        <Route path="/report" element={<ReportPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
