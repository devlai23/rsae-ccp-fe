import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import AdminHeader from '@/common/components/navigation/AdminHeader';
import UserHeader from '@/common/components/navigation/UserHeader';
import { UserContext } from '@/common/contexts/UserContext';

export default function NavLayout() {
  const context = useContext(UserContext);
  const location = useLocation();
  const allowDevAdminHeader =
    import.meta.env.VITE_DASHBOARD_DEV_BYPASS === 'true';

  const adminHeaderPaths = ['/dashboard', '/audit-log', '/browse'];
  const isAdmin = context?.user?.role === 'admin';
  const isAdminForHeader = isAdmin || allowDevAdminHeader;
  const shouldShowAdminHeader =
    isAdminForHeader &&
    adminHeaderPaths.some(
      (path) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`)
    );

  return (
    <>
      {shouldShowAdminHeader ? <AdminHeader /> : <UserHeader />}
      <main>
        <Outlet />
      </main>
    </>
  );
}
