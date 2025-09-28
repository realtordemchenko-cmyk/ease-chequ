// This script attaches event handlers to buttons on the agent page.
// It works with data-action attributes if present, otherwise falls back to button text.

type ButtonHandler = (el: HTMLElement) => void;

// Generic navigation helper
const navigate = (url: string) => {
    try {
        window.location.href = url;
    } catch (e) {
        console.error('Navigation error:', e);
    }
};

// Find button by data-action or by text content
const findButton = (action: string, fallbacks: string[]): HTMLElement | null => {
    // 1) Search by data-action
    const byData = document.querySelector<HTMLElement>(`[data-action="${action}"]`);
    if (byData) return byData;

    // 2) Search by text content (case-insensitive, trimmed)
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    const candidates = Array.from(document.querySelectorAll<HTMLElement>('button, a, [role="button"]'));
    const targetSet = new Set(fallbacks.map(normalize));
    for (const el of candidates) {
        const text = normalize(el.textContent ?? '');
        if (targetSet.has(text)) return el;
    }

    return null;
};

// Safely attach handler
const wireHandler = (el: HTMLElement, handler: ButtonHandler) => {
    const existing = (el as any).__wiredHandler__;
    if (existing) return; // already wired

    const onClick = (ev: Event) => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'a') ev.preventDefault();
        handler(el);
    };

    el.addEventListener('click', onClick);
    (el as any).__wiredHandler__ = onClick;
};

// Action handlers
const handlers: Record<string, ButtonHandler> = {
    continueToDocuments: () => navigate('/documents.html'),
    addAgent: () => {
        alert('Add Agent functionality will be implemented later.');
    },
    saveProfile: () => {
        const name = (document.querySelector<HTMLInputElement>('#agent-name')?.value ?? '').trim();
        const email = (document.querySelector<HTMLInputElement>('#agent-email')?.value ?? '').trim();
        const phone = (document.querySelector<HTMLInputElement>('#agent-phone')?.value ?? '').trim();

        console.log('Saving agent profile:', { name, email, phone });
        alert('Agent profile saved locally (backend integration will be added).');
    },
    inviteCoAgent: () => {
        const coAgentEmail = prompt('Enter co-agent email to invite:');
        if (coAgentEmail) {
            console.log('Inviting co-agent:', coAgentEmail);
            alert(`Invitation sent to: ${coAgentEmail}`);
        }
    },
};

// Map of actions to possible button texts
const actionTextMap: Record<string, string[]> = {
    continueToDocuments: ['continue to documents', 'continue'],
    addAgent: ['add agent'],
    saveProfile: ['save profile', 'save'],
    inviteCoAgent: ['invite co-agent', 'invite collaborator', 'invite'],
};

// Initialize after DOM is ready
const init = () => {
    let wiredCount = 0;

    Object.entries(actionTextMap).forEach(([action, fallbacks]) => {
        const el = findButton(action, fallbacks);
        if (!el) {
            console.warn(`Button not found for action="${action}" (fallbacks=${JSON.stringify(fallbacks)})`);
            return;
        }
        wireHandler(el, handlers[action]);
        wiredCount += 1;
    });

    console.info(`Agent bootstrap: wired ${wiredCount} actions.`);
};

// Re-attach handlers if DOM changes dynamically
const observeMutations = () => {
    const observer = new MutationObserver(() => {
        init();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
};

document.addEventListener('DOMContentLoaded', () => {
    init();
    observeMutations();
});