import { users as seedUsers } from '../data/users'
import type { User, UserInput } from '../types/user'
import { todayIso } from '../utils/format'
import { mockError, mockResponse, nextId } from './mockDelay'

// In-memory store: survives navigation, resets on page refresh.
let users: User[] = structuredClone(seedUsers)

export const userService = {
  getUsers(): Promise<User[]> {
    return mockResponse(users)
  },

  getUser(id: number): Promise<User> {
    const user = users.find((item) => item.id === id)
    return user ? mockResponse(user) : mockError(`User with ID ${id} was not found.`)
  },

  createUser(input: UserInput): Promise<User> {
    const user: User = { ...input, id: nextId(users), createdAt: todayIso() }
    users = [...users, user]
    return mockResponse(user)
  },

  updateUser(id: number, input: UserInput): Promise<User> {
    const existing = users.find((item) => item.id === id)
    if (!existing) return mockError(`User with ID ${id} was not found.`)
    const updated: User = { ...existing, ...input }
    users = users.map((item) => (item.id === id ? updated : item))
    return mockResponse(updated)
  },

  deleteUser(id: number): Promise<void> {
    users = users.filter((item) => item.id !== id)
    return mockResponse(undefined)
  },
}
