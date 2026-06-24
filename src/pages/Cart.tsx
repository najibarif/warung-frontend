import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    user,
    checkout,
    isLoading,
  } = useStore();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    const price =
      item.product.is_promo && item.product.promo_price
        ? item.product.promo_price
        : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu.');
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      toast.error('Keranjang masih kosong!');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = async () => {
    const success = await checkout();
    if (success) {
      setShowCheckoutModal(false);
      toast.success('Pesanan berhasil dibuat! 🎉');
      navigate('/home');
    } else {
      toast.error('Gagal membuat pesanan. Coba lagi.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Keranjang
          </h2>
          <p className="text-sm text-slate-500 mt-1">Barang yang akan kamu pesan</p>
        </div>
        <div className="card border-slate-100 text-center py-20">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-emerald-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Keranjang Kosong</h3>
          <p className="text-slate-400 mt-2 text-sm">
            Yuk, tambahkan produk dari halaman katalog!
          </p>
          <button onClick={() => navigate('/home')} className="btn-primary mt-6">
            Lihat Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Keranjang
          </h2>
          <p className="text-sm text-slate-500 mt-1">{cart.length} jenis produk</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 font-semibold hover:text-rose-700 transition-colors cursor-pointer"
        >
          Kosongkan
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => {
            const price =
              item.product.is_promo && item.product.promo_price
                ? item.product.promo_price
                : item.product.price;
            return (
              <div
                key={item.product.id}
                className="card border-slate-100 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-slate-50 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-emerald-600 font-extrabold">
                    Rp {price.toLocaleString('id-ID')}
                  </p>
                  {item.product.is_promo && item.product.promo_price && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Tag className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-slate-400 line-through">
                        Rp {item.product.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-slate-900 dark:text-slate-50">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-50 w-24 text-right shrink-0">
                  Rp {(price * item.quantity).toLocaleString('id-ID')}
                </p>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="card border-slate-100">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              Ringkasan Pesanan
            </h3>
            <div className="space-y-2 mb-4">
              {cart.map(item => {
                const price =
                  item.product.is_promo && item.product.promo_price
                    ? item.product.promo_price
                    : item.product.price;
                return (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-slate-500 truncate mr-2">
                      {item.product.name} ×{item.quantity}
                    </span>
                    <span className="text-slate-900 dark:text-slate-50 font-semibold shrink-0">
                      Rp {(price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="font-extrabold text-slate-900 dark:text-slate-50">Total</span>
                <span className="font-extrabold text-emerald-600 text-lg">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              Pesan Sekarang <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                Konfirmasi Pesanan
              </h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Total Bayar</span>
                <span className="font-extrabold text-emerald-600 text-xl">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Memproses...' : 'Konfirmasi & Pesan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
