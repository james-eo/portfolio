'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { Menu, X, FileText, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DropdownMenu } from './ui/dropdown-menu';
// import { auth } from "@/lib/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isResume = pathname.startsWith('/resume');
  // const user = auth.getUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Education', href: '/#education' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled ? 'glass-effect py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            {Users.name}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAdmin && !isResume && (
              <>
                <DropdownMenu>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        'hover:text-primary hover:bg-primary/5'
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </DropdownMenu>
              </>
            )}

            <Link href="/resume" className="ml-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileText size={16} /> Resume
              </Button>
            </Link>

            {/* {session?.user ? (
              <>
                <Link href="/admin" className="ml-2">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="ml-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" className="ml-2">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )} */}

            <div className="ml-2">
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <Link href="/resume" className="mr-2">
              <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                <FileText size={16} />
                <span className="sr-only">Resume</span>
              </Button>
            </Link>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden glass-effect mt-2 rounded-lg animate-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAdmin && !isResume && (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </>
              )}

              {!isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
