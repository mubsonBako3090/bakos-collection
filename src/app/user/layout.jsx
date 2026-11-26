import styles from '@/styles/UserDashboard.module.css';
import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';
import RequireAuth from '@/components/RequireAuth';

export default function UserLayout({ children }) {
  return (
    <RequireAuth>
      <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
          <DashboardSidebar />
        </aside>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </RequireAuth>
  );
}
