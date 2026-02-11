'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, type Resolver, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, type ExperienceFormData } from '@/lib/validation-schemas';
import { experienceAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { X, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ExperiencePageProps {
  params: Promise<{ id?: string }>;
}

export default function ExperiencePage({ params }: ExperiencePageProps) {
  type FormValues = ExperienceFormData & FieldValues;

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
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(experienceSchema) as Resolver<FormValues>,
    defaultValues: {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: [''],
      skills: [],
      isCurrent: false,
      order: undefined,
    },
  });

  const {
    fields: descFields,
    append: appendDesc,
    remove: removeDesc,
  } = useFieldArray<FormValues, 'description'>({
    control,
    name: 'description',
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
      const loadExperience = async () => {
        try {
          const response = await experienceAPI.getExperience(id);
          reset(response.data);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load experience';
          toast.error(message);
          router.push('/admin/experiences');
        } finally {
          setIsLoadingData(false);
        }
      };
      loadExperience();
    }
  }, [id, router]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (id) {
        await experienceAPI.updateExperience(id, data);
        toast.success('Experience updated successfully');
      } else {
        await experienceAPI.createExperience(data);
        toast.success('Experience created successfully');
      }
      router.push('/admin/experiences');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save experience';
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
      <Link href="/admin/experiences" className="inline-block mb-4">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Experiences
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Experience' : 'Add New Experience'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="Senior Software Engineer"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Tech Company Inc."
                  {...register('company')}
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && (
                  <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  {...register('location')}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="order">Order (Optional)</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="1"
                  {...register('order', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  {...register('startDate')}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="month"
                  {...register('endDate')}
                  disabled={watch('isCurrent')}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Currently Working Here */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Checkbox id="isCurrent" {...register('isCurrent')} />
              <Label htmlFor="isCurrent" className="cursor-pointer font-normal m-0">
                I currently work here / This is my present position
              </Label>
            </div>

            {/* Description */}
            <div>
              <Label>Description Points *</Label>
              <div className="space-y-2 mt-2">
                {descFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder={`Description point ${index + 1}`}
                      {...register(`description.${index}`)}
                      className={errors.description?.[index] ? 'border-red-500' : ''}
                    />
                    {descFields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDesc(index)}
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
                onClick={() => appendDesc('')}
              >
                <Plus size={16} className="mr-1" />
                Add Description Point
              </Button>
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <Label>Skills (Optional)</Label>
              <div className="space-y-2 mt-2">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input placeholder={`Skill ${index + 1}`} {...register(`skills.${index}`)} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
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
                onClick={() => appendSkill('')}
              >
                <Plus size={16} className="mr-1" />
                Add Skill
              </Button>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : id ? 'Update Experience' : 'Create Experience'}
              </Button>
              <Link href="/admin/experiences">
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
