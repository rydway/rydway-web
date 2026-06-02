import { api } from '@/lib/api/client';

export interface SignedUrlResponse {
  signedUrl: string;
  token: string;
  path: string;
  fullPath: string;
}

export interface UploadResult {
  publicUrl: string;
  path: string;
}

const VEHICLE_BUCKET = 'vehicle-images';

/**
 * Requests a signed upload URL from our backend, then uploads the file
 * directly to Supabase Storage — keeping storage credentials off the client.
 */
export async function uploadVehicleImage(file: File, vehicleId?: string): Promise<UploadResult> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const folder = vehicleId ? `vehicles/${vehicleId}` : 'vehicles/pending';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${folder}/${fileName}`;

  // 1. Get signed URL from our backend
  const { data: signedData } = await api.post<{ data: SignedUrlResponse }>('/uploads/sign-url', {
    bucket: VEHICLE_BUCKET,
    filePath,
    mimeType: file.type,
    fileSizeBytes: file.size,
  });

  // 2. Upload directly to Supabase using the signed URL (PUT request)
  const uploadResponse = await fetch(signedData.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  }

  return {
    publicUrl: signedData.fullPath,
    path: signedData.path,
  };
}

/**
 * Upload multiple vehicle images concurrently.
 */
export async function uploadVehicleImages(
  files: File[],
  vehicleId?: string,
): Promise<UploadResult[]> {
  return Promise.all(files.map((f) => uploadVehicleImage(f, vehicleId)));
}

/**
 * Delete a vehicle image via our backend delete endpoint.
 */
export async function deleteVehicleImage(filePath: string): Promise<void> {
  await api.delete('/uploads', {
    body: { bucket: VEHICLE_BUCKET, filePath } as any,
  });
}
