// D:\Projects\Ease Chequ\server\services\notifications.ts
import { sendEmail } from './email';
import { withRetry } from './retry';
import { getAgentContact, getCaseSummary } from './cases';

export async function notifyAgentDocumentsReady(agentId: string, caseId: string) {
    const agent = await getAgentContact(agentId);
    const summary = await getCaseSummary(caseId); // statuses, counts, not binaries

    const subject = `Case ${caseId}: Document analysis complete`;
    const body = `Statuses: ${summary.statusCountsString}\nLogin to download documents (if consented).`;

    await withRetry(async () => sendEmail(agent.email, subject, body), { retries: 3, delayMs: 1000 });
}