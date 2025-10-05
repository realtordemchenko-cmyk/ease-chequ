// D:\Projects\Ease Chequ\apps\web\workers\lib\api.ts
export interface AnalysisMetadata {
    documentId: string;
    freshnessDays?: number;
    coverage?: { start: string; end: string };
    qualityScore?: number;
    aiFlags: Array<'OK' | 'NeedsAttention' | 'Flagged'>;
    reasons: string[];
    extracted: Record<string, string | number>;
    nameSet?: { canonical: string[]; aka: string[]; discrepancies?: string[] };
    sha256?: string;
}

export async function sendAnalysisMetadata(caseId: string, items: AnalysisMetadata[]) {
    const res = await fetch(`/api/cases/${caseId}/analysis/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error(`Metadata sync failed: ${res.status}`);
    return res.json();
}

export async function presignUploads(payload: {
    caseId: string;
    agentId: string;
    items: Array<{ id: string; type: string; mime: string; size: number }>;
}) {
    const res = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Presign failed: ${res.status}`);
    return res.json() as Promise<Array<{
        id: string;
        url: string;
        headers?: Record<string, string>;
        maxSize: number;
        allowedMime: string[];
        checksumRequired?: boolean;
    }>>;
}

export async function logConsent(payload: {
    caseId: string;
    agentId: string;
    documentIds: string[];
    timestamp: string;
    totalSize?: number;
    uploadedCount?: number;
    errors?: Array<{ id: string; error: string }>;
}) {
    const res = await fetch('/api/consent/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status };
}