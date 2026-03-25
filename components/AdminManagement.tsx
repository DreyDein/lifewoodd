import React, { useState, useEffect } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('lifewood_admin_token');
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

interface AdminManagementProps {
  onClose: () => void;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ onClose }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin-list');
      setAdmins(data);
    } catch (err) {
      setError('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (!email || !name || !password) {
      setError('All fields required');
      setSaving(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setSaving(false);
      return;
    }

    try {
      await apiFetch('/api/admin-register', {
        method: 'POST',
        body: JSON.stringify({ email, name, password }),
      });
      setShowAdd(false);
      loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this admin?')) return;
    try {
      await apiFetch(`/api/admin-list?id=${id}`, { method: 'DELETE' });
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 flex items-center justify-between" style={{ backgroundColor: '#046241' }}>
          <h2 className="text-lg font-bold text-white">Manage Admins</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#046241', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowAdd(true)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: '#046241' }}>
                  + Add Admin
                </button>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Name</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Email</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Created</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-50">
                      <td className="px-3 py-3 font-semibold text-[#133020]">{admin.name}</td>
                      <td className="px-3 py-3 text-gray-500">{admin.email}</td>
                      <td className="px-3 py-3 text-gray-400 text-sm">{new Date(admin.created_at).toLocaleDateString()}</td>
                      <td className="px-3 py-3 text-right">
                        <button onClick={() => handleDelete(admin.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {showAdd && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-[#133020] mb-4">Add New Admin</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#133020] mb-1">Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#133020] mb-1">Email</label>
                    <input name="email" type="email" required className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#133020] mb-1">Password</label>
                    <input name="password" type="password" required minLength={6} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl font-bold border border-gray-200 text-gray-600">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-2 rounded-xl font-bold text-white" style={{ backgroundColor: '#046241' }}>
                    {saving ? '...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
