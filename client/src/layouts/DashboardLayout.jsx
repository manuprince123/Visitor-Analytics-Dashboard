import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

/**
 * DashboardLayout — shell with collapsible sidebar and top navbar.
 * All protected pages render via <Outlet />.
 */
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
