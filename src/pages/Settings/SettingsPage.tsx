import { PageHeader } from '../../components/common/PageHeader'
import { AppearanceSection } from './AppearanceSection'
import { PreferencesSection } from './PreferencesSection'
import { ProfileSection } from './ProfileSection'
import { SecuritySection } from './SecuritySection'
import styles from './Settings.module.css'

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, appearance, and account preferences." />
      <div className={styles.layout}>
        <div className={styles.column}>
          <ProfileSection />
          <AppearanceSection />
          <PreferencesSection />
        </div>
        <SecuritySection />
      </div>
    </>
  )
}
