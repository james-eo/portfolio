'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  Award,
  BookOpen,
  User,
  Mail,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Experiences',
    href: '/admin/experiences',
    icon: Briefcase,
  },
  {
    label: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen,
  },
  {
    label: 'Skills',
    href: '/admin/skills',
    icon: Award,
  },
  {
    label: 'Education',
    href: '/admin/education',
    icon: BookOpen,
  },
  {
    label: 'About',
    href: '/admin/about',
    icon: User,
  },
  {
    label: 'Messages',
    href: '/admin/contacts',
    icon: Mail,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = auth.isAuthenticated();
        if (!isAuth) {
          router.push('/login');
          return;
        }

        // Verify user has admin role
        const user = auth.getUser();
        if (!user || user.role !== 'admin') {
          setAuthError('Access denied. Admin privileges required.');
          router.push('/');
          return;
        }

        // Additional server-side verification
        const isValid = await auth.verifyAuth();
        if (!isValid) {
          setAuthError('Session expired. Please login again.');
          router.push('/login');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthError('Authentication error. Please try again.');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await auth.logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">{authError}</p>
          <Button onClick={() => router.push('/')} className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your portfolio</p>
        </div>

        <nav className="p-4 space-y-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 bg-gray-800 border-t border-gray-700">
          <Button
            variant="destructive"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
