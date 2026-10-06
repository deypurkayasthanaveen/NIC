import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkButton } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { ErrorState } from '../../components/common/ErrorState'
import { PageHeader } from '../../components/common/PageHeader'
import { Spinner } from '../../components/common/Spinner'
import { useAsync } from '../../hooks/useAsync'
import { useIdParam } from '../../hooks/useIdParam'
import { useToast } from '../../hooks/useToast'
import { userService } from '../../services/userService'
import type { User, UserInput } from '../../types/user'
import { UserForm } from './UserForm'
import { useRoleOptions } from './useRoleOptions'

const backTo = { to: '/users', label: 'Back to users' }

export function UserEditPage() {
  const userId = useIdParam()

  if (userId === null) {
    return (
      <>
        <PageHeader title="Edit User" backTo={backTo} />
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

  return <UserEdit userId={userId} />
}

function UserEdit({ userId }: { userId: number }) {
  const loader = useCallback(() => userService.getUser(userId), [userId])
  const { data: user, error, isLoading, reload } = useAsync(loader)

  return (
    <>
      <PageHeader
        title="Edit User"
        description={user ? `Update details for ${user.name}.` : undefined}
        backTo={{ to: `/users/${userId}`, label: 'Back to user' }}
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
        {user && <EditForm user={user} />}
      </Card>
    </>
  )
}

function EditForm({ user }: { user: User }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { options: roleOptions } = useRoleOptions(user.role)

  const initialValues: UserInput = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    phone: user.phone,
    department: user.department,
  }

  const handleSubmit = async (values: UserInput) => {
    try {
      await userService.updateUser(user.id, values)
      showToast('success', 'User updated successfully')
      navigate(`/users/${user.id}`)
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'The user could not be updated.')
    }
  }

  return (
    <UserForm
      initialValues={initialValues}
      roleOptions={roleOptions}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/users/${user.id}`)}
    />
  )
}
