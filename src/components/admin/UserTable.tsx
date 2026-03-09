import { useState, useEffect } from 'react';
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

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_roles')
      .select('id, user_id, role, created_at')
      .order('created_at', { ascending: true });

    if (data) {
      // Fetch emails from auth - we'll use the management API approach
      // For now, store user_id and we'll display it
      setUsers(data as unknown as UserRole[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');

    // Create the auth user via Supabase admin
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: inviteEmail,
      password: invitePassword,
      email_confirm: true,
    });

    if (authError) {
      // Fallback: try signUp if admin API isn't available
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: inviteEmail,
        password: invitePassword,
      });

      if (signUpError) {
        setInviteError(signUpError.message);
        setInviteLoading(false);
        return;
      }

      if (signUpData.user) {
        await supabase.from('user_roles').insert({
          user_id: signUpData.user.id,
          role: inviteRole,
        });
      }
    } else if (authData.user) {
      await supabase.from('user_roles').insert({
        user_id: authData.user.id,
        role: inviteRole,
      });
    }

    setInviteEmail('');
    setInvitePassword('');
    setInviteRole('manager');
    setShowInvite(false);
    setInviteLoading(false);
    fetchUsers();
  };

  const handleDelete = async (userRole: UserRole) => {
    if (!confirm('Remove this user? They will no longer be able to access the admin panel.')) return;
    await supabase.from('user_roles').delete().eq('id', userRole.id);
    fetchUsers();
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
                minLength={6}
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand-accent-orange transition-colors text-sm"
                placeholder="Min 6 characters"
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
