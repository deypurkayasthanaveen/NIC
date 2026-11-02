import { Route, Routes } from 'react-router-dom'
import { DetailsPage } from '../pages/Details/DetailsPage'
import { LoginPage } from '../pages/Login/LoginPage'
import { NotFoundPage } from '../pages/NotFound/NotFoundPage'
import { SubmitFormPage } from '../pages/Submit/SubmitFormPage'
import { WelcomePage } from '../pages/Welcome/WelcomePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/submit-form" element={<SubmitFormPage />} />
      <Route path="/details" element={<DetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
