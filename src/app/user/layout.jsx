'use client';
import styles from '@/styles/UserDashboard.module.css';
import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';

export default function UserLayout({ children }) {
  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <DashboardSidebar />
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
