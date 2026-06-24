import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function Favorites() {
  const navigate = useNavigate();
  const { products, favorites, toggleFavorite, addToCart } = useStore();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Produk Favorit
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {favoriteProducts.length} barang disimpan sebagai favorit
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="card border-slate-100 text-center py-20">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-rose-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Belum ada favorit
          </h3>
          <p className="text-slate-400 mt-2 text-sm">
            Tekan ikon ❤️ pada produk yang kamu suka untuk menyimpannya di sini.
          </p>
          <button onClick={() => navigate('/home')} className="btn-primary mt-6">
            Jelajahi Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteProducts.map(product => {
            const price =
              product.is_promo && product.promo_price ? product.promo_price : product.price;
            const isOutOfStock = product.stock <= 0;
            return (
              <div
                key={product.id}
                className="card border-slate-100 flex items-center gap-4 hover:shadow-md transition-all duration-200"
              >
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 flex items-center justify-center text-3xl shrink-0 cursor-pointer hover:scale-105 transition-transform"
                >
                  📦
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="font-bold text-slate-900 dark:text-slate-50 truncate cursor-pointer hover:text-primary-600"
                  >
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-primary-600 font-extrabold text-base">
                      Rp {price.toLocaleString('id-ID')}
                    </span>
                    {product.is_promo && product.promo_price && (
                      <span className="text-xs text-slate-400 line-through font-semibold">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {isOutOfStock ? 'Stok Habis' : `${product.stock} unit tersedia`}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => !isOutOfStock && addToCart(product)}
                    disabled={isOutOfStock}
                    className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:scale-95 transition-all disabled:bg-slate-200 dark:disabled:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
                    title="Tambah ke Keranjang"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl hover:bg-rose-100 active:scale-95 transition-all cursor-pointer"
                    title="Hapus dari Favorit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
