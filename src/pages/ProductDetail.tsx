import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { API_URL } from '../api';
import axios from 'axios';
import { ArrowLeft, Heart, ShoppingBag, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, token, favorites, toggleFavorite, addToCart } = useStore();
  
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const product = products.find(p => p.id === parseInt(id || ''));
  const isFav = product ? favorites.includes(product.id) : false;

  const fetchPriceHistory = async () => {
    if (!id || !token) return;
    setHistoryLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/${id}/price-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data?.data || response.data || [];
      setPriceHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (product && token) {
      fetchPriceHistory();
    }
  }, [id, token]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Produk tidak ditemukan</h3>
        <button onClick={() => navigate('/home')} className="btn-primary mt-4">Kembali ke Beranda</button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Product Image */}
        <div className="card p-6 border-slate-100 flex items-center justify-center bg-slate-50 dark:bg-slate-900 select-none min-h-[350px]">
          <div className="text-8xl md:text-9xl">📦</div>
        </div>

        {/* Right side: Product Metadata & Actions */}
        <div className="space-y-6">
          <div className="card border-slate-100 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                  {product.barcode || 'Produk Umum'}
                </span>
                <h2 className="text-3xl font-extrabold text-slate-950 dark:text-slate-50 mt-2 tracking-tight">
                  {product.name}
                </h2>
              </div>
              <button
                onClick={() => toggleFavorite(product.id)}
                className="p-3 border border-slate-100 dark:border-slate-800 hover:shadow-sm rounded-2xl cursor-pointer"
                title="Tambahkan ke Favorit"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Price Card */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga</p>
                {product.is_promo && product.promo_price ? (
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-primary-600">Rp {product.promo_price.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-slate-400 line-through font-semibold">Rp {product.price.toLocaleString('id-ID')}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">Rp {product.price.toLocaleString('id-ID')}</span>
                )}
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status Stok</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  isOutOfStock 
                    ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                    : 'bg-primary-50 text-primary-700 border border-primary-100'
                }`}>
                  {isOutOfStock ? <XCircle className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle className="w-3.5 h-3.5 text-primary-600" />}
                  <span>{isOutOfStock ? 'Habis' : `${product.stock} Tersedia`}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Produk</h4>
              <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                {product.description || 'Produk unggulan berkualitas dari Toko Nabil. Silakan tanyakan penjual untuk info lebih lanjut.'}
              </p>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => !isOutOfStock && addToCart(product)}
                disabled={isOutOfStock}
                className="w-full btn-primary h-12 flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg disabled:bg-slate-200 dark:disabled:bg-slate-800/50"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Tambah ke Keranjang Belanja</span>
              </button>
            </div>
          </div>

          {/* Price History Section */}
          {token && (
            <div className="card border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Riwayat Perubahan Harga</h3>
              </div>

              {historyLoading ? (
                <div className="text-center py-6 text-xs text-slate-400">Memuat riwayat harga...</div>
              ) : priceHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">Belum ada riwayat perubahan harga untuk produk ini.</div>
              ) : (
                <div className="space-y-3">
                  {priceHistory.map((history, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-800/40 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 dark:text-slate-400">{new Date(history.changed_at).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="font-bold">
                        <span className="text-slate-400 line-through mr-1.5">Rp {history.old_price.toLocaleString('id-ID')}</span>
                        <span className="text-primary-600">Rp {history.new_price.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
