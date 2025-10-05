// D:\Projects\Ease Chequ\apps\web\workers\analysis.worker.ts
/// <reference lib="webworker" />
import { computeSha256 } from './crypto';
import { extractFields } from './extract';
import { estimateQuality } from './quality';
import { ruleFlags, computeFreshness, computeCoverage, computeNames } from './rules';

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
    name: string;
    size: number;
    mime: string;
}

export interface AnalysisRequest {
    fileHandle?: FileSystemFileHandle;
    fileBlob?: Blob;
    descriptor: LocalDocumentDescriptor;
}

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

self.onmessage = async (e: MessageEvent) => {
    const { fileHandle, fileBlob, descriptor } = e.data as AnalysisRequest;

    try {
        let blob: Blob | undefined;
        if (fileHandle) {
            const file = await fileHandle.getFile();
            blob = file;
        } else if (fileBlob) {
            blob = fileBlob;
        } else {
            throw new Error('No file source provided');
        }

        const arrayBuffer = await blob.arrayBuffer();
        const sha256 = await computeSha256(arrayBuffer);
        const extracted = await extractFields(arrayBuffer, descriptor.type);
        const qualityScore = estimateQuality(arrayBuffer, descriptor.mime);
        const flags = ruleFlags(descriptor.type, extracted, qualityScore);

        const metadata: AnalysisMetadata = {
            documentId: descriptor.id,
            aiFlags: flags.statuses,
            reasons: flags.reasons,
            qualityScore,
            extracted,
            freshnessDays: computeFreshness(extracted),
            coverage: computeCoverage(extracted),
            nameSet: computeNames(extracted),
            sha256,
        };

        (self as unknown as Worker).postMessage({ metadata });
    } catch (err: any) {
        (self as unknown as Worker).postMessage({ error: err?.message ?? 'Unknown error' });
    }
};