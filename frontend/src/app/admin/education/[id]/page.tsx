'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, type EducationFormData } from '@/lib/validation-schemas';
import { educationAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EducationPageProps {
  params: Promise<{ id?: string }>;
}

export default function EducationPage({ params }: EducationPageProps) {
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
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  });

  useEffect(() => {
    if (id) {
      const loadEducation = async () => {
        try {
          const response = await educationAPI.getEducationById(id);
          reset(response.data);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load education';
          toast.error(message);
          router.push('/admin/education');
        } finally {
          setIsLoadingData(false);
        }
      };
      loadEducation();
    }
  }, [id, reset, router]);

  const onSubmit = async (data: EducationFormData) => {
    setIsLoading(true);
    try {
      if (id) {
        await educationAPI.updateEducation(id, data);
        toast.success('Education updated successfully');
      } else {
        await educationAPI.createEducation(data);
        toast.success('Education created successfully');
      }
      router.push('/admin/education');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save education';
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
      <Link href="/admin/education" className="inline-block mb-4">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Education
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Education' : 'Add New Education'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Degree and Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  placeholder="Bachelor of Science"
                  {...register('degree')}
                  className={errors.degree ? 'border-red-500' : ''}
                />
                {errors.degree && (
                  <p className="text-sm text-red-500 mt-1">{errors.degree.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  placeholder="University of Technology"
                  {...register('institution')}
                  className={errors.institution ? 'border-red-500' : ''}
                />
                {errors.institution && (
                  <p className="text-sm text-red-500 mt-1">{errors.institution.message}</p>
                )}
              </div>
            </div>

            {/* Year */}
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                placeholder="2020 or 2020-2024"
                {...register('year')}
                className={errors.year ? 'border-red-500' : ''}
              />
              {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>}
            </div>

            {/* Details */}
            <div>
              <Label htmlFor="details">Details (Optional)</Label>
              <Textarea
                id="details"
                placeholder="Additional details about your education..."
                {...register('details')}
                rows={4}
              />
              {errors.details && (
                <p className="text-sm text-red-500 mt-1">{errors.details.message}</p>
              )}
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
                {isLoading ? 'Saving...' : id ? 'Update Education' : 'Create Education'}
              </Button>
              <Link href="/admin/education">
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
