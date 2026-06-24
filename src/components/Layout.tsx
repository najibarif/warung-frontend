import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Store, 
  Home, 
  Heart, 
  ShoppingCart, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  LogIn
} from 'lucide-react';
import { cn } from '../utils';

export default function Layout() {
  const { user, logout, checkAuth, themeMode, toggleTheme, cart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Add theme class to HTML element on mount
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigation = [
    { name: 'Beranda', href: '/home', icon: Home },
    { name: 'Favorit', href: '/favorites', icon: Heart },
    { name: 'Keranjang', href: '/cart', icon: ShoppingCart, badge: cartCount },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/50 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="bg-emerald-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-50 leading-tight">Warung Berkah</h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Aplikasi Pelanggan</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative",
                    isActive 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full ml-1 absolute -top-1.5 -right-1 ring-2 ring-white dark:ring-slate-900">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
              title="Ganti Tema"
            >
              {themeMode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* User Dropdown / Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[120px]">{user.email}</p>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/home'); }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      {/* Bottom Nav for Mobile Screen */}
      <footer className="md:hidden sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/50 py-2.5 px-4 z-40 flex items-center justify-around">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-slate-400 relative",
                isActive && "text-emerald-600 dark:text-emerald-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-emerald-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full absolute top-0.5 right-2 ring-1 ring-white dark:ring-slate-900">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </footer>
    </div>
  );
}
