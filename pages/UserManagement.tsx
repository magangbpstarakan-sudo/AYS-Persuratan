
import React, { useState } from 'react';
import { User, Trash2, Shield, Calendar, Users, Plus, Check, X, ShieldAlert } from 'lucide-react';
import { getUsers, deleteUser, saveUser } from '../services/userStore';
import { UserAccount, UserRole } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(getUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: UserRole.USER });

  const handleDelete = (id: string) => {
    if (id === 'admin-master') {
      alert('Master Admin tidak dapat dihapus!');
      return;
    }
    if (confirm('Yakin ingin menghapus user ini?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserAccount = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser,
      createdAt: new Date().toISOString()
    };
    saveUser(user);
    setUsers(getUsers());
    setShowAddModal(false);
    setNewUser({ name: '', username: '', password: '', role: UserRole.USER });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen User</h1>
          <p className="text-slate-500 text-sm">Kelola akses dan hak otoritas pengguna platform.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
        >
          <Plus size={20} /> Tambah User Baru
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black">Tambah Pengguna</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input required className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <input required className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input required type="password" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                <select className="w-full p-4 bg-slate-100 rounded-2xl font-bold" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                  <option value={UserRole.USER}>PENGGUNA (USER)</option>
                  <option value={UserRole.ADMIN}>ADMINISTRATOR (ADMIN)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all uppercase tracking-widest text-sm mt-4">Simpan User</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 ${user.role === UserRole.ADMIN ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
              {user.role === UserRole.ADMIN ? <Shield size={32} /> : <User size={32} />}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{user.name}</h3>
                <p className="text-sm font-bold text-slate-400">@{user.username}</p>
              </div>
              
              <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Akses</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${user.role === UserRole.ADMIN ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>{user.role}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Terdaftar</span>
                  <span className="text-[10px] font-bold text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {user.id !== 'admin-master' && (
              <button 
                onClick={() => handleDelete(user.id)}
                className="absolute top-8 right-8 p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            )}
            
            {user.id === 'admin-master' && (
              <div className="absolute top-8 right-8 p-2 bg-orange-50 text-orange-600 rounded-xl" title="Master Admin">
                <ShieldAlert size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
