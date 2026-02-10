'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Code, Play } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { projectsAPI } from '@/lib/api';
import { toast } from 'sonner';

type Project = {
  _id: string;
  title: string;
  description: string;
  outcomes: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getProjects();
        if (response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects information');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="section-container">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">
          <Code size={24} className="mr-2 text-primary" /> Projects
        </h2>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-muted overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                  {project.imageUrl && (
                    <div className="h-48 overflow-hidden relative">
                      <Image
                        src={project.imageUrl || '/placeholder.svg'}
                        alt={project.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {project.videoUrl && (
                        <a
                          href={project.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-primary transition-colors"
                        >
                          <Play size={20} />
                        </a>
                      )}
                    </div>
                  )}

                  <CardContent className="p-6 grow">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-foreground/80 mb-4">{project.description}</p>

                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Key Outcomes:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
                        {project.outcomes.map((outcome, i) => (
                          <li key={i}>{outcome}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex gap-2">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full bg-transparent"
                      >
                        <Github size={16} /> GitHub
                      </Button>
                    </Link>

                    {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2 rounded-full">
                          <ExternalLink size={16} /> Live Demo
                        </Button>
                      </Link>
                    )}

                    {project.videoUrl && (
                      <Link href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 rounded-full bg-transparent"
                        >
                          <Play size={16} /> Demo Video
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
