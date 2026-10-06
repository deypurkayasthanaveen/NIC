import { Bell } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { notifications as seedNotifications } from '../../data/notifications'
import { useDismiss } from '../../hooks/useDismiss'
import { Button } from '../common/Button'
import styles from './Layout.module.css'

export function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(seedNotifications)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useDismiss(containerRef, open, () => setOpen(false))

  const unreadCount = items.filter((item) => !item.read).length

  return (
    <div className={styles.dropdown} ref={containerRef}>
      <Button
        variant="ghost"
        iconOnly
        icon={<Bell size={20} />}
        className={styles.iconButton}
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      />
      {unreadCount > 0 && (
        <span className={styles.countBadge} aria-hidden="true">
          {unreadCount}
        </span>
      )}

      {open && (
        <div id={panelId} className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.notificationTitle}>Notifications</h2>
              <p className={styles.panelSubtitle}>
                {unreadCount ? `${unreadCount} new notifications` : 'You are all caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}
              >
                Mark all as read
              </button>
            )}
          </div>
          <ul className={styles.notificationList}>
            {items.map((item) => (
              <li key={item.id} className={styles.notificationItem}>
                <span className={`${styles.unreadDot} ${item.read ? styles.readDot : ''}`} aria-hidden="true" />
                <div>
                  <p className={styles.notificationTitle}>
                    {item.title}
                    {!item.read && <span className="sr-only"> (unread)</span>}
                  </p>
                  <p className={styles.notificationMeta}>{item.description}</p>
                  <p className={styles.notificationMeta}>{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
