'use client';

import { useEffect, useState } from 'react';
import { ResourceTable } from '@/components/admin/resource-table';
import { projectsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      setProjects(response.data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load projects';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    router.push(`/admin/projects/${project._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsAPI.deleteProject(id);
      toast.success('Project deleted successfully');
      await loadProjects();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete project';
      toast.error(message);
      throw error;
    }
  };

  const columns: Array<{
    key: keyof Project;
    label: string;
    render?: (value: string | string[] | boolean, item: Project) => React.ReactNode;
  }> = [
    {
      key: 'title' as const,
      label: 'Title',
    },
    {
      key: 'description' as const,
      label: 'Description',
      render: (value: string | string[] | boolean) => (
        <div className="max-w-xs truncate">{value as string}</div>
      ),
    },
    {
      key: 'technologies' as const,
      label: 'Technologies',
      render: (value: string | string[] | boolean) => (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {(value as string[]).length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{(value as string[]).length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'featured' as const,
      label: 'Featured',
      render: (value: string | string[] | boolean) => (
        <Badge variant={(value as boolean) ? 'default' : 'outline'}>
          {(value as boolean) ? 'Featured' : 'Regular'}
        </Badge>
      ),
    },
  ];

  return (
    <ResourceTable<Project>
      data={projects}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      resourceName="Projects"
      createHref="/admin/projects/new"
      isLoading={isLoading}
    />
  );
}
