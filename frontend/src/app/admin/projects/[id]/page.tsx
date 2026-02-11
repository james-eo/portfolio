'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, type Resolver, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/lib/validation-schemas';
import { projectsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { X, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

interface ProjectPageProps {
  params: Promise<{ id?: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  type FormValues = ProjectFormData & FieldValues;

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
    resolver: zodResolver(projectSchema) as Resolver<FormValues>,
    defaultValues: {
      title: '',
      description: '',
      technologies: [''],
      outcomes: [],
      githubUrl: '',
      liveUrl: '',
      featured: false,
      order: undefined,
    },
  });

  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray<FormValues, 'technologies'>({
    control,
    name: 'technologies',
  });

  const {
    fields: outcomeFields,
    append: appendOutcome,
    remove: removeOutcome,
  } = useFieldArray<FormValues, 'outcomes'>({
    control,
    name: 'outcomes',
  });

  useEffect(() => {
    if (id) {
      const loadProject = async () => {
        try {
          const response = await projectsAPI.getProject(id);
          // Transform Project type to ProjectFormData (strip non-form fields)
          const projectData: ProjectFormData = {
            title: response.data.title,
            description: response.data.description,
            technologies: response.data.technologies,
            outcomes: response.data.outcomes || [],
            githubUrl: response.data.githubUrl || '',
            liveUrl: response.data.liveUrl || '',
            featured: response.data.featured || false,
            order: response.data.order,
          };
          reset(projectData);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load project';
          toast.error(message);
          router.push('/admin/projects');
        } finally {
          setIsLoadingData(false);
        }
      };
      loadProject();
    }
  }, [id, reset, router]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (id) {
        await projectsAPI.updateProject(id, data);
        toast.success('Project updated successfully');
      } else {
        await projectsAPI.createProject(data);
        toast.success('Project created successfully');
      }
      router.push('/admin/projects');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save project';
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
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="inline-block mb-4">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Projects
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Project' : 'Add New Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="E-commerce Platform"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your project..."
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Technologies */}
            <div>
              <Label>Technologies *</Label>
              <div className="space-y-2 mt-2">
                {techFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder={`Technology ${index + 1}`}
                      {...register(`technologies.${index}`)}
                      className={errors.technologies?.[index] ? 'border-red-500' : ''}
                    />
                    {techFields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTech(index)}
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
                onClick={() => appendTech('')}
              >
                <Plus size={16} className="mr-1" />
                Add Technology
              </Button>
              {errors.technologies && (
                <p className="text-sm text-red-500 mt-1">{errors.technologies.message}</p>
              )}
            </div>

            {/* Outcomes */}
            <div>
              <Label>Key Outcomes (Optional)</Label>
              <div className="space-y-2 mt-2">
                {outcomeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder={`Outcome ${index + 1}`}
                      {...register(`outcomes.${index}`)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOutcome(index)}
                      className="w-10"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendOutcome('')}
              >
                <Plus size={16} className="mr-1" />
                Add Outcome
              </Button>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/..."
                  {...register('githubUrl')}
                  className={errors.githubUrl ? 'border-red-500' : ''}
                />
                {errors.githubUrl && (
                  <p className="text-sm text-red-500 mt-1">{errors.githubUrl.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="liveUrl">Live URL (Optional)</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  placeholder="https://..."
                  {...register('liveUrl')}
                  className={errors.liveUrl ? 'border-red-500' : ''}
                />
                {errors.liveUrl && (
                  <p className="text-sm text-red-500 mt-1">{errors.liveUrl.message}</p>
                )}
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox id="featured" {...register('featured')} />
              <Label htmlFor="featured" className="cursor-pointer">
                Mark as featured project
              </Label>
            </div>

            {/* Order */}
            <div>
              <Label htmlFor="order">Display Order (Optional)</Label>
              <Input
                id="order"
                type="number"
                placeholder="1"
                {...register('order', { valueAsNumber: true })}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : id ? 'Update Project' : 'Create Project'}
              </Button>
              <Link href="/admin/projects">
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
