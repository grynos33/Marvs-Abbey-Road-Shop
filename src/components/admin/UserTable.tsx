import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2, Shield, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { UserRole } from '../../types/database';

export const UserTable = () => {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'manager'>('manager');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [error, setError] = useState('');

  const getAccessToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  const fetchUsers = useCallback(async (showLoading = true, resetError = true) => {
    if (showLoading) setLoading(true);
    if (resetError) setError('');
    const token = await getAccessToken();
    if (!token) {
      setError('Session expired. Please sign in again.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/admin-users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await response.json();
    if (!response.ok) {
      setError((payload?.error as string) || 'Failed to load users');
      setLoading(false);
      return;
    }
    setUsers((payload?.users as UserRole[]) ?? []);
    setLoading(false);
  }, [getAccessToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsers(false, false);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');
    const token = await getAccessToken();
    if (!token) {
      setInviteError('Session expired. Please sign in again.');
      setInviteLoading(false);
      return;
    }

    const response = await fetch('/api/admin-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: inviteEmail,
        password: invitePassword,
        role: inviteRole,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setInviteError((payload?.error as string) || 'Failed to create user');
      setInviteLoading(false);
      return;
    }

    setInviteEmail('');
    setInvitePassword('');
    setInviteRole('manager');
    setShowInvite(false);
    setInviteLoading(false);
    await fetchUsers(false);
  };

  const handleDelete = async (userRole: UserRole) => {
    if (!confirm('Remove this user? They will no longer be able to access the admin panel.')) return;
    const token = await getAccessToken();
    if (!token) {
      setError('Session expired. Please sign in again.');
      return;
    }

    const response = await fetch('/api/admin-users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userRole.id }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError((payload?.error as string) || 'Failed to remove user');
      return;
    }
    await fetchUsers(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Users ({users.length})</h2>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent-orange text-white rounded-full font-display font-medium text-sm hover:bg-[#A67525] transition-colors"
        >
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <form onSubmit={handleInvite} className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">
          <h3 className="font-display font-bold">Invite New User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-display font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors text-sm"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-display font-medium mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors text-sm"
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-display font-medium mb-1">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'admin' | 'manager')}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm bg-white"
              >
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          {inviteError && <p className="text-red-500 text-sm">{inviteError}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={inviteLoading}
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-full font-display font-medium text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="px-6 py-2.5 border border-zinc-200 rounded-full font-display font-medium text-sm hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p className="text-lg font-display font-bold">Failed to load users</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-lg font-display font-bold">No users configured</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                {user.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm truncate">{user.user_id}</p>
                <p className="text-xs text-zinc-400">
                  Added {new Date(user.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-display font-bold capitalize ${
                user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role}
              </span>
              {user.role !== 'admin' && (
                <button
                  onClick={() => handleDelete(user)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
