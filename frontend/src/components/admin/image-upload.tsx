'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Image as ImageIcon } from 'lucide-react';
import {
  validateImageFile,
  createImagePreview,
  revokeImagePreview,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
  type UploadProgress,
} from '@/lib/image-upload';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onUpload: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onUpload,
  label = 'Upload Image',
  placeholder = 'Click to upload or drag and drop',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Show preview
    const previewUrl = createImagePreview(file);
    setPreview(previewUrl);

    // Upload file
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file, (prog: UploadProgress) => {
        setProgress(prog.percentage);
      });
      onUpload(uploadedUrl);
      toast.success('Image uploaded successfully');
      revokeImagePreview(previewUrl);
      setProgress(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(message);
      revokeImagePreview(previewUrl);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = async () => {
    // Delete from Cloudinary if it's an uploaded image
    if (value && value.startsWith('http')) {
      try {
        const publicId = extractPublicIdFromUrl(value);
        if (publicId) {
          await deleteImageFromCloudinary(publicId);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete image from server';
        toast.error(message);
      }
    }

    // Clear preview
    if (preview && !value?.startsWith('http')) {
      revokeImagePreview(preview);
    }
    setPreview(null);
    setProgress(0);
    onUpload('');
  };

  return (
    <div>
      <Label>{label}</Label>
      {preview ? (
        <div className="mt-2 space-y-2">
          <div className="relative rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4">
            <img src={preview} alt="Preview" className="h-32 w-full object-cover rounded" />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                <div className="text-center">
                  <div className="text-white mb-2">{Math.round(progress)}%</div>
                  <div className="w-32 h-1 bg-gray-300 rounded">
                    <div
                      className="h-full bg-blue-500 rounded transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X size={16} className="mr-1" />
            Remove Image
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="mt-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-400 transition"
        >
          <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">{placeholder}</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP or GIF (max 5MB)</p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={isUploading}
            className="mt-4 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
