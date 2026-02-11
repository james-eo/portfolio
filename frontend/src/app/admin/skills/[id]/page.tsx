'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, type Resolver, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillCategorySchema, type SkillCategoryFormData } from '@/lib/validation-schemas';
import { skillsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SkillPageProps {
  params: Promise<{ id?: string }>;
}

export default function SkillPage({ params }: SkillPageProps) {
  type FormValues = SkillCategoryFormData & FieldValues;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      if (p.id && p.id !== 'new') {
        setId(p.id);
        setIsLoadingData(true);
      }
    });
  }, [params]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(skillCategorySchema) as Resolver<FormValues>,
    defaultValues: {
      name: '',
      skills: [''],
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray<FormValues, 'skills'>({
    control,
    name: 'skills',
  });

  useEffect(() => {
    if (id) {
      const loadSkill = async () => {
        try {
          const response = await skillsAPI.getSkillCategory(id);
          reset(response.data);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load skill category';
          toast.error(message);
          router.push('/admin/skills');
        } finally {
          setIsLoadingData(false);
        }
      };
      loadSkill();
    }
  }, [id, reset, router]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (id) {
        await skillsAPI.updateSkillCategory(id, data);
        toast.success('Skill category updated successfully');
      } else {
        await skillsAPI.createSkillCategory(data);
        toast.success('Skill category created successfully');
      }
      router.push('/admin/skills');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save skill category';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/skills" className="inline-block mb-4">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Skills
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Skill Category' : 'Add New Skill Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Name */}
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Frontend, Backend, DevOps"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Skills */}
            <div>
              <Label>Skills *</Label>
              <div className="space-y-2 mt-2">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder={`Skill ${index + 1}`}
                      {...register(`skills.${index}`)}
                      className={errors.skills?.[index] ? 'border-red-500' : ''}
                    />
                    {skillFields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="w-10"
                      >
                        <X size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendSkill('')}
              >
                <Plus size={16} className="mr-1" />
                Add Skill
              </Button>
              {errors.skills && (
                <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : id ? 'Update Skill Category' : 'Create Skill Category'}
              </Button>
              <Link href="/admin/skills">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
