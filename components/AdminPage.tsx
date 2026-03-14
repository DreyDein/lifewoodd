import React, { useEffect, useMemo, useState } from 'react';

type EmailEntry = {
  id: string;
  email: string;
  name: string;
  receivedAt: string;
  source: 'applications' | 'contacts';
  detail?: string;
};

const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin-token'));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [entries, setEntries] = useState<EmailEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const fetchEntries = async (authToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/emails', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (response.status === 401) {
        localStorage.removeItem('admin-token');
        setToken(null);
        return;
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to load emails.');
      }

      const data = (await response.json()) as EmailEntry[];
      setEntries(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load emails.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEntries(token);
    }
  }, [token]);

  const filteredEntries = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) =>
      [entry.email, entry.name, entry.source, entry.detail ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [entries, filter]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Login failed.');
      }

      const data = (await response.json()) as { token: string };
      localStorage.setItem('admin-token', data.token);
      setToken(data.token);
      setPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setToken(null);
    setEntries([]);
    setFilter('');
  };

  const handleDelete = async (entry: EmailEntry) => {
    if (!token) return;
    const response = await fetch(`/api/admin/emails/${entry.source}/${entry.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));
      return;
    }

    const message = await response.text();
    setError(message || 'Delete failed.');
  };

  const handleExport = () => {
    if (filteredEntries.length === 0) return;
    const rows = [
      ['email', 'name', 'source', 'receivedAt', 'detail'],
      ...filteredEntries.map((entry) => [
        entry.email,
        entry.name,
        entry.source,
        entry.receivedAt,
        entry.detail ?? ''
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emails.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-lifewood-seaSalt flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-lifewood-paper/40 bg-white p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-lifewood-green mb-2">Admin Login</h1>
          <p className="text-sm text-lifewood-dark/60 mb-6">
            Enter your admin password to access the email dashboard.
          </p>

          {loginError && (
            <div className="mb-4 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-500">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Admin password"
                className="w-full rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 pr-28 text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-lifewood-green hover:opacity-80"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-2xl bg-lifewood-green py-4 text-xl font-extrabold text-lifewood-white transition hover:brightness-110"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lifewood-seaSalt px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-lifewood-paper/40 bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-lifewood-green">Email Dashboard</h1>
            <p className="text-sm text-lifewood-dark/60">
              View and manage emails captured from Apply and Contact forms.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => token && fetchEntries(token)}
              className="rounded-2xl border border-lifewood-green/30 px-4 py-2 text-sm font-semibold text-lifewood-green transition hover:bg-lifewood-green/10"
            >
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="rounded-2xl border border-lifewood-green/30 px-4 py-2 text-sm font-semibold text-lifewood-green transition hover:bg-lifewood-green/10"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-lifewood-green px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Log Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-500">
            {error}
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name, email, source..."
            className="w-full md:max-w-md rounded-2xl border border-lifewood-paper bg-white px-5 py-3 text-sm text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green"
          />
          <div className="text-sm text-lifewood-dark/60">
            {filteredEntries.length} entries
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-lifewood-paper/40 bg-white shadow-xl">
          <div className="grid grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr_0.6fr] gap-3 border-b border-lifewood-paper/40 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-lifewood-dark/50">
            <span>Email</span>
            <span>Name</span>
            <span>Source</span>
            <span>Date</span>
            <span>Action</span>
          </div>
          {isLoading ? (
            <div className="px-6 py-6 text-sm text-lifewood-dark/60">Loading emails...</div>
          ) : filteredEntries.length === 0 ? (
            <div className="px-6 py-6 text-sm text-lifewood-dark/60">No emails found.</div>
          ) : (
            <div className="divide-y divide-lifewood-paper/30">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr_0.6fr] gap-3 px-6 py-4 text-sm text-lifewood-dark"
                >
                  <div className="font-semibold">{entry.email}</div>
                  <div>{entry.name}</div>
                  <div className="capitalize">{entry.source}</div>
                  <div>{new Date(entry.receivedAt).toLocaleDateString()}</div>
                  <button
                    onClick={() => handleDelete(entry)}
                    className="rounded-xl border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
