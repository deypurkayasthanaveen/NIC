import type { Status } from './common'

export type PermissionModule = 'users' | 'data'
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export const PERMISSION_MODULES: PermissionModule[] = ['users', 'data']
export const PERMISSION_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete']

export type Permissions = Record<PermissionModule, Record<PermissionAction, boolean>>

export interface Role {
  id: number
  name: string
  description: string
  status: Status
  permissions: Permissions
}

export type RoleInput = Omit<Role, 'id'>

export function emptyPermissions(): Permissions {
  return {
    users: { view: false, create: false, edit: false, delete: false },
    data: { view: false, create: false, edit: false, delete: false },
  }
}
