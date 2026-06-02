import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';

export function useFileUpload() {
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // 1. Get the pre-signed URL from our backend
      const { uploadUrl, downloadUrl } = await uploadService.getSignUrl(file.name, file.type);
      
      // 2. Upload directly to the cloud bucket (S3, GCS, etc.)
      await uploadService.uploadToSignedUrl(uploadUrl, file);

      // 3. Return the public download URL to be saved in our database
      return downloadUrl;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (url: string) => uploadService.deleteFile(url),
  });

  return {
    uploadFile: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error as Error | null,
    
    deleteFile: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
