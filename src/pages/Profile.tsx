import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, LogOut, ChevronRight, ShoppingBag, Heart, Settings, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, cart, favorites } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout.');
    navigate('/login');
  };

  const menuItems = [
    {
      icon: ShoppingBag,
      label: 'Keranjang Saya',
      sub: `${cart.length} item di keranjang`,
      action: () => navigate('/cart'),
    },
    {
      icon: Heart,
      label: 'Produk Favorit',
      sub: `${favorites.length} produk`,
      action: () => navigate('/favorites'),
    },
    {
      icon: Settings,
      label: 'Pengaturan Akun',
      action: () => toast.info('Fitur segera hadir!'),
    },
    {
      icon: Shield,
      label: 'Privasi & Keamanan',
      action: () => toast.info('Fitur segera hadir!'),
    },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card border-slate-100 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-4xl font-extrabold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {user?.name || 'Pengguna'}
        </h2>
        <p className="text-slate-400 font-medium mt-1">{user?.email || '-'}</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-950/20 text-primary-600 font-bold text-sm px-4 py-1.5 rounded-full">
          <User className="w-4 h-4" />
          Pelanggan
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card border-slate-100 text-center py-5">
          <p className="text-3xl font-extrabold text-primary-600">{cart.length}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1">Item di Keranjang</p>
        </div>
        <div className="card border-slate-100 text-center py-5">
          <p className="text-3xl font-extrabold text-rose-500">{favorites.length}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1">Produk Favorit</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="card border-slate-100 divide-y divide-slate-100 dark:divide-slate-800">
        {menuItems.map(({ icon: Icon, label, sub, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center gap-3 py-4 px-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-xl text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 dark:text-slate-50 text-sm">{label}</p>
              {sub && <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full card border-rose-100 dark:border-rose-900/30 flex items-center gap-3 py-4 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-rose-600"
      >
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center shrink-0">
          <LogOut className="w-5 h-5 text-rose-500" />
        </div>
        <span className="font-bold text-sm">Keluar dari Akun</span>
      </button>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xs p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
              Konfirmasi Logout
            </h3>
            <p className="text-slate-500 text-sm">
              Kamu akan keluar dari akun ini. Lanjutkan?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
