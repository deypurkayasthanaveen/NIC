import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { PageHeader } from '../../components/common/PageHeader'
import { useToast } from '../../hooks/useToast'
import { userService } from '../../services/userService'
import type { UserInput } from '../../types/user'
import { UserForm } from './UserForm'
import { useRoleOptions } from './useRoleOptions'

const emptyUser: UserInput = {
  name: '',
  email: '',
  role: '',
  status: 'Active',
  phone: '',
  department: '',
}

export function UserCreatePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { options: roleOptions } = useRoleOptions()

  const handleSubmit = async (values: UserInput) => {
    try {
      await userService.createUser(values)
      showToast('success', 'User created successfully')
      navigate('/users')
    } catch {
      showToast('error', 'The user could not be created. Please try again.')
    }
  }

  return (
    <>
      <PageHeader
        title="Add User"
        description="Create a new user account."
        backTo={{ to: '/users', label: 'Back to users' }}
      />
      <Card>
        <UserForm
          initialValues={emptyUser}
          roleOptions={roleOptions}
          submitLabel="Create User"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/users')}
        />
      </Card>
    </>
  )
}
