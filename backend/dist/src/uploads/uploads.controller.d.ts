import { UploadsService, GetSignedUrlDto } from './uploads.service';
declare class DeleteFileDto {
    bucket: string;
    filePath: string;
}
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    getSignedUrl(dto: GetSignedUrlDto): Promise<{
        message: string;
        data: {
            signedUrl: string;
            token: string;
            path: string;
            fullPath: string;
        };
    }>;
    deleteFile(dto: DeleteFileDto): Promise<{
        message: string;
        data: null;
    }>;
}
export {};
