import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '@/common/contexts/UserContext';
import UserHeader from '@/common/components/navigation/UserHeader';
import AdminHeader from '@/common/components/navigation/AdminHeader';

export default function NavLayout() {
  const context = useContext(UserContext);
  const location = useLocation();

  const isAdmin = context?.user?.role === 'admin';
  const adminHeaderPaths = ['/dashboard', '/audit-log'];
  const shouldShowAdminHeader =
    isAdmin &&
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
