import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ProductDetailPage() {
  const { id } = useParams(); // ดึง ID จาก URL เช่น /product/xxxx
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  async function fetchProductDetail() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single(); // ดึงมาแค่ชิ้นเดียว

    if (error) console.error('Error:', error);
    else setProduct(data);
    setLoading(false);
  }

  // ฟังก์ชันคัดลอกรายละเอียดสินค้า สำหรับเอาไปโพสต์ Facebook/TikTok
  function handleCopyDetails() {
    const text = `${product.name}\nราคา: ฿${product.price}\nไซส์: ${product.size}\n\n${product.description}\n\n${product.condition_note ? `หมายเหตุ: ${product.condition_note}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">กำลังโหลด...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">ไม่พบสินค้านี้</div>;
  }

  const images = product.image_urls || [];

  return (
    <div className="min-h-screen bg-white">
      {/* ปุ่มย้อนกลับ */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
          ← กลับหน้าร้านค้า
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
        
        {/* ฝั่งซ้าย: แกลเลอรีรูปภาพ */}
        <div>
          <div className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden mb-3">
            <img
              src={images[activeImage] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 
                    ${activeImage === index ? 'border-gray-900' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ฝั่งขวา: รายละเอียดสินค้า */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5 w-fit mb-3">
            ไซส์ {product.size}
          </span>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-6">
            ฿{product.price.toLocaleString()}
          </p>

          <div className="border-t border-gray-100 pt-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">รายละเอียดสินค้า</h3>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* จุดสำคัญของมือสอง: แจ้งตำหนิให้ชัดเจน */}
          {product.condition_note && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-amber-800 mb-1">⚠ หมายเหตุสภาพสินค้า</h3>
              <p className="text-sm text-amber-700">{product.condition_note}</p>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3">
            {/* ปุ่มสั่งซื้อผ่าน LINE OA */}
            <a
              href={`https://line.me/R/ti/p/@825dlvpp?text=สนใจสินค้า: ${product.name} (${product.price} บาท)`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition"
            >
              สั่งซื้อผ่าน LINE
            </a>

            {/* ปุ่มคัดลอกรายละเอียด สำหรับโพสต์ช่องทางอื่น */}
            <button
              onClick={handleCopyDetails}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition"
            >
              {copied ? '✓ คัดลอกแล้ว!' : 'คัดลอกรายละเอียดสินค้า'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}