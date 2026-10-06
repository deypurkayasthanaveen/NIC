import { Pencil, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBadge } from '../../components/common/Badge'
import { Button, LinkButton } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { DetailList, type DetailItem } from '../../components/common/DetailList'
import { ErrorState } from '../../components/common/ErrorState'
import { PageHeader } from '../../components/common/PageHeader'
import { Spinner } from '../../components/common/Spinner'
import { useAsync } from '../../hooks/useAsync'
import { useIdParam } from '../../hooks/useIdParam'
import { useToast } from '../../hooks/useToast'
import { userService } from '../../services/userService'
import type { User } from '../../types/user'
import { formatDate } from '../../utils/format'
import styles from './Users.module.css'

const backTo = { to: '/users', label: 'Back to users' }

export function UserDetailPage() {
  const userId = useIdParam()

  if (userId === null) {
    return (
      <>
        <PageHeader title="User Details" backTo={backTo} />
        <Card>
          <ErrorState
            title="Invalid user ID"
            message="The link you followed does not point to a valid user."
            action={<LinkButton to="/users">Back to users</LinkButton>}
          />
        </Card>
      </>
    )
  }

  return <UserDetail userId={userId} />
}

function UserDetail({ userId }: { userId: number }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const loader = useCallback(() => userService.getUser(userId), [userId])
  const { data: user, error, isLoading, reload } = useAsync(loader)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await userService.deleteUser(userId)
      showToast('success', 'User deleted successfully')
      navigate('/users')
    } catch {
      showToast('error', 'The user could not be deleted. Please try again.')
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <PageHeader
        title="User Details"
        backTo={backTo}
        actions={
          user && (
            <>
              <LinkButton to={`/users/${userId}/edit`} variant="secondary" icon={<Pencil size={16} />}>
                Edit
              </LinkButton>
              <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setConfirmOpen(true)}>
                Delete
              </Button>
            </>
          )
        }
      />

      <Card>
        {isLoading && <Spinner centered label="Loading user..." />}
        {error && (
          <ErrorState
            title="User not found"
            message={error}
            onRetry={reload}
            action={<LinkButton to="/users" variant="ghost">Back to users</LinkButton>}
          />
        )}
        {user && <UserDetails user={user} />}
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete User?"
        message="Are you sure you want to delete this user?"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}

function UserDetails({ user }: { user: User }) {
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const fields: DetailItem[] = [
    { label: 'User ID', value: `#${user.id}` },
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
    { label: 'Status', value: <StatusBadge status={user.status} /> },
    { label: 'Phone', value: user.phone || 'Not provided' },
    { label: 'Department', value: user.department || 'Not assigned' },
    { label: 'Created Date', value: formatDate(user.createdAt) },
  ]

  return (
    <>
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          {initials}
        </span>
        <div>
          <h2>{user.name}</h2>
          <p className={styles.muted}>{user.email}</p>
        </div>
      </div>
      <DetailList items={fields} />
    </>
  )
}
