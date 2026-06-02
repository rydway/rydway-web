export declare class GetSignedUrlDto {
    bucket: string;
    filePath: string;
    mimeType: string;
    fileSizeBytes?: number;
}
export declare class UploadsService {
    private supabase;
    getSignedUploadUrl(dto: GetSignedUrlDto): Promise<{
        signedUrl: string;
        token: string;
        path: string;
        fullPath: string;
    }>;
    deleteFile(bucket: string, filePath: string): Promise<boolean>;
    getPublicUrl(bucket: string, filePath: string): string;
}
