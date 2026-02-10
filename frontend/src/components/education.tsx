'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { educationAPI } from '@/lib/api';
import { toast } from 'sonner';

type Education = {
  _id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
};

const Education = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const response = await educationAPI.getEducation();
        if (response.data) {
          setEducations(response.data);
        }
      } catch (error) {
        console.error('Error fetching education:', error);
        toast.error('Failed to load education information');
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return (
    <section id="education" className="section-container">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">
          <GraduationCap size={24} className="mr-2 text-primary" /> Education
        </h2>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {educations.map((education, index) => (
              <motion.div
                key={education._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-muted hover:shadow-md transition-shadow">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{education.degree}</h3>
                        <p className="text-foreground/70">{education.institution}</p>
                        {education.details && (
                          <p className="text-foreground/60 mt-2">{education.details}</p>
                        )}
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {education.year}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Education;
