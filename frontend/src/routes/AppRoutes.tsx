import { Navigate, Route, Routes } from 'react-router-dom'
import { DetailsPage } from '../pages/Details/DetailsPage'
import { NotFoundPage } from '../pages/NotFound/NotFoundPage'
import { SubmitFormPage } from '../pages/Submit/SubmitFormPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/submit-form" replace />} />
      <Route path="/submit-form" element={<SubmitFormPage />} />
      <Route path="/details" element={<DetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
