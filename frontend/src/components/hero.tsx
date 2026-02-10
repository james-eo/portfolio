'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Phone, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { aboutAPI } from '@/lib/api';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutAPI.getAbout();
        if (response.data?.profileImage) {
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchAboutData();
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <section className="min-h-screen flex flex-col justify-center pt-16 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="gradient-text">James Okonkwo</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90">
            Full Stack Software Engineer
          </h2>
          <p className="text-lg text-foreground/70 max-w-lg">
            Building scalable web applications with Python, JavaScript, and Node.js. Passionate
            about solving complex problems and delivering user-centric solutions.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="https://linkedin.com/in/james-o" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Linkedin size={16} /> LinkedIn
              </Button>
            </Link>
            <Link href="https://github.com/james-eo" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Github size={16} /> GitHub
              </Button>
            </Link>
            <Link href="mailto:jameseokonkwo@gmail.com">
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Mail size={16} /> Email
              </Button>
            </Link>
            <Link href="tel:+2347032370055">
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Phone size={16} /> Call
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex gap-3">
            <Link href="/#about">
              <Button className="gap-2 rounded-full">
                Explore My Work <ArrowDown size={16} />
              </Button>
            </Link>
            <Link href="/resume">
              <Button variant="outline" className="gap-2 rounded-full">
                <FileText size={16} /> View Resume
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-full h-112.5 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-blue-600/20 rounded-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6">
                <motion.div
                  className="w-36 h-36 mx-auto rounded-full bg-linear-to-r from-primary to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg overflow-hidden"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                >
                  {profileImage && !isLoading ? (
                    <img
                      src={profileImage}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/profile.png"
                      alt="Profile Picture"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  )}
                </motion.div>
                <div className="space-y-2">
                  <p className="text-xl font-medium">Abuja, Nigeria</p>
                  <p className="text-foreground/70">Full Stack Developer</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      Python
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      JavaScript
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      React
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-muted rounded-2xl -z-10 animate-float"></div>
          <div
            className="absolute -top-6 -left-6 w-40 h-40 bg-muted rounded-2xl -z-10 animate-float"
            style={{ animationDelay: '2s' }}
          ></div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <ArrowDown className="text-primary" />
      </motion.div>
    </section>
  );
};

export default Hero;
