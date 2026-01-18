'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Product Management',
    href: '/products',
    icon: Package,
  },
  {
    name: 'Order Management',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Customer Management',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarContent = (
    <div 
      id="sidebar"
      className={`
        w-64 bg-blue-600 text-white flex flex-col h-full
        fixed md:relative inset-y-0 left-0 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-2xl md:shadow-none
      `}
    >
      {/* Logo and Close Button */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-blue-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm sm:text-xl">○</span>
          </div>
          <span className="text-lg sm:text-xl font-semibold">Logo</span>
        </div>
        
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 hover:bg-blue-500 rounded-lg transition-colors md:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Optional: User profile or bottom section */}
      <div className="p-4 border-t border-blue-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-blue-200 truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors md:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      {sidebarContent}
    </>
  );
}