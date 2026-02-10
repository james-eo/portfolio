'use client';

import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
}

interface ResourceTableProps<T extends { _id?: string; id?: string }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => Promise<void>;
  resourceName: string;
  createHref: string;
  isLoading?: boolean;
}

export function ResourceTable<T extends { _id?: string; id?: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  resourceName,
  createHref,
  isLoading = false,
}: ResourceTableProps<T>) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getId = (item: T): string => {
    return (item._id as string) || (item.id as string) || '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{resourceName}</h2>
          <p className="text-sm text-gray-600">
            Showing {data.length} {resourceName.toLowerCase()}
          </p>
        </div>
        <Link href={createHref}>
          <Button className="gap-2">
            <Plus size={18} />
            Add {resourceName.slice(0, -1)}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-gray-50">
          <p className="text-gray-600 mb-4">No {resourceName.toLowerCase()} yet</p>
          <Link href={createHref}>
            <Button variant="outline" className="gap-2">
              <Plus size={18} />
              Create your first {resourceName.slice(0, -1).toLowerCase()}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columns.map((column) => (
                    <TableHead key={String(column.key)} className="font-semibold">
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const itemId = getId(item);
                  return (
                    <TableRow key={itemId} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          {column.render
                            ? column.render(item[column.key], item)
                            : String(item[column.key])}
                        </TableCell>
                      ))}
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="gap-1"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(itemId)}
                          className="gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <AlertDialog
            open={deleteId !== null}
            onOpenChange={(open: boolean) => !open && setDeleteId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {resourceName.slice(0, -1)}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure you want to delete this item?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
