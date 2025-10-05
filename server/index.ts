// D:\Projects\Ease Chequ\server\index.ts
import express from 'express';
import bodyParser from 'body-parser';
import { presignService } from './services/uploads';
import { rbacMiddleware, ensureSubscriptionActive, ensureCaseOwnership } from './services/security';
import { saveAnalysisMetadata } from './services/analysis';
import { logConsent } from './services/consent';

const app = express();
app.use(bodyParser.json());

// Метаданные анализа (без бинарных данных)
app.post('/api/cases/:id/analysis/metadata',
    rbacMiddleware(['applicant', 'guarantor', 'occupant', 'agent']),
    ensureCaseOwnership(),
    async (req, res) => {
        try {
            const caseId = req.params.id;
            const { items } = req.body as { items: any[] };
            await saveAnalysisMetadata(caseId, items);
            res.json({ ok: true });
        } catch (e: any) {
            res.status(400).json({ ok: false, error: e?.message ?? 'Bad request' });
        }
    }
);

// Presign для согласованных загрузок
app.post('/api/uploads/presign',
    rbacMiddleware(['applicant', 'guarantor', 'occupant']),
    ensureSubscriptionActive(),
    ensureCaseOwnership(),
    async (req, res) => {
        try {
            const { caseId, agentId, items } = req.body as {
                caseId: string; agentId: string; items: Array<{ id: string; type: string; mime: string; size: number }>;
            };
            const presigned = await presignService({ caseId, agentId, items });
            res.json(presigned);
        } catch (e: any) {
            res.status(400).json({ ok: false, error: e?.message ?? 'Bad request' });
        }
    }
);

// Лог согласия
app.post('/api/consent/log',
    rbacMiddleware(['applicant', 'guarantor', 'occupant']),
    ensureCaseOwnership(),
    async (req, res) => {
        try {
            await logConsent(req.body);
            res.json({ ok: true });
        } catch (e: any) {
            res.status(400).json({ ok: false, error: e?.message ?? 'Bad request' });
        }
    }
);

app.listen(process.env.PORT || 3001, () => {
    console.log('Server started');
});