'use client';

import { useEffect, useState } from 'react';
import { ResourceTable } from '@/components/admin/resource-table';
import { experienceAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  skills: string[];
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const response = await experienceAPI.getExperiences();
      setExperiences(response.data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load experiences';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    router.push(`/admin/experiences/${exp._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await experienceAPI.deleteExperience(id);
      toast.success('Experience deleted successfully');
      await loadExperiences();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete experience';
      toast.error(message);
      throw error;
    }
  };

  const columns = [
    {
      key: 'title' as const,
      label: 'Title',
    },
    {
      key: 'company' as const,
      label: 'Company',
    },
    {
      key: 'location' as const,
      label: 'Location',
    },
    {
      key: 'startDate' as const,
      label: 'Start Date',
    },
    {
      key: 'endDate' as const,
      label: 'End Date',
    },
  ];

  return (
    <ResourceTable<Experience>
      data={experiences}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      resourceName="Experiences"
      createHref="/admin/experiences/new"
      isLoading={isLoading}
    />
  );
}
