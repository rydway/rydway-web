import { api } from './client';

interface SignUrlResponse {
  message: string;
  data: {
    signedUrl: string;
    token: string;
    path: string;
    fullPath: string;
  };
}

/**
 * Uploads a file directly to storage using a pre-signed URL from the backend.
 * @param file The file to upload
 * @param bucket The storage bucket (e.g., 'vehicle-images', 'kyc-documents')
 * @param pathPrefix The folder path (e.g., 'inspections')
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToS3(file: File, bucket: string, pathPrefix: string): Promise<string> {
  const filePath = `${pathPrefix}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  const signRes = await api.post<SignUrlResponse>('uploads/sign-url', {
    bucket,
    filePath,
    mimeType: file.type,
    fileSizeBytes: file.size,
  });

  if (!signRes?.data?.signedUrl) {
    throw new Error('Failed to get signed URL');
  }

  const uploadRes = await fetch(signRes.data.signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadRes.ok) {
    throw new Error('Failed to upload file to storage');
  }

  return signRes.data.fullPath;
}
