import type { User } from '../types/user'

const firstNames = [
  'John', 'Smith', 'Priya', 'Arjun', 'Maria', 'Chen', 'Fatima', 'David',
  'Aisha', 'Rahul', 'Emma', 'Liam', 'Sofia', 'Noah', 'Ananya', 'Lucas',
  'Meera', 'Omar', 'Grace', 'Vikram', 'Hannah', 'Ethan', 'Kavya', 'Daniel',
  'Isabella', 'Rohan', 'Zara', 'Samuel', 'Neha', 'Benjamin', 'Leila', 'Aditya',
  'Chloe', 'Karan', 'Admin',
]

const lastNames = [
  'Doe', 'Kumar', 'Sharma', 'Patel', 'Garcia', 'Wei', 'Khan', 'Miller',
  'Rahman', 'Verma', 'Wilson', 'Brown', 'Rossi', 'Taylor', 'Iyer', 'Martin',
  'Nair', 'Hassan', 'Lee', 'Singh', 'Clark', 'Walker', 'Reddy', 'Young',
  'Lopez', 'Mehta', 'Ali', 'King', 'Gupta', 'Scott', 'Haddad', 'Joshi',
  'Moore', 'Malhotra', 'User',
]

const roles = ['Administrator', 'Manager', 'Operator', 'Viewer']
export const departments = ['Engineering', 'Finance', 'Operations', 'Support', 'Human Resources']

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export const users: User[] = firstNames.map((first, index) => {
  const last = lastNames[index]
  const id = index + 1
  return {
    id,
    name: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase() + '@example.com',
    role: roles[index % roles.length],
    status: index % 7 === 3 ? 'Inactive' : 'Active',
    phone: `+91 98${pad((index * 37) % 100)} ${pad((index * 53) % 100)}${pad((index * 19) % 100)}${pad(id)}`,
    department: departments[index % departments.length],
    createdAt: `2026-${pad((index % 9) + 1)}-${pad((index % 27) + 1)}`,
  }
})
