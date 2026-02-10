'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { skillsAPI } from '@/lib/api';
import { toast } from 'sonner';

type Skill = {
  name: string;
};

type SkillCategory = {
  _id: string;
  name: string;
  skills: Skill[];
};

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await skillsAPI.getSkillCategories();
        if (response.data && response.data.length > 0) {
          setSkillCategories(response.data);
          setActiveCategory(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills information');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getRandomColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="skills" className="section-container">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">
          <Lightbulb size={24} className="mr-2 text-primary" /> Technical Skills
        </h2>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto mb-6 bg-muted/50 p-1 rounded-lg">
              {skillCategories.map((category) => (
                <TabsTrigger
                  key={category._id}
                  value={category._id}
                  className="grow data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {skillCategories.map((category, categoryIndex) => (
              <TabsContent key={category._id} value={category._id} className="animate-scale">
                <Card className="border border-muted overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.span
                          key={`${category._id}-${skillIndex}`}
                          className={`skill-pill ${getRandomColor(
                            (categoryIndex + skillIndex) % 7
                          )}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: skillIndex * 0.05,
                          }}
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </motion.div>
    </section>
  );
};

export default Skills;
