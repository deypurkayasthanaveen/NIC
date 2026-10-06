import { roles as seedRoles } from '../data/roles'
import type { Role, RoleInput } from '../types/role'
import { mockError, mockResponse, nextId } from './mockDelay'

let roles: Role[] = structuredClone(seedRoles)

export const roleService = {
  getRoles(): Promise<Role[]> {
    return mockResponse(roles)
  },

  createRole(input: RoleInput): Promise<Role> {
    if (roles.some((role) => role.name.toLowerCase() === input.name.trim().toLowerCase())) {
      return mockError(`A role named "${input.name}" already exists.`)
    }
    const role: Role = { ...input, id: nextId(roles) }
    roles = [...roles, role]
    return mockResponse(role)
  },

  updateRole(id: number, input: RoleInput): Promise<Role> {
    if (!roles.some((role) => role.id === id)) return mockError(`Role with ID ${id} was not found.`)
    if (roles.some((role) => role.id !== id && role.name.toLowerCase() === input.name.trim().toLowerCase())) {
      return mockError(`A role named "${input.name}" already exists.`)
    }
    const updated: Role = { ...input, id }
    roles = roles.map((role) => (role.id === id ? updated : role))
    return mockResponse(updated)
  },

  deleteRole(id: number): Promise<void> {
    roles = roles.filter((role) => role.id !== id)
    return mockResponse(undefined)
  },
}
