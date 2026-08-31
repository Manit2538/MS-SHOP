import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

const SIZES = ['ทั้งหมด', 'S', 'M', 'L', 'XL', 'Free Size'];

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('ทั้งหมด');

  useEffect(() => {
    fetchProducts();
  }, [selectedSize]);

  async function fetchProducts() {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (selectedSize !== 'ทั้งหมด') {
      query = query.eq('size', selectedSize);
    }

    const { data, error } = await query;
    if (error) console.error('Error fetching products:', error);
    else setProducts(data);
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-6 px-4 text-center">
        <h1 className="text-2xl font-light tracking-widest text-gray-900">
          SECONDHAND STORE
        </h1>
        <p className="text-sm text-gray-400 mt-1">เสื้อผ้ามือสอง คุณภาพดี ชิ้นเดียวในโลก</p>
      </header>

      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-5 py-2 text-sm rounded-full transition-all duration-200
                ${selectedSize === size
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">กำลังโหลดสินค้า...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            ไม่พบสินค้าในไซส์นี้ค่ะ ลองเลือกไซส์อื่นดูนะคะ
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              // ครอบด้วย Link เพื่อให้คลิกแล้วไปหน้ารายละเอียด
              <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-3">
                  <img
                    src={product.image_urls?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-1">
                  <h3 className="text-sm text-gray-800 font-medium truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-900 font-semibold">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5">
                      {product.size}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}