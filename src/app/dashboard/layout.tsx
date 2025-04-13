import styles from '@/styles/DashboardSidebar.module.css';
import DashboardSidebar from '@/features/Dashboard/components/DashboardSidebar'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
