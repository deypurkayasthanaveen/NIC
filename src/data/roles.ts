import type { Role } from '../types/role'

export const roles: Role[] = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full access to every module and setting.',
    status: 'Active',
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      data: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Manages users and data, cannot delete users.',
    status: 'Active',
    permissions: {
      users: { view: true, create: true, edit: true, delete: false },
      data: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    id: 3,
    name: 'Operator',
    description: 'Maintains day-to-day data records.',
    status: 'Active',
    permissions: {
      users: { view: true, create: false, edit: false, delete: false },
      data: { view: true, create: true, edit: true, delete: false },
    },
  },
  {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to users and data.',
    status: 'Active',
    permissions: {
      users: { view: true, create: false, edit: false, delete: false },
      data: { view: true, create: false, edit: false, delete: false },
    },
  },
]
