'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { aboutAPI } from '@/lib/api';
import { toast } from 'sonner';

const About = () => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const response = await aboutAPI.getAbout();
        if (response.data && response.data.summary) {
          setSummary(response.data.summary);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        toast.error('Failed to load about information');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  return (
    <section id="about" className="section-container">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">
          <User size={24} className="mr-2 text-primary" /> About Me
        </h2>

        <Card className="border border-muted overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="relative">
              <div className="absolute top-0 left-0 w-16 h-16 bg-primary/5 rounded-full -ml-8 -mt-8"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mb-8"></div>
              {loading ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <p className="text-lg leading-relaxed relative z-10">{summary}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default About;
