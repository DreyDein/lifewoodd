import React, { useState, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface EmailEntry {
  id: string;
  email: string;
  name: string;
  receivedAt: string;
  source: 'applications' | 'contacts';
  detail: string;
  data: Record<string, any>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const TOKEN_KEY = 'lifewood_admin_token';
const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin-login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      setToken(data.token);
      onLogin();
    } catch {
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#046241' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#133020]">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Lifewood Website Dashboard</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#133020] mb-2">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl outline-none focus:ring-2 text-[#133020] placeholder-gray-400"
                  style={{ '--tw-ring-color': 'rgba(4,98,65,0.3)' } as any}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#046241] transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50" style={{ backgroundColor: '#046241' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ entry, onClose, onRespond }: { entry: EmailEntry; onClose: () => void; onRespond: (id: string, decision: 'accepted' | 'rejected' | 'resolved' | 'irrelevant') => void }) {
  const [replyMessage, setReplyMessage] = useState('');
  const isApp = entry.source === 'applications';
  const d = entry.data;
  const [responding, setResponding] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(
  d.status && d.status !== 'pending' ? d.status : null
);

  const handleRespond = async (decision: 'accepted' | 'rejected') => {
    setResponding(decision);
    try {
      await apiFetch('/api/admin-respond', {
        method: 'POST',
        body: JSON.stringify({ id: entry.id, decision, email: entry.email, name: d.first_name || entry.name, position: d.position || entry.detail }),
      });
      setDone(decision);
      onRespond(entry.id, decision);
    } catch {
      alert('Failed to send response. Please try again.');
    } finally {
      setResponding(null);
    }
  };

  const handleInquiryStatus = async (status: 'resolved' | 'irrelevant') => {
  setResponding(status);
  try {
    await apiFetch('/api/admin-inquiry-status', {
      method: 'POST',
      body: JSON.stringify({ 
        id: entry.id, 
        status,
        replyMessage: status === 'resolved' ? replyMessage : null,
        email: d.email,
        name: d.full_name,
      }),
    });
    setDone(status);
    onRespond(entry.id, status);
  } catch {
    alert('Failed to update status. Please try again.');
  } finally {
    setResponding(null);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 flex items-start justify-between" style={{ backgroundColor: '#046241' }}>
          <div>
            <h2 className="text-lg font-bold text-white">{entry.name}</h2>
            <p className="text-white/70 text-sm">{entry.email}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 max-h-[55vh] overflow-y-auto">
          {isApp ? (
            <>
              <Row label="Full Name" value={`${d.first_name || ''} ${d.last_name || ''}`.trim()} />
              <Row label="Email" value={d.email} />
              <Row label="Age" value={d.age || '—'} />
              <Row label="Degree" value={d.degree || '—'} />
              <Row label="Position" value={d.position || d.project || '—'} />
              {d.experience && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Experience</p>
                  <p className="text-sm text-[#133020] bg-gray-50 rounded-xl p-3 leading-relaxed">{d.experience}</p>
                </div>
              )}
            {d.cv_url && (
                <a href={d.cv_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold w-fit mt-2"
                  style={{ backgroundColor: '#FFC370', color: '#133020' }}>
                  📎 Download CV
                </a>
              )}
            </>
          ) : (
            <>
              <Row label="Full Name" value={d.full_name || '—'} />
              <Row label="Email" value={d.email} />
              <Row label="Inquiry Type" value={d.inquiry_type || '—'} />
              {d.message && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Message</p>
                  <p className="text-sm text-[#133020] bg-gray-50 rounded-xl p-3 leading-relaxed">{d.message}</p>
                </div>
              )}
            </>
          )}
          <Row label="Received" value={new Date(entry.receivedAt).toLocaleString()} />
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100">
          {isApp ? (
            done ? (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${done === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {done === 'accepted' ? '✅ Accepted — email sent to applicant' : '❌ Rejected — email sent to applicant'}
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => handleRespond('accepted')} disabled={!!responding}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: '#046241' }}>
                  {responding === 'accepted' ? 'Sending...' : '✅ Accept'}
                </button>
                <button onClick={() => handleRespond('rejected')} disabled={!!responding}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 bg-red-500">
                  {responding === 'rejected' ? 'Sending...' : '❌ Reject'}
                </button>
              </div>
            )
          ) : (
            done ? (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${
                done === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {done === 'resolved' ? '✅ Marked as Resolved' : '🚫 Marked as Irrelevant'}
              </div>
            ) : (
             <div className="space-y-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response to this inquiry (optional)..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#133020] placeholder-gray-400 outline-none resize-none focus:ring-2"
                    style={{ '--tw-ring-color': 'rgba(4,98,65,0.3)' } as any}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => handleInquiryStatus('resolved')} disabled={!!responding}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                      style={{ backgroundColor: '#046241' }}>
                      {responding === 'resolved' ? 'Sending...' : '✅ Resolve & Reply'}
                    </button>
                    <button onClick={() => handleInquiryStatus('irrelevant')} disabled={!!responding}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                      style={{ backgroundColor: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}>
                      {responding === 'irrelevant' ? 'Updating...' : '🚫 Irrelevant'}
                    </button>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-semibold text-gray-400 uppercase w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[#133020] font-medium">{value}</span>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, source }: { status: string; source: string }) {
  if (source === 'applications') {
    if (status === 'accepted') return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(4,98,65,0.1)', color: '#046241' }}>✅ Accepted</span>;
    if (status === 'rejected') return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>❌ Rejected</span>;
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(156,163,175,0.2)', color: '#6b7280' }}>⏳ Pending</span>;
  } else {
    if (status === 'resolved') return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(4,98,65,0.1)', color: '#046241' }}>✅ Resolved</span>;
    if (status === 'irrelevant') return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(156,163,175,0.2)', color: '#6b7280' }}>🚫 Irrelevant</span>;
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(255,195,112,0.2)', color: '#b07800' }}>⏳ Pending</span>;
  }
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [entries, setEntries] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'applications' | 'contacts'>('all');
  const [selected, setSelected] = useState<EmailEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/admin-emails');
      setEntries(data);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized')) { clearToken(); onLogout(); }
      else setError('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, source: string) => {
    setDeletingId(id);
    try {
      await apiFetch(`/api/admin-delete?source=${source}&id=${id}`, { method: 'DELETE' });
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setConfirmDelete(null);
    } catch {
      setError('Failed to delete entry.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRespond = (id: string, decision: string) => {
    setEntries((prev) =>
      prev.map((e) => e.id === id ? { ...e, data: { ...e.data, status: decision } } : e)
    );
    setSelected((prev) => prev?.id === id ? { ...prev, data: { ...prev.data, status: decision } } : prev);
  };

  const filtered = entries.filter((e) => {
    const matchFilter = filter === 'all' || e.source === filter;
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.detail.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const appCount = entries.filter((e) => e.source === 'applications').length;
  const conCount = entries.filter((e) => e.source === 'contacts').length;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#046241' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-[#133020] leading-none">Lifewood Admin</h1>
              <p className="text-xs text-gray-400 mt-0.5">Submissions Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-2 rounded-xl text-gray-400 hover:text-[#046241] hover:bg-gray-50 transition-colors" title="Refresh">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button onClick={() => { clearToken(); onLogout(); }} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Submissions', value: entries.length, color: '#046241' },
            { label: 'Applications', value: appCount, color: '#133020' },
            { label: 'Inquiries', value: conCount, color: '#FFC370' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex gap-2">
            {(['all', 'applications', 'contacts'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                style={filter === f ? { backgroundColor: '#046241' } : {}}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by name, email, or position..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-[#133020] placeholder-gray-400 outline-none" />
          </div>
        </div>

        {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#046241', borderTopColor: 'transparent' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 font-medium">No submissions found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Detail</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Received</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(entry)}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#133020] text-sm">{entry.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-500">{entry.email}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={entry.source === 'applications'
                          ? { backgroundColor: 'rgba(4,98,65,0.1)', color: '#046241' }
                          : { backgroundColor: 'rgba(255,195,112,0.2)', color: '#b07800' }}>
                        {entry.source === 'applications' ? 'Application' : 'Inquiry'}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-500 truncate max-w-[160px]">{entry.detail || '—'}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <StatusBadge status={entry.data.status || 'pending'} source={entry.source} />
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-xs text-gray-400">
                        {new Date(entry.receivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {confirmDelete === entry.id ? (
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => handleDelete(entry.id, entry.source)} disabled={deletingId === entry.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                            {deletingId === entry.id ? '...' : 'Delete'}
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(entry.id)}
                          className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">{filtered.length} of {entries.length} submissions</p>
      </div>

      {selected && <DetailModal entry={selected} onClose={() => setSelected(null)} onRespond={handleRespond} />}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => !!getToken());
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}