import { api } from '@/lib/api/client';

export const uploadService = {
  async getSignUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; downloadUrl: string }> {
    return api.post<{ uploadUrl: string; downloadUrl: string }>('/uploads/sign-url', {
      filename,
      contentType,
    });
  },

  async uploadToSignedUrl(url: string, file: File): Promise<void> {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file to cloud storage: ${response.statusText}`);
    }
  },

  async deleteFile(url: string): Promise<void> {
    let bucket = 'vehicle-images';
    let filePath = url;

    try {
      if (url.includes('/storage/v1/object/')) {
        const parts = url.split('/storage/v1/object/');
        if (parts.length > 1) {
          const subparts = parts[1].split('/');
          if (subparts.length > 2) {
            bucket = subparts[1];
            filePath = subparts.slice(2).join('/');
            if (filePath.includes('?')) {
              filePath = filePath.split('?')[0];
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse URL for deletion', e);
    }

    return api.delete<void>('/uploads', {
      body: { bucket, filePath }
    });
  },
};
