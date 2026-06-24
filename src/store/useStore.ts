import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../api';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  is_promo: boolean;
  promo_price: number | null;
  barcode: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AppState {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  
  user: AuthUser | null;
  token: string | null;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;

  cart: { product: Product; quantity: number }[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<boolean>;

  favorites: number[];
  toggleFavorite: (productId: number) => Promise<void>;
  loadFavorites: () => Promise<void>;
}

// Set up default axios headers
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const useStore = create<AppState>((set, get) => ({
  // Theme management
  themeMode: (localStorage.getItem('theme_mode') as 'light' | 'dark') || 'light',
  toggleTheme: () => {
    const next = get().themeMode === 'light' ? 'dark' : 'light';
    set({ themeMode: next });
    localStorage.setItem('theme_mode', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Auth State
  user: null,
  token: null,
  isAuthLoading: false,
  authError: null,

  login: async (email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ token, user, isAuthLoading: false });
      await get().loadFavorites();
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message ?? 'Email atau password salah.';
      set({ authError: msg, isAuthLoading: false });
      return false;
    }
  },

  logout: async () => {
    const token = get().token;
    if (token) {
      try {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }
    delete axios.defaults.headers.common['Authorization'];
    set({ token: null, user: null, authError: null, favorites: [] });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = response.data;
      set({ user });
      await get().loadFavorites();
    } catch (err) {
      delete axios.defaults.headers.common['Authorization'];
      set({ token: null, user: null });
    }
  },

  // Products and Categories
  products: [],
  categories: [{ id: 0, name: 'Semua' }],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const data = response.data?.data || response.data || [];
      set({ categories: [{ id: 0, name: 'Semua' }, ...data] });
    } catch (err) {
    }
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/products`);
      const data = response.data?.data || response.data || [];
      set({ products: data, isLoading: false });
    } catch (err) {
      set({ error: 'Gagal memuat data produk.', isLoading: false });
    }
  },

  // Cart Management
  cart: (() => { try { const c = localStorage.getItem('user_cart'); return c ? JSON.parse(c) : []; } catch { return []; } })(),

  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find(item => item.product.id === product.id);
    let newCart = [];

    if (existing) {
      newCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    set({ cart: newCart });
    localStorage.setItem('user_cart', JSON.stringify(newCart));
  },

  removeFromCart: (productId) => {
    const newCart = get().cart.filter(item => item.product.id !== productId);
    set({ cart: newCart });
    localStorage.setItem('user_cart', JSON.stringify(newCart));
  },

  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const newCart = get().cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    set({ cart: newCart });
    localStorage.setItem('user_cart', JSON.stringify(newCart));
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem('user_cart');
  },

  checkout: async () => {
    set({ isLoading: true });
    const token = get().token;
    try {
      const { cart } = get();
      const items = cart.map(c => ({
        product_id: c.product.id,
        quantity: c.quantity
      }));
      const response = await axios.post(`${API_URL}/orders`, { items }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201 || response.status === 200) {
        get().clearCart();
        get().fetchProducts(); // Refresh stock counts
        set({ isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ isLoading: false, error: 'Gagal memproses transaksi.' });
      return false;
    }
  },

  // Favorites
  favorites: [],
  loadFavorites: async () => {
    const token = get().token;
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const list = response.data?.data || response.data || [];
        const ids = list.map((fav: any) => fav.product?.id || fav.product_id);
        set({ favorites: ids });
        return;
      } catch (err) {
        console.warn('Failed to load favorites from backend');
      }
    }
    try { const stored = localStorage.getItem('user_favorites'); if (stored) { set({ favorites: JSON.parse(stored) }); } } catch { }
  },

  toggleFavorite: async (productId) => {
    const { favorites, token } = get();
    const isFav = favorites.includes(productId);
    const next = isFav
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    set({ favorites: next });
    localStorage.setItem('user_favorites', JSON.stringify(next));

    if (token) {
      try {
        if (isFav) {
          await axios.delete(`${API_URL}/favorites/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`${API_URL}/favorites`, { product_id: productId }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.error('Failed to sync favorite with backend', err);
      }
    }
  }
}));
