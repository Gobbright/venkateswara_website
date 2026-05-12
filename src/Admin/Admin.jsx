import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getAdminSession, getAdminStartPath, hasAdminAccess, loginAdmin, logoutAdmin } from "./auth/jwtAuth";
import Category from "./Category/Category";
import Dashboard from "./Dashboard/Dashboard";
import AdminLayout from "./Layout/AdminLayout";
import AdminLogin from "./Login/AdminLogin";
import Orders from "./Orders/Orders";
import ProductAdd from "./Products/ProductAdd";
import ProductList from "./Products/ProductList";
import Enquiries from "./Enquiries/Enquiries";
import Users from "./Users/Users";
import VideoCalls from "./VideoCalls/VideoCalls";

function ProtectedAdminRoute({ user, permission, children }) {
  if (!hasAdminAccess(user, permission)) {
    return <Navigate to={getAdminStartPath(user)} replace />;
  }

  return children;
}

export default function Admin() {
  const [session, setSession] = useState(() => getAdminSession());
  const navigate = useNavigate();

  const handleLogin = ({ email, password }) => {
    const result = loginAdmin({ email, password });

    if (result.ok) {
      const nextSession = getAdminSession();
      setSession(nextSession);
      navigate(getAdminStartPath(nextSession?.user), { replace: true });
    }

    return result.ok;
  };

  const handleLogout = () => {
    logoutAdmin();
    setSession(null);
    navigate("/admin", { replace: true });
  };

  if (!session) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout onLogout={handleLogout} user={session.user} />}>
        <Route index element={<Navigate to={getAdminStartPath(session.user).replace("/admin/", "")} replace />} />
        <Route path="dashboard" element={<ProtectedAdminRoute user={session.user} permission="dashboard"><Dashboard /></ProtectedAdminRoute>} />
        <Route path="orders" element={<ProtectedAdminRoute user={session.user} permission="orders"><Orders /></ProtectedAdminRoute>} />
        <Route path="orders/:status" element={<ProtectedAdminRoute user={session.user} permission="orders"><Orders /></ProtectedAdminRoute>} />
        <Route path="category" element={<ProtectedAdminRoute user={session.user} permission="category"><Category /></ProtectedAdminRoute>} />
        <Route path="category/:categoryName" element={<ProtectedAdminRoute user={session.user} permission="category"><Category /></ProtectedAdminRoute>} />
        <Route path="products" element={<ProtectedAdminRoute user={session.user} permission="products"><ProductList /></ProtectedAdminRoute>} />
        <Route path="products/add" element={<ProtectedAdminRoute user={session.user} permission="product-add"><ProductAdd /></ProtectedAdminRoute>} />
        <Route path="products/add/:categoryName" element={<ProtectedAdminRoute user={session.user} permission="product-add"><ProductAdd /></ProtectedAdminRoute>} />
        <Route path="users" element={<ProtectedAdminRoute user={session.user} permission="users"><Users /></ProtectedAdminRoute>} />
        <Route path="video-calls" element={<ProtectedAdminRoute user={session.user} permission="video-calls"><VideoCalls /></ProtectedAdminRoute>} />
        <Route path="enquiries" element={<ProtectedAdminRoute user={session.user} permission="enquiries"><Enquiries /></ProtectedAdminRoute>} />
        <Route path="*" element={<Navigate to={getAdminStartPath(session.user)} replace />} />
      </Route>
    </Routes>
  );
}
