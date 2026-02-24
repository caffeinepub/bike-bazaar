import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetWebsiteContent, useUpdateWebsiteContent } from '../hooks/useQueries';
import { Edit3, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ContentEditor() {
  const { data: content, isLoading } = useGetWebsiteContent();
  const updateContent = useUpdateWebsiteContent();

  const [aboutPage, setAboutPage] = useState('');
  const [heroSection, setHeroSection] = useState('');
  const [footerInfo, setFooterInfo] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Initialize form values when content loads
  useState(() => {
    if (content) {
      setAboutPage(content.aboutPage);
      setHeroSection(content.heroSection);
      setFooterInfo(content.footerInfo);
    }
  });

  const handleSave = async (section: 'about' | 'hero' | 'footer') => {
    try {
      await updateContent.mutateAsync({
        aboutPage: section === 'about' ? aboutPage : content?.aboutPage || '',
        heroSection: section === 'hero' ? heroSection : content?.heroSection || '',
        footerInfo: section === 'footer' ? footerInfo : content?.footerInfo || '',
      });
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully`);
      setEditingSection(null);
    } catch (error) {
      toast.error('Failed to update content');
      console.error('Update error:', error);
    }
  };

  const handleCancel = (section: 'about' | 'hero' | 'footer') => {
    if (content) {
      if (section === 'about') setAboutPage(content.aboutPage);
      if (section === 'hero') setHeroSection(content.heroSection);
      if (section === 'footer') setFooterInfo(content.footerInfo);
    }
    setEditingSection(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Content Management
          </CardTitle>
          <CardDescription>
            Edit website content including hero section, about page, and footer information
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Main landing page hero text and call-to-action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero">Hero Content</Label>
            <Textarea
              id="hero"
              value={heroSection}
              onChange={(e) => setHeroSection(e.target.value)}
              disabled={editingSection !== 'hero' && editingSection !== null}
              rows={6}
              placeholder="Enter hero section content..."
            />
          </div>
          <div className="flex gap-2">
            {editingSection === 'hero' ? (
              <>
                <Button
                  onClick={() => handleSave('hero')}
                  disabled={updateContent.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateContent.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancel('hero')}
                  disabled={updateContent.isPending}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditingSection('hero')}
                disabled={editingSection !== null}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About Page */}
      <Card>
        <CardHeader>
          <CardTitle>About Page</CardTitle>
          <CardDescription>About us page content and founder information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about">About Content</Label>
            <Textarea
              id="about"
              value={aboutPage}
              onChange={(e) => setAboutPage(e.target.value)}
              disabled={editingSection !== 'about' && editingSection !== null}
              rows={8}
              placeholder="Enter about page content..."
            />
          </div>
          <div className="flex gap-2">
            {editingSection === 'about' ? (
              <>
                <Button
                  onClick={() => handleSave('about')}
                  disabled={updateContent.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateContent.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancel('about')}
                  disabled={updateContent.isPending}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditingSection('about')}
                disabled={editingSection !== null}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Information</CardTitle>
          <CardDescription>Footer contact information and links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer">Footer Content</Label>
            <Textarea
              id="footer"
              value={footerInfo}
              onChange={(e) => setFooterInfo(e.target.value)}
              disabled={editingSection !== 'footer' && editingSection !== null}
              rows={6}
              placeholder="Enter footer content..."
            />
          </div>
          <div className="flex gap-2">
            {editingSection === 'footer' ? (
              <>
                <Button
                  onClick={() => handleSave('footer')}
                  disabled={updateContent.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateContent.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancel('footer')}
                  disabled={updateContent.isPending}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditingSection('footer')}
                disabled={editingSection !== null}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
