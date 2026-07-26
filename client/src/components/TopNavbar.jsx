import { useLocation } from 'react-router-dom';
import { MdDarkMode, MdLightMode, MdNotifications } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/visitors': 'Visitor Logs',
  '/settings': 'Settings',
};

const TopNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { admin } = useAuth();
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';
  const initials = admin?.name
    ? admin.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/80 dark:bg-dark-850/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
          aria-label="Toggle dark mode"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
        </button>

        {/* Notifications (placeholder) */}
        <button
          className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
          aria-label="Notifications"
        >
          <MdNotifications className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Admin avatar */}
        <div className="flex items-center gap-2.5 ml-1 pl-2 border-l border-gray-200 dark:border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {admin?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
