
import axios from 'axios';

export interface CloudinaryUploadResult {
    url: string;
    public_id: string;
    format: string;
    resource_type: string;
}

export interface UploadProgressItem {
    id: string;
    file: File;
    percent: number;
    status: 'pending' | 'uploading' | 'done' | 'error' | 'canceled';
    error?: string;
    result?: CloudinaryUploadResult;
    abortController?: AbortController;
}

const BACKEND_BASE =
    (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:3020';

export async function uploadToCloudinaryWithProgress(
    file: File,
    opts?: {
        onProgress?: (percent: number, loaded: number, total: number) => void;
        signal?: AbortSignal;
    }
): Promise<CloudinaryUploadResult> {
    const { data: sigData } = await axios.post(`${BACKEND_BASE}/api/v1/cloudinary/signature`);
    const { timestamp, signature } = sigData;

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const res = await axios.post<CloudinaryUploadResult>(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        formData,
        {
            signal: opts?.signal,
            onUploadProgress: (e) => {
                if (!e.total) return;
                const percent = Math.round((e.loaded / e.total) * 100);
                opts?.onProgress?.(percent, e.loaded, e.total);
            }
        }
    );

    return res.data;
}