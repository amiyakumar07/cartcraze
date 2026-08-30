import React, { useState } from 'react';
import { Users, UserX, UserCheck } from 'lucide-react';

interface MockUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  ordersPlaced: number;
  totalSpent: number;
  status: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
  riskScore: number;
}

export const UserFraudControlView: React.FC = () => {
  const [users, setUsers] = useState<MockUser[]>([]);

  const loadUsers = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`http://${hostname}:4000/api/users`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      // silent catch
    }
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const isBlock = currentStatus === 'ACTIVE';
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      await fetch(`http://${hostname}:4000/api/users/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, block: isBlock })
      });
      loadUsers();
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: isBlock ? 'SUSPENDED' : 'ACTIVE', riskScore: isBlock ? 95 : 2 } : u))
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-white">User &amp; Anti-Fraud Account Controller</h2>
          <p className="text-xs text-slate-400">Suspend suspicious bot accounts and promo abuse actors</p>
        </div>
        <Users className="w-6 h-6 text-amber-400" />
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">AI Risk Score</th>
                <th className="p-4 text-center">Account Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No customer accounts registered yet. Waiting for real customer signups.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-extrabold text-white text-xs block">{user.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{user.phone} • {user.email}</span>
                  </td>

                  <td className="p-4 font-bold text-slate-200">
                    {user.ordersPlaced} Orders
                  </td>

                  <td className="p-4 font-black text-amber-400">
                    ₹{user.totalSpent}
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      user.riskScore > 50
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {user.riskScore}% Risk
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.status)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black transition-all border ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-red-950 hover:text-red-300'
                          : 'bg-red-950 text-red-300 border-red-800 hover:bg-emerald-950 hover:text-emerald-300'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>ACTIVE (SAFE)</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>SUSPENDED</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
