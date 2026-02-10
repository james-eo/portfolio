// import { Heart } from "lucide-react"
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-foreground/70">
              © {currentYear} James Okonkwo. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/#about"
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/#projects"
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/resume"
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Resume
            </Link>
            <Link
              href="/#contact"
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* <div className="mt-4 md:mt-0 flex items-center">
            <p className="text-foreground/70 flex items-center">
              Built with <Heart className="h-4 w-4 mx-1 text-red-500" /> using Next.js & Tailwind CSS
            </p>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
