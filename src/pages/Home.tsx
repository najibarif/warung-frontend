import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const { products, categories, isLoading, fetchProducts, fetchCategories, favorites, toggleFavorite, addToCart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);


  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategory === 0 || p.category_id === selectedCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8 md:p-12 shadow-md">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="bg-primary-500/30 text-primary-200 border border-primary-400/30 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            Belanja Hemat & Cepat
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Penuhi Kebutuhan Harian Tanpa Ribet!
          </h2>
          <p className="text-sm md:text-base text-primary-100/90 font-medium">
            Warung Berkah menyediakan sembako, minuman, snack, dan berbagai perlengkapan rumah tangga dengan harga terbaik langsung ke tangan Anda.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-15 hidden lg:block select-none pointer-events-none text-9xl font-black p-8 flex items-center justify-center">
          🌾☕🍪🧹
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card p-5 space-y-5 border-slate-100">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari kebutuhan apa saja (beras, indomie, sabun...)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 bg-slate-50 border-slate-200 focus:bg-white text-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-150/40 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg uppercase tracking-wider">Katalog Belanja</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {isLoading ? 'Memuat...' : `${filteredProducts.length} Produk`}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse aspect-[3/4] bg-slate-150/50"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">Tidak ada produk ditemukan.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isFav = favorites.includes(product.id);
              const isOutOfStock = product.stock <= 0;

              return (
                <div 
                  key={product.id}
                  className="card p-4 hover:shadow-md transition-all duration-200 border-slate-100 relative group flex flex-col justify-between"
                >
                  {/* Actions overlay on hover */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="p-2 bg-white text-slate-600 rounded-xl hover:text-primary-600 hover:bg-slate-50 shadow-md border border-slate-100"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-2 bg-white rounded-xl shadow-md border border-slate-100"
                      title="Simpan ke Favorit"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-400 hover:text-rose-600'}`} />
                    </button>
                  </div>

                  {/* Best seller / Promo badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-1.5 z-10">
                    {product.is_promo && (
                      <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 font-extrabold px-2 py-0.5 rounded-lg">
                        PROMO
                      </span>
                    )}
                    {product.stock > 10 && (
                      <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        LARIS
                      </span>
                    )}
                  </div>

                  {/* Product info */}
                  <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                    <div className="w-full aspect-square rounded-2xl bg-slate-100 border border-slate-200/50 flex items-center justify-center text-4xl mb-4 group-hover:scale-[1.02] transition-transform duration-200 select-none">
                      📦
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Stok: {isOutOfStock ? 'Habis' : `${product.stock} unit`}</p>
                  </div>

                  {/* Pricing and cart add */}
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      {product.is_promo && product.promo_price ? (
                        <div className="flex flex-col">
                          <span className="text-primary-600 font-black text-base">Rp {product.promo_price.toLocaleString('id-ID')}</span>
                          <span className="text-xs text-slate-400 line-through font-semibold">Rp {product.price.toLocaleString('id-ID')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-900 dark:text-slate-50 font-black text-base">Rp {product.price.toLocaleString('id-ID')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => !isOutOfStock && addToCart(product)}
                      disabled={isOutOfStock}
                      className={`p-2.5 rounded-xl shadow-sm transition-all text-white ${
                        isOutOfStock 
                          ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none' 
                          : 'bg-primary-600 hover:bg-primary-700 active:scale-95 cursor-pointer'
                      }`}
                      title={isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
