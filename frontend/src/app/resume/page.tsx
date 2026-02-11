'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Star } from 'lucide-react';
import ModernResume from '@/components/resume/modern-resume';
import ProfessionalResume from '@/components/resume/professional-resume';
import CreativeResume from '@/components/resume/creative-resume';
import TechnicalResume from '@/components/resume/technical-resume';
import MinimalResume from '@/components/resume/minimal-resume';

const templates = [
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Clean and minimal design perfect for any industry',
    category: 'minimal',
    rating: 4.8,
    downloads: 1250,
    component: MinimalResume,
  },
  {
    id: 'modern',
    name: 'Modern Creative',
    description: 'Contemporary design with creative elements',
    category: 'modern',
    rating: 4.6,
    downloads: 980,
    component: ModernResume,
  },
  {
    id: 'professional',
    name: 'Professional Executive',
    description: 'Traditional professional layout for corporate environments',
    category: 'professional',
    rating: 4.7,
    downloads: 1100,
    component: ProfessionalResume,
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Bold and creative design for creative professionals',
    category: 'creative',
    rating: 4.5,
    downloads: 750,
    component: CreativeResume,
  },
  {
    id: 'technical',
    name: 'Technical Engineer',
    description: 'Optimized layout for technical and engineering roles',
    category: 'technical',
    rating: 4.9,
    downloads: 890,
    component: TechnicalResume,
  },
];

export default function ResumePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'minimal', 'modern', 'professional', 'creative', 'technical'];

  const filteredTemplates =
    activeCategory === 'all'
      ? templates
      : templates.filter((template) => template.category === activeCategory);

  const handleDownload = async (templateId: string) => {
    // This would integrate with your resume generation API
    console.log('Downloading template:', templateId);
  };

  const handlePreview = (template: (typeof templates)[0]) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Resume Templates</h1>
          <p className="text-xl text-muted-foreground">
            Choose from our collection of professional resume templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Browse and select a template</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="space-y-4">
                    {filteredTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-colors ${
                          selectedTemplate.id === template.id
                            ? 'ring-2 ring-primary'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handlePreview(template)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              {template.rating}
                            </div>
                            <div>{template.downloads} downloads</div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(template);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(template.id);
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Use
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                  <Button onClick={() => handleDownload(selectedTemplate.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="transform scale-75 origin-top-left">
                    <selectedTemplate.component />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
