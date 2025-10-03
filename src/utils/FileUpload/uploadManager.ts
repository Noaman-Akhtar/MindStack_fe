// src/utils/uploadManager.ts
import { uploadToCloudinaryWithProgress } from './cloudinaryUpload';
import type { UploadProgressItem,CloudinaryUploadResult } from './cloudinaryUpload';


export function uploadManyWithProgress(
    files: File[],
    {
        onUpdate,
        concurrency = 4,
        onAllComplete
    }: {
        onUpdate: (items: UploadProgressItem[]) => void;
        concurrency?: number;
        onAllComplete?: (items: UploadProgressItem[]) => void;
    }
) {
    const queue = [...files];
    const items: UploadProgressItem[] = files.map((f, i) => ({
        id: `${Date.now()}-${i}-${f.name}`,
        file: f,
        percent: 0,
        status: 'pending'
    }));

    let active = 0;
    let finished = 0;
    let canceledGlobally = false;

    function startNext() {
        if (canceledGlobally) return;
        if (finished === items.length) {
            onAllComplete?.(items);
            return;
        }
        if (active >= concurrency) return;
        const file = queue.shift();
        if (!file) {
            if (active === 0) onAllComplete?.(items);
            return;
        }
        const item = items.find((it) => it.file === file)!;
        const controller = new AbortController();
        item.abortController = controller;
        item.status = 'uploading';
        item.percent = 0;
        active++;
        onUpdate([...items]);

        uploadToCloudinaryWithProgress(file, {
            signal: controller.signal,
            onProgress: (p) => {
                item.percent = p;
                item.status = 'uploading';
                onUpdate([...items]);
            }
        })
            .then((result) => {
                item.result = result;
                item.status = 'done';
                item.percent = 100;
            })
            .catch((err: any) => {
                if (controller.signal.aborted) {
                    item.status = 'canceled';
                    item.error = 'Upload canceled';
                } else {
                    item.status = 'error';
                    item.error = err.message || 'Upload failed';
                }
            })
            .finally(() => {
                active--;
                finished++;
                onUpdate([...items]);
                startNext();
                if (finished === items.length) {
                    onAllComplete?.(items);
                }
            });

        startNext();
    }

    for (let i = 0; i < concurrency; i++) startNext();

    return {
        items,
        cancelAll: () => {
            canceledGlobally = true;
            items.forEach((it) => {
                if (it.status === 'uploading' && it.abortController) {
                    it.abortController.abort();
                }
            });
            onUpdate([...items]);
        },
        retryItem: (id: string) => {
            const item = items.find((i) => i.id === id);
            if (!item) return;
            if (item.status !== 'error' && item.status !== 'canceled') return;
            item.status = 'pending';
            item.percent = 0;
            item.error = undefined;
            item.result = undefined;
            queue.push(item.file);
            startNext();
            onUpdate([...items]);
        },
        abortItem: (id: string) => {
            const item = items.find((i) => i.id === id);
            if (item && item.status === 'uploading' && item.abortController) {
                item.abortController.abort();
                item.status = 'canceled';
                onUpdate([...items]);
            }
        },
        successfulDocuments: () =>
            items
                .filter((i) => i.status === 'done' && i.result)
                .map((i) => ({
                    name: i.file.name,
                    url: i.result!.url,
                    type: i.file.type,
                    size: i.file.size,
                    cloudinaryId: i.result!.public_id
                }))
    };
}