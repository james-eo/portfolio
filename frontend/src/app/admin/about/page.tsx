'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aboutSchema, type AboutFormData } from '@/lib/validation-schemas';
import { aboutAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const response = await aboutAPI.getAbout();
        reset(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load about information';
        toast.error(message);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadAbout();
  }, [reset]);

  const onSubmit = async (data: AboutFormData) => {
    setIsLoading(true);
    try {
      await aboutAPI.updateAbout(data);
      toast.success('About information updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update about information';
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
      <Link href="/admin" className="inline-block mb-4">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit About Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Professional Title */}
            <div>
              <Label htmlFor="title">Professional Title (Optional)</Label>
              <Input
                id="title"
                placeholder="e.g., Senior Software Engineer"
                {...register('title')}
              />
            </div>

            {/* Summary */}
            <div>
              <Label htmlFor="summary">Professional Summary *</Label>
              <Textarea
                id="summary"
                placeholder="Write a compelling summary about yourself..."
                {...register('summary')}
                className={errors.summary ? 'border-red-500' : ''}
                rows={6}
              />
              {errors.summary && (
                <p className="text-sm text-red-500 mt-1">{errors.summary.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" placeholder="City, Country" {...register('location')} />
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Social Links (Optional)</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    {...register('socialLinks.linkedin')}
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/yourprofile"
                    {...register('socialLinks.github')}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/yourprofile"
                    {...register('socialLinks.twitter')}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    {...register('socialLinks.website')}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info (Optional)</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register('contactInfo.email')}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('contactInfo.phone')}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Update About'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
