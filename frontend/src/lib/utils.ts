import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function downloadResume(templateName: string): Promise<boolean> {
  if (!templateName) {
    throw new Error('Template name is required');
  }

  if (typeof window === 'undefined') {
    throw new Error('downloadResume must be called in the browser');
  }

  const token = auth.getToken();
  const url = `${API_URL}/resume/${encodeURIComponent(templateName)}?download=true`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/pdf',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let message = `Failed to download resume (${response.status})`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorBody = await response.json();
        if (errorBody?.message) {
          message = errorBody.message;
        }
      } else {
        const text = await response.text();
        if (text) message = text;
      }
    } catch {
      // Ignore parsing errors and use default message
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition');
  const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
  const filename = filenameMatch?.[1] ?? `resume-${templateName}.pdf`;

  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return true;
}
