/**
 * Image upload utilities for portfolio admin
 */

import axios from 'axios';
import { auth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload image to Cloudinary via backend
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'File validation failed');
  }

  const formData = new FormData();
  formData.append('image', file);

  const token = auth.getToken();

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: percentCompleted,
          });
        }
      },
    });

    if (response.data?.success && response.data?.data?.url) {
      return response.data.data.url;
    }

    throw new Error('Failed to upload image');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Image upload failed', { cause: error });
    }
    throw error;
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  const token = auth.getToken();

  try {
    await axios.delete(`${API_URL}/upload/${encodeURIComponent(publicId)}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  } catch (error) {
    console.error('Failed to delete image:', error);
    throw error;
  }
}

/**
 * Extract public ID from Cloudinary URL
 * Cloudinary URLs follow pattern: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/filename.ext
 * Public ID is: folder/filename
 */
export function extractPublicIdFromUrl(cloudinaryUrl: string): string {
  try {
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split('/');

    // Find the 'upload' part and get everything after it
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return '';

    // Get parts after upload (skip version number if present)
    const remainingParts = pathParts.slice(uploadIndex + 1);

    // Remove version (e.g., v1234567890) if it exists
    let startIndex = 0;
    if (remainingParts[0]?.startsWith('v')) {
      startIndex = 1;
    }

    // Join remaining parts and remove file extension
    let publicId = remainingParts.slice(startIndex).join('/');

    // Remove the file extension
    publicId = publicId.replace(/\.[^/.]+$/, '');

    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return '';
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit',
    };
  }

  return { valid: true };
}

/**
 * Convert file to base64 for preview or storage
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Create object URL for image preview
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke object URL to free memory
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Compress image before upload
 */
export async function compressImage(file: File, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                });
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        }
      };
      img.src = event.target?.result as string;
    };
  });
}
