'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contactAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Eye, Trash2, Mail, Calendar, MessageSquare } from 'lucide-react';
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

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const response = await contactAPI.getContacts();
      setContacts(response.data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load contacts';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactAPI.deleteContact(id);
      toast.success('Contact deleted successfully');
      await loadContacts();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete contact';
      toast.error(message);
    }
  };

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await contactAPI.toggleReadStatus(id);
      toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
      await loadContacts();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      toast.error(message);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'unread') return !contact.read;
    if (filter === 'read') return contact.read;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-2">Manage and respond to contact form submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <Mail className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Read</p>
                <p className="text-2xl font-bold">{contacts.length - unreadCount}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          All Messages ({contacts.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
        >
          Read ({contacts.length - unreadCount})
        </Button>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No messages found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <Card
              key={contact._id}
              className={`border transition-colors ${
                !contact.read ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{contact.subject}</CardTitle>
                      {!contact.read && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200">
                          New
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-base mt-1">
                      From: <span className="font-semibold">{contact.name}</span>
                      {' · '}
                      <span className="text-muted-foreground">{contact.email}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{contact.message}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={14} />
                    {new Date(contact.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/admin/contacts/${contact._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(contact._id, contact.read)}
                      className={!contact.read ? 'text-blue-600' : ''}
                    >
                      {contact.read ? 'Mark Unread' : 'Mark Read'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
