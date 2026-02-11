'use client';

import { useEffect, useState } from 'react';
import { ResourceTable } from '@/components/admin/resource-table';
import { educationAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Education {
  _id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const response = await educationAPI.getEducation();
      setEducation(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load education';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (edu: Education) => {
    router.push(`/admin/education/${edu._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await educationAPI.deleteEducation(id);
      toast.success('Education deleted successfully');
      await loadEducation();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete education';
      toast.error(message);
    }
  };

  const columns = [
    {
      key: 'degree' as const,
      label: 'Degree',
    },
    {
      key: 'institution' as const,
      label: 'Institution',
    },
    {
      key: 'year' as const,
      label: 'Year',
    },
  ];

  return (
    <ResourceTable<Education>
      data={education}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      resourceName="Education"
      createHref="/admin/education/new"
      isLoading={isLoading}
    />
  );
}
