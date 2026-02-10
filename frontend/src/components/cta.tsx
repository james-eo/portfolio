'use client';

import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-16">
      <motion.div
        className="rounded-2xl bg-linear-to-r from-primary/10 to-blue-600/10 p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to collaborate?</h2>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          Whether you are looking for a skilled developer for your project or want to discuss
          potential opportunities, I would love to connect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/resume">
            <Button size="lg" className="gap-2 rounded-full">
              <FileText size={18} /> View My Resume
            </Button>
          </Link>
          <Link href="/#contact">
            <Button variant="outline" size="lg" className="gap-2 rounded-full">
              <Download size={18} /> Contact Me
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
