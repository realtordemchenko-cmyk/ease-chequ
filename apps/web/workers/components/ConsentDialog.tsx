// D:\Projects\Ease Chequ\apps\web\workers\components\ConsentDialog.tsx
import React, { useMemo, useState } from 'react';

type Role = 'applicant' | 'guarantor' | 'occupant';

export type DocumentType =
    | 'credit_report_equifax_pdf'
    | 'paystub'
    | 'employment_letter'
    | 'photo_id'
    | 'bank_statement'
    | 'noa';

export interface LocalDocumentDescriptor {
    id: string;
    type: DocumentType;
    role: Role;
    name: string;
    size: number;
    mime: string;
    fileHandle?: FileSystemFileHandle;
    fileBlob?: Blob;
    sha256?: string;
}

export interface ConsentDialogProps {
    caseId: string;
    agentId: string;
    selectedDocs: LocalDocumentDescriptor[];
    onClose: () => void;
    onUploaded?: (result: { uploadedCount: number; errors: Array<{ id: string; error: string }> }) => void;
}

interface PresignRequest {
    caseId: string;
    agentId: string;
    items: Array<{ id: string; type: DocumentType; mime: string; size: number }>;
}

interface PresignResponseItem {
    id: string;
    url: string;
    headers?: Record<string, string>;
    maxSize: number;
    allowedMime: string[];
    checksumRequired?: boolean;
}

const supportsFSAccess =
    typeof window !== 'undefined' &&
    ('showOpenFilePicker' in window || 'FileSystemHandle' in window);

export function ConsentDialog({ caseId, agentId, selectedDocs, onClose, onUploaded }: ConsentDialogProps) {
    const [status, setStatus] = useState<'idle' | 'confirming' | 'uploading' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Array<{ id: string; error: string }>>([]);

    const totalSize = useMemo(
        () => selectedDocs.reduce((sum, d) => sum + (d.size || 0), 0),
        [selectedDocs]
    );

    const confirmAndUpload = async () => {
        if (!selectedDocs.length) return;
        setStatus('confirming');

        try {
            const presignBody: PresignRequest = {
                caseId,
                agentId,
                items: selectedDocs.map(d => ({ id: d.id, type: d.type, mime: d.mime, size: d.size })),
            };

            const presignRes = await fetch('/api/uploads/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(presignBody),
            });
            if (!presignRes.ok) throw new Error(`Presign failed: ${presignRes.status}`);

            const presignedItems: PresignResponseItem[] = await presignRes.json();
            setStatus('uploading');

            const localErrors: Array<{ id: string; error: string }> = [];
            let uploadedCount = 0;

            for (const item of presignedItems) {
                const doc = selectedDocs.find(d => d.id === item.id);
                if (!doc) { localErrors.push({ id: item.id, error: 'Descriptor not found' }); continue; }
                if (!item.allowedMime.includes(doc.mime)) { localErrors.push({ id: doc.id, error: `Invalid MIME: ${doc.mime}` }); continue; }
                if (doc.size > item.maxSize) { localErrors.push({ id: doc.id, error: `File too large: ${doc.size} > ${item.maxSize}` }); continue; }

                let blob: Blob | undefined;
                if (supportsFSAccess && doc.fileHandle) {
                    const file = await doc.fileHandle.getFile();
                    blob = file;
                } else if (doc.fileBlob) {
                    blob = doc.fileBlob;
                } else {
                    localErrors.push({ id: doc.id, error: 'No file handle/blob available' });
                    continue;
                }

                const uploadRes = await fetch(item.url, {
                    method: 'PUT',
                    headers: { ...(item.headers ?? {}), 'Content-Type': doc.mime },
                    body: blob,
                });
                if (!uploadRes.ok) { localErrors.push({ id: doc.id, error: `Upload failed: ${uploadRes.status}` }); continue; }

                uploadedCount++;
            }

            const logRes = await fetch('/api/consent/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    caseId,
                    agentId,
                    documentIds: presignedItems.map(i => i.id),
                    timestamp: new Date().toISOString(),
                    totalSize,
                    uploadedCount,
                    errors: localErrors,
                }),
            });
            if (!logRes.ok) { localErrors.push({ id: 'consent-log', error: `Consent log failed: ${logRes.status}` }); }

            setErrors(localErrors);
            setStatus(localErrors.length ? 'error' : 'success');
            onUploaded?.({ uploadedCount, errors: localErrors });
        } catch (err: any) {
            setErrors([{ id: 'runtime', error: err?.message ?? 'Unknown error' }]);
            setStatus('error');
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="consent-dialog">
            <header><h2>Send selected documents to agent?</h2></header>
            <section>
                <p>Selected files: {selectedDocs.length} | Total size: {(totalSize / (1024 * 1024)).toFixed(2)} MB</p>
                <ul>
                    {selectedDocs.map(d => (
                        <li key={d.id}>
                            <span>{d.name}</span> — <span>{d.mime}</span> — <span>{(d.size / 1024).toFixed(1)} KB</span>
                        </li>
                    ))}
                </ul>
                {status === 'error' && errors.length > 0 && (
                    <div className="error-box" role="alert">
                        <strong>Upload issues:</strong>
                        <ul>{errors.map(e => (<li key={`${e.id}-${e.error}`}>{e.id}: {e.error}</li>))}</ul>
                    </div>
                )}
                {status === 'success' && (<div className="success-box" role="status">Documents sent successfully.</div>)}
            </section>
            <footer className="actions">
                <button onClick={onClose} disabled={status === 'uploading'}>Cancel</button>
                <button onClick={confirmAndUpload} disabled={status === 'uploading' || selectedDocs.length === 0}>
                    {status === 'uploading' ? 'Uploading…' : 'Confirm & Send'}
                </button>
            </footer>
            <style jsx>{`
        .consent-dialog { padding: 16px; max-width: 640px; }
        .actions { display: flex; gap: 8px; justify-content: flex-end; }
        .error-box { margin-top: 12px; color: #b00020; }
        .success-box { margin-top: 12px; color: #0a7f2e; }
      `}</style>
        </div>
    );
}