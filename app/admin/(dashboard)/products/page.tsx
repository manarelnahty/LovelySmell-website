"use client";

import { useEffect, useRef, useState, useTransition, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, CheckCircle, Package, Camera, Upload, Loader2, RotateCcw } from 'lucide-react';
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpdateProductImage,
  adminDeleteProduct,
  adminRestoreProduct,
  adminGetCategories,
  AdminProduct,
  AdminCategory,
} from '@/lib/actions/adminProducts';

type ToastState = { type: 'success' | 'error'; msg: string } | null;

interface FormState {
  name_ar: string;
  price: number;
  stock: number;
  description_ar: string;
  category_id: string;
  is_active: boolean;
  is_bestseller: boolean;
  is_editorial: boolean;
  is_month_perfume: boolean;
  image: string; // URL shown in preview
}

const EMPTY_FORM: FormState = {
  name_ar: '',
  price: 0,
  stock: 0,
  description_ar: '',
  category_id: '',
  is_active: true,
  is_bestseller: false,
  is_editorial: false,
  is_month_perfume: false,
  image: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);      // true = Add mode
  const [isRestoring, setIsRestoring] = useState(false); // true = Restore mode
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [toast, setToast] = useState<ToastState>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageDragging, setImageDragging] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const [prods, cats] = await Promise.all([adminGetProducts(), adminGetCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setIsAdding(true);
    setIsRestoring(false);
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(p: AdminProduct) {
    setIsAdding(false);
    setIsRestoring(false);
    setEditProduct(p);
    setForm({
      name_ar: p.name_ar,
      price: p.price,
      stock: p.stock,
      description_ar: p.description_ar ?? '',
      category_id: p.category_id ?? '',
      is_active: p.is_active,
      is_bestseller: p.is_bestseller,
      is_editorial: p.is_editorial,
      is_month_perfume: p.is_month_perfume,
      image: p.image_url ?? '',
    });
    setShowModal(true);
  }

  function openRestore(p: AdminProduct) {
    setIsAdding(false);
    setIsRestoring(true);
    setEditProduct(p);
    setForm({
      name_ar: p.name_ar,
      price: p.price,
      stock: p.stock,
      description_ar: p.description_ar ?? '',
      category_id: p.category_id ?? '',
      is_active: true, // will be restored
      is_bestseller: p.is_bestseller,
      is_editorial: p.is_editorial,
      is_month_perfume: p.is_month_perfume,
      image: p.image_url ?? '',
    });
    setShowModal(true);
  }

  const handleImageFile = useCallback(async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      showToast('error', 'مفتاح ImgBB غير موجود في البيئة');
      return;
    }
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', apiKey);
      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setForm((f) => ({ ...f, image: json.data.url as string }));
      } else {
        showToast('error', 'فشل رفع الصورة إلى ImgBB');
      }
    } catch {
      showToast('error', 'حدث خطأ أثناء رفع الصورة');
    } finally {
      setImageUploading(false);
    }
  }, []);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setImageDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) void handleImageFile(file);
  }

  function handleSave() {
    if (!form.name_ar.trim() || !form.price) {
      showToast('error', 'يرجى ملء اسم المنتج والسعر');
      return;
    }

    startTransition(async () => {
      if (isAdding) {
        // ── CREATE ──
        const result = await adminCreateProduct({
          name_ar: form.name_ar,
          description_ar: form.description_ar || null,
          price: form.price,
          stock: form.stock,
          category_id: form.category_id || null,
          is_active: form.is_active,
          is_bestseller: form.is_bestseller,
          is_editorial: form.is_editorial,
          is_month_perfume: form.is_month_perfume,
          image_url: form.image || null,
        });
        if (!result.success) { showToast('error', `فشل الإضافة: ${result.error}`); return; }
        await load();
        setShowModal(false);
        showToast('success', 'تم إضافة المنتج بنجاح');

      } else if (isRestoring) {
        // ── RESTORE: update fields first, then re-enable ──
        if (!editProduct) return;
        const updateResult = await adminUpdateProduct(editProduct.id, {
          name_ar: form.name_ar,
          price: form.price,
          stock: form.stock,
          description_ar: form.description_ar || null,
          category_id: form.category_id || null,
          is_bestseller: form.is_bestseller,
          is_editorial: form.is_editorial,
          is_month_perfume: form.is_month_perfume,
        });
        if (!updateResult.success) { showToast('error', `فشل تحديث البيانات: ${updateResult.error}`); return; }

        if (form.image && form.image !== editProduct.image_url) {
          await adminUpdateProductImage(editProduct.id, form.image);
        }

        const restoreResult = await adminRestoreProduct(editProduct.id);
        if (!restoreResult.success) { showToast('error', `فشل الاستعادة: ${restoreResult.error}`); return; }
        await load();
        setShowModal(false);
        showToast('success', 'تم استعادة المنتج بنجاح');

      } else {
        // ── UPDATE ──
        if (!editProduct) return;
        const result = await adminUpdateProduct(editProduct.id, {
          name_ar: form.name_ar,
          price: form.price,
          stock: form.stock,
          description_ar: form.description_ar || null,
          category_id: form.category_id || null,
          is_active: form.is_active,
          is_bestseller: form.is_bestseller,
          is_editorial: form.is_editorial,
          is_month_perfume: form.is_month_perfume,
        });
        if (!result.success) { showToast('error', `فشل الحفظ: ${result.error}`); return; }
        if (form.image && form.image !== editProduct.image_url) {
          const imgResult = await adminUpdateProductImage(editProduct.id, form.image);
          if (!imgResult.success) { showToast('error', `فشل تحديث الصورة: ${imgResult.error}`); return; }
        }
        await load();
        setShowModal(false);
        showToast('success', 'تم تحديث المنتج بنجاح');
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await adminDeleteProduct(id);
      if (!result.success) {
        showToast('error', `فشل الحذف: ${result.error}`);
        return;
      }
      await load();
      setDeleteConfirm(null);
      showToast('success', 'تم إخفاء المنتج (تم تعطيله)');
    });
  }

  return (
    <div dir="rtl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all duration-300
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-[#747878]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#C4A36E]/10 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="relative h-48 bg-[#F5F1EA] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url ?? '/ls.png'}
                  alt={p.name_ar}
                  className="max-h-44 max-w-full object-contain p-4"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/ls.png'; }}
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {p.is_bestseller && <span className="bg-[#C4A36E] text-white text-[10px] font-bold px-2 py-1 rounded-full">الأكثر مبيعاً</span>}
                  {p.is_editorial && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">تحريري</span>}
                  {!p.is_active && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">معطل</span>}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1 gap-2">
                  <h3 className="font-bold text-[#2C2C2C] line-clamp-1 flex-1">{p.name_ar}</h3>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {p.stock > 0 ? `${p.stock} قطعة` : 'نفد'}
                  </span>
                </div>
                <p className="text-[#C4A36E] font-semibold text-sm mb-2">
                  {p.price.toLocaleString('ar-EG')} ج.م
                </p>
                {p.category_name && (
                  <span className="text-[10px] bg-[#F5F1EA] text-[#747878] px-2 py-0.5 rounded-full mb-3 inline-block">
                    {p.category_name}
                  </span>
                )}
                <div className="flex gap-2 mt-3">
                  {p.is_active ? (
                    // Active product: Edit + Disable
                    <>
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
                        تعطيل
                      </button>
                    </>
                  ) : (
                    // Disabled product: full-width Restore button
                    <button
                      onClick={() => openRestore(p)}
                      className="w-full flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl py-2 text-sm hover:bg-green-100 transition-colors font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      استعادة المنتج
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 text-[#747878]">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>لا توجد منتجات نشطة.</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-[#2C2C2C] mb-2">تعطيل المنتج</h3>
            <p className="text-[#747878] text-sm mb-6">سيتم إخفاء المنتج من الموقع (لن يُحذف نهائياً).</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-[#C4A36E]/30 text-[#747878] rounded-xl py-2.5 text-sm hover:bg-[#F5F1EA]">
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isPending}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تأكيد التعطيل'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#C4A36E]/10 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-bold text-[#2C2C2C]">
                {isAdding ? 'إضافة منتج جديد' : isRestoring ? `استعادة: ${editProduct?.name_ar}` : `تعديل: ${editProduct?.name_ar}`}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#747878] hover:text-[#2C2C2C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">اسم المنتج <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name_ar}
                  onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
                  className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#444748] mb-2">السعر (ج.م) <span className="text-red-500">*</span></label>
                  <input
                    type="number" min={0} value={form.price || ''}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#444748] mb-2">المخزون</label>
                  <input
                    type="number" min={0} value={form.stock ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">التصنيف</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm"
                >
                  <option value="">— بدون تصنيف —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name_ar}</option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">صورة المنتج</label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInputChange} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileInputChange} />

                <div
                  onDragOver={(e) => { e.preventDefault(); setImageDragging(true); }}
                  onDragLeave={() => setImageDragging(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${imageDragging ? 'border-[#C4A36E] bg-[#C4A36E]/5' : 'border-[#C4A36E]/30 bg-[#F5F1EA]'}`}
                >
                  {imageUploading ? (
                    <div className="h-40 flex flex-col items-center justify-center gap-3 text-[#C4A36E]">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm">جاري الرفع إلى ImgBB...</p>
                    </div>
                  ) : form.image ? (
                    <div className="relative h-40 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image} alt="معاينة" className="max-h-36 max-w-full object-contain rounded-xl p-2" />
                      <button type="button" onClick={() => setForm((f) => ({ ...f, image: '' }))} className="absolute top-2 left-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-3 text-[#747878]">
                      <Upload className="w-8 h-8 opacity-40" />
                      <p className="text-sm">اسحب الصورة هنا أو اختر من الأزرار أدناه</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    disabled={imageUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#C4A36E]/30 text-[#444748] rounded-xl py-2.5 text-sm hover:bg-[#C4A36E]/10 transition-all disabled:opacity-50"
                  >
                    {imageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    رفع صورة
                  </button>
                  <button
                    type="button"
                    disabled={imageUploading}
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#C4A36E]/30 text-[#444748] rounded-xl py-2.5 text-sm hover:bg-[#C4A36E]/10 transition-all disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" /> التقاط صورة
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#444748] mb-2">الوصف</label>
                <textarea
                  rows={3} value={form.description_ar}
                  onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))}
                  className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                {([
                  ['is_active', 'نشط'],
                  ['is_bestseller', 'الأكثر مبيعاً'],
                  ['is_editorial', 'تحريري'],
                  ['is_month_perfume', 'عطر الشهر'],
                ] as [keyof FormState, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                      className={`w-10 h-6 rounded-full transition-all duration-200 relative ${form[key] ? 'bg-[#C4A36E]' : 'bg-[#C4A36E]/20'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form[key] ? 'left-5' : 'left-1'}`} />
                    </div>
                    <span className="text-sm text-[#444748]">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-[#C4A36E]/30 text-[#747878] rounded-xl py-3 text-sm hover:bg-[#F5F1EA]">
                إلغاء
              </button>
              <button
                id="admin-save-product-btn"
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2C2C2C] text-[#C4A36E] rounded-xl py-3 text-sm hover:bg-black font-medium disabled:opacity-60"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isRestoring ? <RotateCcw className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {isAdding ? 'إضافة المنتج' : isRestoring ? 'استعادة وحفظ' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
