import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  FolderTree,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PackagePlus,
  PhoneCall,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import { hasAdminAccess } from "../auth/jwtAuth";
import { categories } from "../data/adminData";

const orderStatusNav = ["Overall", "Confirmed", "Packed", "Delivered", "Cancelled"];

const encodePath = (value) => encodeURIComponent(value);

export default function AdminNav({ onLogout, onNavigate = () => {}, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const isOrders = location.pathname.startsWith("/admin/orders");
  const isCategory = location.pathname.startsWith("/admin/category");
  const isProducts = location.pathname.startsWith("/admin/products");
  const isUsers = location.pathname.startsWith("/admin/users");
  const isVideoCalls = location.pathname.startsWith("/admin/video-calls");
  const isEnquiries = location.pathname.startsWith("/admin/enquiries");
  const isDashboard = location.pathname === "/admin/dashboard";
  const canViewDashboard = hasAdminAccess(user, "dashboard");
  const canViewOrders = hasAdminAccess(user, "orders");
  const canViewCategory = hasAdminAccess(user, "category");
  const canViewProducts = hasAdminAccess(user, "products") || hasAdminAccess(user, "product-add");
  const canViewProductList = hasAdminAccess(user, "products");
  const canAddProduct = hasAdminAccess(user, "product-add");
  const canViewUsers = hasAdminAccess(user, "users");
  const canViewVideoCalls = hasAdminAccess(user, "video-calls");
  const canViewEnquiries = hasAdminAccess(user, "enquiries");

  useEffect(() => {
    setOrdersOpen(isOrders);
    setCategoriesOpen(isCategory);
    setProductsOpen(isProducts);
  }, [isOrders, isCategory, isProducts]);

  const navButtonClass = (active) =>
    `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-extrabold transition ${
      active
        ? "bg-[#e9fbfc] text-[#23777f]"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
    }`;

  const childLinkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
      isActive
        ? "bg-orange-50 text-orange-700"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <aside className="border-r border-slate-200 bg-white p-5 lg:min-h-screen">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4DA7AF] text-white">
          <Sparkles size={23} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-950">SVFS Admin</h1>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            {user?.name || "Dashboard"}
          </p>
        </div>
      </div>

      <nav className="mt-8 grid gap-3">
        {canViewDashboard && (
          <NavLink to="/admin/dashboard" onClick={onNavigate} className={navButtonClass(isDashboard)}>
            <LayoutDashboard size={18} />
            Overview
          </NavLink>
        )}

        {canViewOrders && (
          <div className="rounded-3xl border border-slate-200 p-2">
          <button
            type="button"
            onClick={() => {
              if (!isOrders) {
                navigate("/admin/orders");
              }
              setOrdersOpen((current) => !current);
              setCategoriesOpen(false);
              setProductsOpen(false);
            }}
            className={navButtonClass(isOrders)}
          >
            <ShoppingCart size={18} />
            Orders
            <ChevronDown className={`ml-auto transition ${ordersOpen ? "rotate-180" : ""}`} size={17} />
          </button>
          {ordersOpen && (
            <div className="mt-2 grid gap-1 px-2 pb-2">
              {orderStatusNav.map((status) => (
                <NavLink
                  key={status}
                  to={status === "Overall" ? "/admin/orders" : `/admin/orders/${encodePath(status)}`}
                  onClick={onNavigate}
                  className={childLinkClass}
                >
                  {status}
                </NavLink>
              ))}
            </div>
          )}
          </div>
        )}

        {canViewCategory && (
          <div className="rounded-3xl border border-slate-200 p-2">
          <button
            type="button"
            onClick={() => {
              if (!isCategory) {
                navigate("/admin/category");
              }
              setCategoriesOpen((current) => !current);
              setOrdersOpen(false);
              setProductsOpen(false);
            }}
            className={navButtonClass(isCategory)}
          >
            <FolderTree size={18} />
            Category
            <ChevronDown className={`ml-auto transition ${categoriesOpen ? "rotate-180" : ""}`} size={17} />
          </button>
          {categoriesOpen && (
            <div className="mt-2 grid gap-1 px-2 pb-2">
              <NavLink to="/admin/category" end onClick={onNavigate} className={childLinkClass}>
                Overall Category
              </NavLink>
              {categories.map((category) => (
                <NavLink
                  key={category.name}
                  to={`/admin/category/${encodePath(category.name)}`}
                  onClick={onNavigate}
                  className={childLinkClass}
                >
                  {category.name}
                </NavLink>
              ))}
            </div>
          )}
          </div>
        )}

        {canViewProducts && (
          <div className="rounded-3xl border border-slate-200 p-2">
          <button
            type="button"
            onClick={() => {
              if (!isProducts) {
                navigate(canViewProductList ? "/admin/products" : "/admin/products/add");
              }
              setProductsOpen((current) => !current);
              setOrdersOpen(false);
              setCategoriesOpen(false);
            }}
            className={navButtonClass(isProducts)}
          >
            <PackagePlus size={18} />
            Product
            <ChevronDown className={`ml-auto transition ${productsOpen ? "rotate-180" : ""}`} size={17} />
          </button>
          {productsOpen && (
            <div className="mt-2 grid gap-1 px-2 pb-2">
              {canViewProductList && (
                <NavLink to="/admin/products" end onClick={onNavigate} className={childLinkClass}>
                  Product List
                </NavLink>
              )}
              {canAddProduct && (
                <NavLink to="/admin/products/add" onClick={onNavigate} className={childLinkClass}>
                  Product Add
                </NavLink>
              )}
            </div>
          )}
          </div>
        )}

        {canViewUsers && (
          <NavLink to="/admin/users" onClick={onNavigate} className={navButtonClass(isUsers)}>
            <Users size={18} />
            Users
          </NavLink>
        )}

        {canViewVideoCalls && (
          <NavLink to="/admin/video-calls" onClick={onNavigate} className={navButtonClass(isVideoCalls)}>
            <PhoneCall size={18} />
            Video Call Schedule
          </NavLink>
        )}

        {canViewEnquiries && (
          <NavLink to="/admin/enquiries" onClick={onNavigate} className={navButtonClass(isEnquiries)}>
            <MessageSquareText size={18} />
            Enquiry Form List
          </NavLink>
        )}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#10212b] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#23777f]"
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}
