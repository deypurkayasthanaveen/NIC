import type { Status } from './common'

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: Status
  phone: string
  department: string
  createdAt: string
}

export type UserInput = Omit<User, 'id' | 'createdAt'>
