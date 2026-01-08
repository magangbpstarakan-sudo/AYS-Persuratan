
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, Menu, X, LogOut, Settings, Users, Database, Globe } from 'lucide-react';
import { APP_NAME, COPYRIGHT_YEAR, PUBLIC_PORTAL_URL } from '../constants';
import { getCurrentUser } from '../services/userStore';
import { UserRole } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Buat Surat', icon: PlusCircle, path: '/create' },
    { name: 'Arsip Surat', icon: FileText, path: '/archive' },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ name: 'Data Master', icon: Database, path: '/master-data' });
    navItems.push({ name: 'Manajemen User', icon: Users, path: '/users' });
  }

  navItems.push({ name: 'Pengaturan', icon: Settings, path: '/settings' });

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_auth_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full shadow-xl">
        <div className="p-8">
          <Link to="/" className="text-xl font-black italic tracking-tighter text-orange-500 flex items-center gap-2">
            <span className="bg-orange-500 text-white p-1 rounded italic not-italic text-sm px-2">AYS</span>
            <span className="text-white">Persuratan</span>
          </Link>
        </div>
        <nav className="flex-1 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-8 py-4 transition-all ${
                isActive(item.path) ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold text-sm tracking-wide">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 mt-auto space-y-2">
          <a 
            href={PUBLIC_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-xl transition-all font-medium text-sm"
          >
            <Globe size={18} />
            <span>Portal Publik</span>
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Keluar Sesi</span>
          </button>
        </div>

        <div className="p-8 text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">
          © {COPYRIGHT_YEAR} {APP_NAME}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-lg font-bold text-slate-900">
              {navItems.find(i => isActive(i.path))?.name || 'Persuratan'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href={PUBLIC_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all text-xs font-bold uppercase tracking-widest"
            >
               <Globe size={16} /> Portal Publik
            </a>
            <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-orange-500 uppercase">{user?.role || 'Guest'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black border border-orange-200">
                {user?.name?.substring(0, 2).toUpperCase() || 'US'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
