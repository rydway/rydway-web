'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { uploadFileToS3 } from '@/lib/api/uploads';
import { api } from '@/lib/api/client';

interface TripInspectionProps {
  bookingId: string;
  type: 'PRE' | 'POST';
  onComplete: () => void;
}

export default function TripInspection({ bookingId, type, onComplete }: TripInspectionProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 4 - photos.length);
      setPhotos((prev) => [...prev, ...selected]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (photos.length !== 4) return;
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of photos) {
        const url = await uploadFileToS3(file, 'vehicle-images', `inspections/${bookingId}/${type}`);
        uploadedUrls.push(url);
      }

      // Submit inspection record to backend
      await api.post('inspections', { bookingId, type, photoUrls: uploadedUrls });

      setCompleted(true);
      onComplete();
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  if (completed) {
    return (
      <Card className="p-6 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-bold">{type === 'PRE' ? 'Pre-Trip' : 'Post-Trip'} Inspection Complete</h3>
        <p className="text-muted-foreground">All 4 photos have been securely uploaded.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold">{type === 'PRE' ? 'Pre-Trip' : 'Post-Trip'} Inspection</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please upload exactly 4 clear exterior photos of the vehicle (Front, Back, Left Side, Right Side).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo, idx) => (
          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
            <Image src={URL.createObjectURL(photo)} alt={`Upload ${idx + 1}`} fill className="object-cover" />
            <button
              onClick={() => removePhoto(idx)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < 4 && (
          <label className="relative aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Camera className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-muted-foreground">Add Photo</span>
            <span className="text-xs text-muted-foreground">{4 - photos.length} remaining</span>
          </label>
        )}
      </div>

      <Button
        className="w-full"
        disabled={photos.length !== 4 || uploading}
        onClick={handleUpload}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" /> Submit Inspection
          </>
        )}
      </Button>
    </Card>
  );
}
