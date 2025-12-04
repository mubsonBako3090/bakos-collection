'use client';
import { useEffect, useState } from 'react';
import UserLayout from '@/app/user/layout';
import styles from '@/styles/UserDashboard.module.css';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from local storage or API
    const token = localStorage.getItem('token');

    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <UserLayout>
      <div className={styles.profileContainer}>
        <h2>Welcome, {user?.firstName || 'User'}!</h2>
        <p>Email: {user?.email || 'Not available'}</p>
        <p>Phone: {user?.phone || 'Not available'}</p>

        <div className={styles.dashboardSections}>
          <div className={styles.section}>
            <h4>Orders</h4>
            <p>View your past orders here.</p>
          </div>
          <div className={styles.section}>
            <h4>Cart</h4>
            <p>Check your shopping cart items.</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
