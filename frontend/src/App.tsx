import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { BackToTop } from './components/common/BackToTop'
import { ThemeProvider } from './context/ThemeContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">
            <Header />
            <main id="main-content" className="flex flex-1 flex-col pt-3">
              <AppRoutes />
            </main>
            <Footer />
            <BackToTop />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
