'use client';

import { useEffect, useState } from 'react';
import { ResourceTable } from '@/components/admin/resource-table';
import { skillsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface SkillCategory {
  _id: string;
  name: string;
  skills: string[];
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await skillsAPI.getSkillCategories();
      setSkills(response.data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load skills';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (skill: SkillCategory) => {
    router.push(`/admin/skills/${skill._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await skillsAPI.deleteSkillCategory(id);
      toast.success('Skill category deleted successfully');
      await loadSkills();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete skill';
      toast.error(message);
      throw error;
    }
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Category Name',
    },
    {
      key: 'skills' as const,
      label: 'Skills',
      render: (value: string | string[], item: SkillCategory) => (
        <div className="flex flex-wrap gap-1">
          {item.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {item.skills.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{item.skills.length - 4}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <ResourceTable<SkillCategory>
      data={skills}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      resourceName="Skills"
      createHref="/admin/skills/new"
      isLoading={isLoading}
    />
  );
}
