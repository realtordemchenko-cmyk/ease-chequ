# Admin Panel Error & Issue Log / Журнал Ошибок Админ-Панели

## Legend / Обозначения

- Status: FIXED (исправлено), PENDING (в работе), VERIFY (нужно подтвердить), DESIGN (решение планируется)
- Source: runtime, build, logic, UX

## Fixed Issues / Исправленные

1. Duplicate AdminStore definitions (context mismatch, null crashes)
   - Status: FIXED
   - Cause: Two separate AdminStore files created split React context state.
   - Resolution: Consolidated into `apps/web/app/store/AdminStore.tsx`; removed duplicate.
2. Multiple Next.js / React versions causing hydration & context null
   - Status: FIXED
   - Resolution: Unified Next.js to 14.2.3 and single React 18.2.0.
3. useContext / useReducer null runtime crashes on SSR prerender
   - Status: FIXED
   - Resolution: Added SSR-safe `useAdmin` returning `null`; mounted guards on pages & Topbar.
4. Prerender build failures (root/error pages accessing context early)
   - Status: FIXED (needs verification build)
   - Resolution: Added mounted (`useEffect`) guards before accessing admin state.
5. Agent archive functionality missing (archive not adding entries)
   - Status: FIXED
   - Resolution: Implemented `archiveAgent` (move active → archived, skip duplicates) and exposed in provider.
6. Invite link generation inconsistent (random UID format mismatch)
   - Status: FIXED
   - Resolution: Standardized to `/invite?agent=<agentId>` using `window.location.origin` fallback.
7. Stray `archiveAgent` property injected into new agent object during request approval
   - Status: FIXED
   - Resolution: Removed erroneous field; corrected invite link generation logic.

## Pending / Remaining / В работе

1. Agent duplication reports still occurring (possible race or UI state caching)
   - Status: VERIFY
   - Needed: Scenario test (add same email twice; add then archive then re-add) to confirm merge logic.
2. Logging duplication (approve request logs multiple entries: agent creation + request approved)
   - Status: DESIGN
   - Decision: Consider collapsing into single composite log or keep granular; needs product choice.
3. Production build SSR stability re-check after latest patches
   - Status: PENDING
   - Action: Run `pnpm build` and confirm no prerender errors on admin routes.
4. UI integration for Archive / Restore / Delete / Regenerate Invite / Copy Link
   - Status: PENDING
   - Action: Add buttons & handlers; confirm provider methods wired.
5. Consistent single-log policy per atomic action
   - Status: DESIGN
   - Define which multi-step flows get aggregated logs (e.g., request approval creating agent & archiving request).
6. Validation of archive cycle
   - Status: VERIFY
   - Test: Add agent → archive → restore → re-add by email; ensure one final active record and correct log sequence.
7. Hydration mismatch warnings (Fast Refresh full reload warnings)
   - Status: VERIFY
   - Check if warnings persist after consolidation; may be normal during rapid edits.

## Test Scenarios To Run / Сценарии Для Проверки

- Add Agent (new email): Expect log: "Agent X added".
- Add Agent (same email): Expect log: "Agent X updated (dedupe active)"; count unchanged.
- Archive Agent then Re-Add same email: Expect restore & update log; no duplicate entry.
- Approve Request with new email: Creates agent + request approved logs (consider consolidation later).
- Approve Request with existing agent email: Should NOT create new agent; logs existing match.
- Regenerate Invite Link: Link format `/invite?agent=<id>` and log entry.

## Next Actions / Следующие Шаги

1. Run production build to confirm SSR safety.
2. Implement UI controls (Archive/Restore/Delete/Invite Copy).
3. Execute dedupe + archive scenario tests; capture resulting logs.
4. Decide logging aggregation policy.
5. Add automated test(s) for add/archive/restore cycles.

## References / Ссылки

- Store: `apps/web/app/store/AdminStore.tsx`
- Hook: `useAdmin`
- Pages guarded: `app/page.tsx`, error pages (404/500/not-found)

## Changelog Anchor

(Keep updating this file as issues are discovered & resolved.)

Last Updated: 2025-11-30
