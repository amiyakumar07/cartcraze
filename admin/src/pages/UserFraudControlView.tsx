import React, { useState, useEffect } from 'react';
import { Users, UserX, UserCheck, ShieldAlert } from 'lucide-react';

interface MockUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  ordersPlaced: number;
  totalSpent: number;
  status: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
  riskScore: number;
  lat?: number;
  lon?: number;
  address?: string;
  source?: string;
}

const DEFAULT_MOCK_USERS: MockUser[] = [
  {
    id: 'usr-001',
    name: 'Amiya Sahoo',
    email: 'amiyasahoo392@gmail.com',
    phone: '+91 98765 43210',
    address: 'Sector 1, HSR Layout, Bengaluru',
    lat: 12.9141,
    lon: 77.6411,
    ordersPlaced: 5,
    totalSpent: 1240,
    status: 'ACTIVE',
    riskScore: 2,
    source: 'LOGIN'
  },
  {
    id: 'usr-002',
    name: 'Rahul Sharma',
    email: 'rahul.s@gmail.com',
    phone: '+91 98123 45678',
    address: '27th Main Rd, HSR Layout, Bengaluru',
    lat: 12.9200,
    lon: 77.6450,
    ordersPlaced: 2,
    totalSpent: 480,
    status: 'ACTIVE',
    riskScore: 5,
    source: 'CHECKOUT'
  }
];

export const UserFraudControlView: React.FC = () => {
  const [users, setUsers] = useState<MockUser[]>(DEFAULT_MOCK_USERS);

  const loadUsers = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`http://${hostname}:4000/api/users`);
      const data = await res.json();
      if (data && data.users && Array.isArray(data.users) && data.users.length > 0) {
        setUsers(data.users);
      }
    } catch {
      // Keep default mock users if offline
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
        prev.map((u) =>
          u.id === id
            ? { ...u, status: isBlock ? 'SUSPENDED' : 'ACTIVE', riskScore: isBlock ? 95 : 2 }
            : u
        )
      );
    }
  };

  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>User &amp; Anti-Fraud Account Controller</span>
          </h2>
          <p className="text-xs text-slate-400">Manage registered customer accounts, suspend bots, and monitor risk scores</p>
        </div>

        <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-800 text-amber-300 text-xs px-3.5 py-1.5 rounded-2xl font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>{users.filter(u => u.status === 'SUSPENDED').length} Suspended Accounts</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">User Account &amp; Contact</th>
                <th className="p-4">Last GPS Location</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">AI Risk Score</th>
                <th className="p-4 text-center">Account Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-extrabold text-white text-xs block">{user.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{user.phone} • {user.email}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-200 font-medium text-xs block truncate max-w-[200px]">
                      📍 {user.address || 'HSR Layout, Bengaluru'}
                    </span>
                    {user.lat && user.lon && (
                      <a
                        href={`https://maps.google.com/?q=${user.lat},${user.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-amber-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>({user.lat.toFixed(4)}, {user.lon.toFixed(4)})</span>
                        <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                          {user.source || 'GPS'}
                        </span>
                      </a>
                    )}
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
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black transition-all border cursor-pointer ${
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
