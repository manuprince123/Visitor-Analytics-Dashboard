import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdAnalytics,
  MdPeople,
  MdSettings,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const navItems = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: MdAnalytics, label: 'Analytics' },
  { to: '/visitors', icon: MdPeople, label: 'Visitor Logs' },
  { to: '/settings', icon: MdSettings, label: 'Settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <aside
      className={`relative flex flex-col bg-white dark:bg-dark-850 border-r border-gray-100 dark:border-white/5 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-white/5">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <MdAnalytics className="text-white text-lg" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              VisitorIQ
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Analytics</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="flex-shrink-0 text-xl" />
            {!collapsed && <span className="text-sm truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + Logout */}
      <div className="px-2 pb-4 space-y-1 border-t border-gray-100 dark:border-white/5 pt-3">
        {!collapsed && admin && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {admin.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{admin.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200 text-sm"
          title={collapsed ? 'Logout' : undefined}
        >
          <MdLogout className="flex-shrink-0 text-xl" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors shadow-sm"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <MdChevronRight className="text-sm" />
        ) : (
          <MdChevronLeft className="text-sm" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
