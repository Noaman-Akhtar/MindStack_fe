import React, { useState } from 'react';
import { uploadManyWithProgress } from './uploadManager';
import type { UploadProgressItem } from './cloudinaryUpload';
interface MultiUploaderProps {
    onComplete?: (docs: {
        name: string;
        url: string;
        type: string;
        size: number;
        cloudinaryId: string;
    }[]) => void;
}

export const MultiUploader: React.FC<MultiUploaderProps> = ({ onComplete }) => {
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [items, setItems] = useState<UploadProgressItem[]>([]);
    const [uploader, setUploader] = useState<ReturnType<typeof uploadManyWithProgress> | null>(null);
    const [phase, setPhase] = useState<'idle' | 'uploading' | 'done'>('idle');
    const [summary, setSummary] = useState<string>('');

    function handleStart() {
        if (pendingFiles.length === 0) return;
        setItems([]);
        setSummary('');
        setPhase('uploading');
        const u = uploadManyWithProgress(pendingFiles, {
            onUpdate: (updated) => setItems(updated),
            onAllComplete: (finalItems) => {
                setPhase('done');
                setPendingFiles([]);
                setUploader(null);
                const success = finalItems.filter(f => f.status === 'done').length;
                const failed = finalItems.filter(f => f.status === 'error').length;
                const canceled = finalItems.filter(f => f.status === 'canceled').length;
                const msgParts = [];
                if (success) msgParts.push(`${success} succeeded`);
                if (failed) msgParts.push(`${failed} failed`);
                if (canceled) msgParts.push(`${canceled} canceled`);
                setSummary(
                    msgParts.length
                        ? `All uploads complete: ${msgParts.join(', ')}.`
                        : 'Nothing uploaded.'
                );
                const docs = u.successfulDocuments();
                onComplete?.(docs);
            },
            concurrency: 3
        });
        setUploader(u);
    }

    function overallPercent() {
        if (items.length === 0) return 0;
        const sum = items.reduce((acc, i) => acc + (i.percent || 0), 0);
        return Math.round(sum / items.length);
    }

    const disableSelect = phase === 'uploading';

    return (
        <div className="border rounded p-4 space-y-4 bg-white">
            <div className="flex items-center gap-3">
                <input
                    type="file"
                    multiple
                    disabled={disableSelect}
                    onChange={(e) => setPendingFiles(Array.from(e.target.files || []))}
                    className="text-sm"
                />
                <button
                    onClick={handleStart}
                    disabled={pendingFiles.length === 0 || phase === 'uploading'}
                    className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                >
                    {phase === 'uploading' ? 'Uploading...' : 'Start Uploads'}
                </button>
                {phase === 'uploading' && (
                    <button
                        onClick={() => {
                            uploader?.cancelAll();
                            setUploader(null);
                        }}
                        className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                        Cancel All
                    </button>
                )}
            </div>

            {pendingFiles.length > 0 && phase === 'idle' && (
                <ul className="text-sm text-gray-700 list-disc pl-5">
                    {pendingFiles.map((f) => (
                        <li key={f.name}>
                            {f.name} ({(f.size / 1024).toFixed(1)} KB)
                        </li>
                    ))}
                </ul>
            )}

            {phase === 'uploading' && (
                <div>
                    <div className="w-full bg-gray-200 h-3 rounded overflow-hidden mb-2">
                        <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${overallPercent()}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-600">Overall: {overallPercent()}%</div>
                </div>
            )}

            {items.length > 0 && (
                <ul className="space-y-2 text-sm">
                    {items.map((it) => (
                        <li key={it.id} className="border rounded p-2 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-medium">{it.file.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {(it.file.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                                <div className="mt-1 h-2 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className={`h-full ${it.status === 'error'
                                                ? 'bg-red-500'
                                                : it.status === 'canceled'
                                                    ? 'bg-gray-400'
                                                    : it.status === 'done'
                                                        ? 'bg-green-500'
                                                        : 'bg-blue-500'
                                            } transition-all`}
                                        style={{ width: `${it.percent}%` }}
                                    />
                                </div>
                                <div className="mt-1 text-xs">
                                    {it.status === 'uploading' &&
                                        (it.percent < 100 ? `Uploading (${it.percent}%)…` : 'Processing…')}
                                    {it.status === 'done' && 'Completed ✔'}
                                    {it.status === 'error' && `Upload failed. ${it.error || ''}`}
                                    {it.status === 'canceled' && 'Upload canceled.'}
                                    {it.status === 'pending' && 'Queued…'}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                {it.status === 'uploading' && (
                                    <button
                                        onClick={() => uploader?.abortItem(it.id)}
                                        className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                                    >
                                        Abort
                                    </button>
                                )}
                                {(it.status === 'error' || it.status === 'canceled') && (
                                    <button
                                        onClick={() => uploader?.retryItem(it.id)}
                                        className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
                                    >
                                        Retry
                                    </button>
                                )}
                                {it.status === 'done' && it.result && (
                                    <a
                                        href={it.result.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 underline"
                                    >
                                        open
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {phase === 'done' && (
                <div className="text-sm font-medium text-gray-700">{summary}</div>
            )}

            {phase === 'done' && items.some(i => i.status === 'error') && (
                <div className="text-xs text-red-600">
                    Some uploads failed. You can re-select failed files and upload again.
                </div>
            )}
        </div>
    );
};