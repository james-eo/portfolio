'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { experienceAPI, projectsAPI, skillsAPI, educationAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Briefcase, FolderOpen, Award, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    experiences: 0,
    projects: 0,
    skills: 0,
    education: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [expRes, projRes, skillRes, eduRes] = await Promise.all([
          experienceAPI.getExperiences(),
          projectsAPI.getProjects(),
          skillsAPI.getSkillCategories(),
          educationAPI.getEducation(),
        ]);

        setStats({
          experiences: expRes.data?.length || expRes.count || 0,
          projects: projRes.data?.length || projRes.count || 0,
          skills: skillRes.data?.length || skillRes.count || 0,
          education: Array.isArray(eduRes.data) ? eduRes.data.length : 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Experiences',
      description: 'Manage your work experience',
      count: stats.experiences,
      href: '/admin/experiences',
      icon: Briefcase,
      color: 'bg-blue-500',
      key: 'experiences',
    },
    {
      title: 'Projects',
      description: 'Manage your projects',
      count: stats.projects,
      href: '/admin/projects',
      icon: FolderOpen,
      color: 'bg-purple-500',
      key: 'projects',
    },
    {
      title: 'Skills',
      description: 'Manage your skill categories',
      count: stats.skills,
      href: '/admin/skills',
      icon: Award,
      color: 'bg-green-500',
      key: 'skills',
    },
    {
      title: 'Education',
      description: 'Manage your education',
      count: stats.education,
      href: '/admin/education',
      icon: BookOpen,
      color: 'bg-orange-500',
      key: 'education',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-white">
              <div className="mb-2">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="mb-4">
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.key} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <div className={`${card.color} p-3 rounded-lg text-white`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">
                      {stats[card.key as keyof typeof stats] || 0}
                    </div>
                    <Link href={card.href}>
                      <Button variant="outline" size="sm">
                        Manage
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/experiences">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Briefcase className="mr-2" size={18} />
              Add New Experience
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <FolderOpen className="mr-2" size={18} />
              Add New Project
            </Button>
          </Link>
          <Link href="/admin/skills">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Award className="mr-2" size={18} />
              Add New Skill Category
            </Button>
          </Link>
          <Link href="/admin/about">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <BookOpen className="mr-2" size={18} />
              Edit About Section
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
