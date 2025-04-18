import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { 
  FaHome, 
  FaChartLine, 
  FaWater, 
  FaBell, 
  FaUserCircle, 
  FaSignInAlt,
  FaBars, 
  FaTimes
} from 'react-icons/fa';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const { unreadCount } = useAppSelector(state => state.alert);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigationItems = [
    {
      to: '/dashboard',
      icon: <FaHome />,
      label: 'Dashboard',
      requiresAuth: true
    },
    {
      to: '/whale-radar',
      icon: <FaWater />,
      label: 'Whale Radar',
      requiresAuth: true
    },
    {
      to: '/market',
      icon: <FaChartLine />,
      label: 'Market',
      requiresAuth: false
    },
    {
      to: '/alerts',
      icon: <FaBell />,
      label: 'Alerts',
      requiresAuth: true,
      badge: unreadCount > 0 ? unreadCount : null
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-700">
          <div className="flex items-center">
            <span className="text-xl font-bold">SONAR</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-sm text-blue-300">Navigation</div>
          <ul>
            {navigationItems.map((item) => {
              // Skip items that require auth if not authenticated
              if (item.requiresAuth && !isAuthenticated) return null;

              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center px-6 py-3 text-sm hover:bg-blue-700 ${
                      location.pathname === item.to ? 'bg-blue-900' : ''
                    }`}
                    onClick={closeSidebar}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="px-4 py-2 mt-6 text-sm text-blue-300">Account</div>
          <ul>
            {isAuthenticated ? (
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center px-6 py-3 text-sm hover:bg-blue-700 ${
                    location.pathname === '/profile' ? 'bg-blue-900' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="mr-3"><FaUserCircle /></span>
                  <span>Profile</span>
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/auth"
                  className={`flex items-center px-6 py-3 text-sm hover:bg-blue-700 ${
                    location.pathname === '/auth' ? 'bg-blue-900' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="mr-3"><FaSignInAlt /></span>
                  <span>Login / Register</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between h-16 px-6">
            <button onClick={toggleSidebar} className="lg:hidden">
              <FaBars className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center">
              {isAuthenticated && user && (
                <div className="text-sm text-gray-600">Welcome, {user.name}</div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 