'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { contactAPI } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Mail, User, Calendar, Trash2, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function ContactDetailPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      setIsLoading(true);
      const response = await contactAPI.getContact(id);
      setContact(response.data);

      // Mark as read when viewing
      if (!response.data.read) {
        await contactAPI.toggleReadStatus(id);
        setContact((prev) => (prev ? { ...prev, read: true } : null));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load contact';
      toast.error(message);
      router.push('/admin/contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactAPI.deleteContact(id);
      toast.success('Contact deleted successfully');
      router.push('/admin/contacts');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete contact';
      toast.error(message);
    }
  };

  const handleCopyEmail = () => {
    if (contact?.email) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Contact not found</p>
        <Link href="/admin/contacts">
          <Button>Back to Messages</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/contacts">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Messages
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{contact.subject}</CardTitle>
              <CardDescription className="text-base mt-2">
                {contact.read ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓ Read</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-semibold">● Unread</span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sender Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User size={16} />
                Sender Name
              </div>
              <p className="font-semibold text-lg">{contact.name}</p>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} />
                Email Address
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">{contact.email}</p>
                <button
                  onClick={handleCopyEmail}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  {copied ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Date Info */}
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              Submitted On
            </div>
            <p className="font-semibold">
              {new Date(contact.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Message</h3>
            <div className="border rounded-lg p-6 bg-muted/30 whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {contact.message}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <a href={`mailto:${contact.email}`}>
              <Button>
                <Mail size={16} className="mr-2" />
                Reply via Email
              </Button>
            </a>

            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 size={16} />
              Delete Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
