'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { experienceAPI } from '@/lib/api';
import { toast } from 'sonner';

type Experience = {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  skills: string[];
};

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await experienceAPI.getExperiences();
        if (response.data) {
          setExperiences(response.data);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        toast.error('Failed to load experience information');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="section-container">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">
          <Briefcase size={24} className="mr-2 text-primary" /> Work Experience
        </h2>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-muted overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{experience.title}</h3>
                        <p className="text-foreground/70">
                          {experience.company} | {experience.location}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {experience.startDate} - {experience.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ul className="list-disc pl-5 space-y-1">
                        {experience.description.map((item, i) => (
                          <li key={i} className="text-foreground/80">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {experience.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="font-normal">
                          {skill}
                        </Badge>
                      ))}
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

export default Experience;
