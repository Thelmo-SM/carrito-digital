// import styles from '@/styles/account.module.css';
import styles from '@/styles/DashboardSidebar.module.css';
import Style from '@/styles/account.module.css';
import AccountSidebar from '@/features/Account/AccountSidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className={Style.container}>
        <AccountSidebar />
        <main className={styles.mainContent}>{children}</main>
      </div>
    );
  };
  
  export default Layout;