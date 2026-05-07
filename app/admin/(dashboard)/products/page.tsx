"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, CheckCircle, Package, Camera, Upload } from 'lucide-react';
import {
  getAdminProducts,
  saveAdminProduct,
  deleteAdminProduct,
} from '@/lib/data/adminProducts';
import { Product } from '@/lib/data/products';

const CATEGORIES = ['شرقي', 'غربي', 'رجالي', 'نسائي', 'صيفي', 'شتوي'];

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  category: [],
  image: '',
  description: '',
  isFeatured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageDragging, setImageDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function load() {
    setProducts(getAdminProducts());
  }

  useEffect(() => { load(); }, []);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({ name: p.name, price: p.price, stock: p.stock ?? 0, category: p.category, image: p.image, description: p.description, isFeatured: p.isFeatured });
    setShowModal(true);
  }

  function handleImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setForm((f) => ({ ...f, image: result }));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setImageDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleImageFile(file);
  }

  function handleSave() {
    if (!form.name.trim() || !form.price || !form.image.trim()) {
      showToast('error', 'يرجى ملء جميع الحقول الإلزامية');
      return;
    }
    const product: Product = {
      id: editProduct?.id ?? `product-${Date.now()}`,
      ...form,
    };
    saveAdminProduct(product);
    load();
    setShowModal(false);
    showToast('success', editProduct ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
  }

  function handleDelete(id: string) {
    deleteAdminProduct(id);
    load();
    setDeleteConfirm(null);
    showToast('success', 'تم حذف المنتج');
  }

  function toggleCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  }

  return (
    <div dir="rtl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all duration-300
            ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C]">المنتجات</h1>
          <p className="text-[#747878] mt-1">{products.length} منتج</p>
        </div>
        <button
          id="admin-add-product-btn"
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#2C2C2C] text-[#C4A36E] px-5 py-3 rounded-xl hover:bg-black transition-all duration-200 font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-[#C4A36E]/10 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group"
          >
            <div className="relative h-48 bg-[#F5F1EA] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="max-h-44 max-w-full object-contain p-4"
                onError={(e) => { (e.target as HTMLImageElement).src = '/ls.png'; }}
              />
              {p.isFeatured && (
                <span className="absolute top-3 right-3 bg-[#C4A36E] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  مميز
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1 gap-2">
                <h3 className="font-bold text-[#2C2C2C] line-clamp-1 flex-1">{p.name}</h3>
                {p.stock !== undefined && (
                  <span
                    className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.stock > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {p.stock > 0 ? `${p.stock} قطعة` : 'نفد المخزون'}
                  </span>
                )}
              </div>
              <p className="text-[#C4A36E] font-semibold text-sm mb-2">
                {p.price.toLocaleString('ar-EG')} ج.م
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {p.category.map((c) => (
                  <span key={c} className="text-[10px] bg-[#F5F1EA] text-[#747878] px-2 py-0.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#C4A36E]/30 text-[#C4A36E] rounded-xl py-2 text-sm hover:bg-[#C4A36E]/10 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  تعديل
                </button>
                <button
                  onClick={() => setDeleteConfirm(p.id)}
                  className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-500 rounded-xl py-2 text-sm hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-20 text-[#747878]">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد منتجات بعد. ابدأ بإضافة منتجك الأول!</p>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-[#2C2C2C] mb-2">حذف المنتج</h3>
            <p className="text-[#747878] text-sm mb-6">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-[#C4A36E]/30 text-[#747878] rounded-xl py-2.5 text-sm hover:bg-[#F5F1EA] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm hover:bg-red-600 transition-colors"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#C4A36E]/10 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-bold text-[#2C2C2C]">
                {editProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#747878] hover:text-[#2C2C2C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">
                  اسم المنتج <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="مثال: عود ملكي"
                  className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 transition-all text-sm"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">
                  السعر (ج.م) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.price || ''}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  placeholder="مثال: 350"
                  className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 transition-all text-sm"
                  dir="ltr"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">
                  المخزون (قطعة)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.stock ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                  placeholder="مثال: 50"
                  className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 transition-all text-sm"
                  dir="ltr"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">
                  صورة المنتج <span className="text-red-500">*</span>
                </label>

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setImageDragging(true); }}
                  onDragLeave={() => setImageDragging(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    imageDragging
                      ? 'border-[#C4A36E] bg-[#C4A36E]/5'
                      : 'border-[#C4A36E]/30 bg-[#F5F1EA]'
                  }`}
                >
                  {form.image ? (
                    /* Preview */
                    <div className="relative h-40 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt="معاينة"
                        className="max-h-36 max-w-full object-contain rounded-xl p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image: '' }))}
                        className="absolute top-2 left-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    /* Upload prompt */
                    <div className="py-8 flex flex-col items-center gap-3 text-[#747878]">
                      <Upload className="w-8 h-8 opacity-40" />
                      <p className="text-sm text-center">
                        اسحب الصورة هنا، أو اختر طريقة رفع
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#C4A36E]/30 text-[#444748] rounded-xl py-2.5 text-sm hover:bg-[#C4A36E]/10 hover:border-[#C4A36E] transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    رفع صورة
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#C4A36E]/30 text-[#444748] rounded-xl py-2.5 text-sm hover:bg-[#C4A36E]/10 hover:border-[#C4A36E] transition-all duration-200"
                  >
                    <Camera className="w-4 h-4" />
                    التقاط صورة
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">الوصف</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="وصف مختصر للمنتج..."
                  className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 transition-all text-sm resize-none"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">التصنيفات</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200
                        ${form.category.includes(cat)
                          ? 'bg-[#C4A36E] text-white border-[#C4A36E]'
                          : 'border-[#C4A36E]/30 text-[#747878] hover:border-[#C4A36E] hover:text-[#C4A36E]'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, isFeatured: !f.isFeatured }))}
                  className={`w-10 h-6 rounded-full transition-all duration-200 relative ${
                    form.isFeatured ? 'bg-[#C4A36E]' : 'bg-[#C4A36E]/20'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      form.isFeatured ? 'left-5' : 'left-1'
                    }`}
                  />
                </div>
                <span className="text-sm text-[#444748]">منتج مميز</span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-[#C4A36E]/30 text-[#747878] rounded-xl py-3 text-sm hover:bg-[#F5F1EA] transition-colors"
              >
                إلغاء
              </button>
              <button
                id="admin-save-product-btn"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2C2C2C] text-[#C4A36E] rounded-xl py-3 text-sm hover:bg-black transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {editProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
