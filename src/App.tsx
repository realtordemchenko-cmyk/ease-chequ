import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Types
type Theme = 'light' | 'dark';
type CaseType = 'client-link' | 'agent-upload';
type CaseStatus = 'new' | 'in-progress' | 'completed';

type AgentProfile = {
  fullName: string;
  email: string;
  memberNumber: string;
};

type CaseItem = {
  id: string;
  name: string;       // client full name
  email: string;      // client email
  type: CaseType;
  status: CaseStatus;
  createdAt: string;
};

const DEFAULT_AGENT_ID = 'agent-001';
const DEFAULT_GROUP_ID = 'group-001';

// LocalStorage keys
const LS_CASES = 'agent_cases';
const LS_AGENT = 'agent_profile';
const LS_THEME = 'agent_theme';

const App: React.FC = () => {
  // Theme
  const [theme, setTheme] = useState<Theme>('light');

  // Agent profile
  const [agent, setAgent] = useState<AgentProfile>({
    fullName: '',
    email: '',
    memberNumber: '',
  });

  // Cases
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Modals
  const [showClientLinkModal, setShowClientLinkModal] = useState(false);
  const [showAgentUploadModal, setShowAgentUploadModal] = useState(false);
  const [showAgentSettingsModal, setShowAgentSettingsModal] = useState(false);
  const [deleteTargetCaseId, setDeleteTargetCaseId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCases = JSON.parse(localStorage.getItem(LS_CASES) || '[]') as CaseItem[];
      const savedAgent = JSON.parse(localStorage.getItem(LS_AGENT) || 'null') as AgentProfile | null;
      const savedTheme = (localStorage.getItem(LS_THEME) as Theme | null) || 'light';

      setCases(Array.isArray(savedCases) ? savedCases : []);
      if (savedAgent) setAgent(savedAgent);
      setTheme(savedTheme);
    } catch {
      // If LS broken, start clean
      setCases([]);
      setAgent({ fullName: '', email: '', memberNumber: '' });
      setTheme('light');
    }
  }, []);

  // Persist cases
  useEffect(() => {
    localStorage.setItem(LS_CASES, JSON.stringify(cases));
  }, [cases]);

  // Persist agent
  useEffect(() => {
    localStorage.setItem(LS_AGENT, JSON.stringify(agent));
  }, [agent]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem(LS_THEME, theme);
  }, [theme]);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // Derived
  const selectedCase = useMemo(
    () => cases.find(c => c.id === selectedCaseId) || null,
    [cases, selectedCaseId]
  );

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [cases, search]);

  // Utils
  const genId = () => Math.random().toString(36).slice(2, 10);

  const buildClientUrl = (caseId: string) => {
    // Link opens the existing client page flow with context
    const base = window.location.origin;
    const params = new URLSearchParams({
      agentId: DEFAULT_AGENT_ID,
      groupId: DEFAULT_GROUP_ID,
      caseId,
    });
    return `${base}/?${params.toString()}`;
  };

  const addCase = (payload: Omit<CaseItem, 'id' | 'createdAt' | 'status'>) => {
    const id = genId();
    const item: CaseItem = {
      id,
      name: payload.name,
      email: payload.email,
      type: payload.type,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setCases(prev => [item, ...prev]);
    setSelectedCaseId(id);
    return item;
  };

  const removeCase = (id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
    if (selectedCaseId === id) setSelectedCaseId(null);
  };

  // Actions
  const handleGenerateClientLink = () => {
    setShowClientLinkModal(true);
  };

  const handleUploadClientDocuments = () => {
    setShowAgentUploadModal(true);
  };

  const handleInviteAgent = () => {
    const email = prompt('Enter co-agent email:');
    if (!email) return;
    setToast(`Invitation sent to: ${email}`);
  };

  const handlePayments = () => {
    setToast('Payments flow will be integrated here');
  };

  const handleAgentSettings = () => {
    setShowAgentSettingsModal(true);
  };

  const handleSwitchTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Render
  return (
    <div className={`app-container ${theme}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <strong>Cases</strong>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="case-list">
          {filteredCases.length === 0 && (
            <div className="empty">No cases yet</div>
          )}
          {filteredCases.map(c => (
            <div
              key={c.id}
              className={`case-item ${selectedCaseId === c.id ? 'active' : ''}`}
              onClick={() => setSelectedCaseId(c.id)}
              title={`${c.name} • ${c.email}`}
            >
              <div className="case-title">
                <strong>{c.name}</strong>
                <span className={`badge ${c.type === 'client-link' ? 'blue' : 'violet'}`}>
                  {c.type === 'client-link' ? 'Client link' : 'Agent upload'}
                </span>
              </div>
              <div className="case-sub">
                <span>{c.email}</span>
                <button
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetCaseId(c.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="content">
        <header>
          <h1>Agent Dashboard — Group Status</h1>
          <p>Trial active — 12 days left.</p>
        </header>

        <section className="actions">
          <button onClick={handleGenerateClientLink} className="primary">Generate Client Link</button>
          <button onClick={handleUploadClientDocuments}>Upload Client Documents</button>
          <button onClick={handleInviteAgent}>+Invite Agent</button>
          <button onClick={handleAgentSettings}>Agent Settings</button>
          <button onClick={handlePayments}>Payments</button>
          <button onClick={handleSwitchTheme}>Switch Theme</button>
        </section>

        <section className="detail">
          {!selectedCase && (
            <div className="placeholder">
              <p>Select a case on the left to view details.</p>
            </div>
          )}

          {selectedCase && (
            <div className="case-detail">
              <div className="case-detail-header">
                <h2>{selectedCase.name}</h2>
                <span className="muted">{selectedCase.email}</span>
              </div>

              <div className="case-actions">
                <button
                  onClick={() => {
                    const url = buildClientUrl(selectedCase.id);
                    window.open(url, '_blank');
                  }}
                >
                  Open client page
                </button>
                <button
                  onClick={async () => {
                    try {
                      const url = buildClientUrl(selectedCase.id);
                      await navigator.clipboard.writeText(url);
                      setToast('Link copied to clipboard');
                    } catch {
                      setToast('Failed to copy link');
                    }
                  }}
                >
                  Copy link
                </button>
              </div>

              <div className="case-meta">
                <div><strong>Type:</strong> {selectedCase.type === 'client-link' ? 'Client link' : 'Agent upload'}</div>
                <div><strong>Status:</strong> {selectedCase.status}</div>
                <div><strong>Created:</strong> {new Date(selectedCase.createdAt).toLocaleString()}</div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {showClientLinkModal && (
        <ClientModal
          title="Generate client link"
          cta="Create & Copy Link"
          onCancel={() => setShowClientLinkModal(false)}
          onSubmit={async (fullName, email) => {
            // Create case
            const item = addCase({ name: fullName, email, type: 'client-link' });
            const url = buildClientUrl(item.id);
            // Copy
            try {
              await navigator.clipboard.writeText(url);
              setToast('Client link copied to clipboard');
            } catch {
              setToast('Failed to copy link');
            }
            setShowClientLinkModal(false);
          }}
        />
      )}

      {showAgentUploadModal && (
        <ClientModal
          title="Upload client documents"
          cta="Create Case & Open"
          onCancel={() => setShowAgentUploadModal(false)}
          onSubmit={(fullName, email) => {
            // Create case
            const item = addCase({ name: fullName, email, type: 'agent-upload' });
            const url = buildClientUrl(item.id);
            // Open client flow for agent to upload
            window.open(url, '_blank');
            setToast('Case created and client page opened');
            setShowAgentUploadModal(false);
          }}
        />
      )}

      {showAgentSettingsModal && (
        <AgentSettingsModal
          initial={agent}
          onCancel={() => setShowAgentSettingsModal(false)}
          onSave={(profile) => {
            setAgent(profile);
            setToast('Agent profile saved');
            setShowAgentSettingsModal(false);
          }}
        />
      )}

      {deleteTargetCaseId && (
        <ConfirmModal
          title="Delete case"
          message="Are you sure you want to delete this case? This action cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setDeleteTargetCaseId(null)}
          onConfirm={() => {
            if (deleteTargetCaseId) removeCase(deleteTargetCaseId);
            setDeleteTargetCaseId(null);
            setToast('Case deleted');
          }}
        />
      )}

      {/* Toast */}
      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
};

/* -------- Shared components (inline for simplicity) -------- */

const ClientModal: React.FC<{
  title: string;
  cta: string;
  onCancel: () => void;
  onSubmit: (fullName: string, email: string) => void | Promise<void>;
}> = ({ title, cta, onCancel, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <label>
            <span>Client full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
          </label>
          <label>
            <span>Client email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </label>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel}>Cancel</button>
          <button
            className="primary"
            onClick={() => {
              if (!fullName.trim() || !email.trim()) return;
              onSubmit(fullName.trim(), email.trim());
            }}
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
};

const AgentSettingsModal: React.FC<{
  initial: AgentProfile;
  onCancel: () => void;
  onSave: (profile: AgentProfile) => void;
}> = ({ initial, onCancel, onSave }) => {
  const [fullName, setFullName] = useState(initial.fullName || '');
  const [email, setEmail] = useState(initial.email || '');
  const [memberNumber, setMemberNumber] = useState(initial.memberNumber || '');

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>Agent settings</h3>
          <button className="icon" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <label>
            <span>Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Agent Name"
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@example.com"
            />
          </label>
          <label>
            <span>Member number</span>
            <input
              type="text"
              value={memberNumber}
              onChange={(e) => setMemberNumber(e.target.value)}
              placeholder="123456"
            />
          </label>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel}>Cancel</button>
          <button
            className="primary"
            onClick={() => {
              if (!fullName.trim() || !email.trim()) return;
              onSave({ fullName: fullName.trim(), email: email.trim(), memberNumber: memberNumber.trim() });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal: React.FC<{
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ title, message, confirmLabel, onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default App;