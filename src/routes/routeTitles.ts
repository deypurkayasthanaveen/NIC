const titles: [pattern: RegExp, title: string][] = [
  [/^\/dashboard$/, 'Dashboard'],
  [/^\/users\/new$/, 'Add User'],
  [/^\/users\/[^/]+\/edit$/, 'Edit User'],
  [/^\/users\/[^/]+$/, 'User Details'],
  [/^\/users$/, 'Users'],
  [/^\/roles$/, 'Roles'],
  [/^\/data$/, 'Data'],
  [/^\/settings$/, 'Settings'],
]

export function getPageTitle(pathname: string): string {
  return titles.find(([pattern]) => pattern.test(pathname))?.[1] ?? 'Admin Panel'
}
