// packages/types/documents.ts
export type DocumentType =
    | 'credit_report_equifax_pdf'
    | 'paystub'
    | 'employment_letter'
    | 'photo_id'
    | 'bank_statement'
    | 'noa';

export interface LocalDocumentDescriptor {
    id: string;               // локальный UUID
    type: DocumentType;
    role: 'applicant' | 'guarantor' | 'occupant';
    path?: string;            // File System Access handle reference (opaque)
    name: string;
    size: number;
    mime: string;
    sha256?: string;          // локально вычисленный хэш
    createdAt?: string;       // из метаданных файла / распознанных полей
}

export interface AnalysisMetadata {
    documentId: string;
    freshnessDays?: number;
    coverage?: { start: string; end: string };
    qualityScore?: number;    // 0..1
    aiFlags: Array<'OK' | 'NeedsAttention' | 'Flagged'>;
    reasons: string[];
    extracted: Record<string, string | number>; // поля для авто-заполнения
    nameSet?: { canonical: string[]; aka: string[]; discrepancies?: string[] };
}

export interface ConsentPayload {
    caseId: string;
    agentId: string;
    documentIds: string[];    // локальные IDs выбранных к передаче
    timestamp: string;
}