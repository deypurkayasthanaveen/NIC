import type { AppNotification } from '../types/notification'

export const notifications: AppNotification[] = [
  {
    id: 1,
    title: 'System maintenance',
    description: 'Scheduled for Saturday, 02:00 to 04:00.',
    time: '10 min ago',
    read: false,
  },
  {
    id: 2,
    title: 'New user created',
    description: 'Priya Sharma was added to Operations.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    title: 'Profile updated',
    description: 'Your profile details were saved.',
    time: 'Yesterday',
    read: false,
  },
]
