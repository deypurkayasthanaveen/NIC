import { Home } from 'lucide-react'
import { LinkButton } from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1>Page not found</h1>
      <p className={styles.text}>The page you are looking for does not exist or may have been moved.</p>
      <div className={styles.actions}>
        <LinkButton to={isAuthenticated ? '/dashboard' : '/login'} icon={<Home size={16} />}>
          {isAuthenticated ? 'Back to dashboard' : 'Go to login'}
        </LinkButton>
      </div>
    </main>
  )
}
