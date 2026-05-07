"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { updateProfile, ProfileActionState } from "@/lib/actions/profile";
import { User, Upload, CheckCircle2, AlertCircle, Loader2, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { governorates, cities } from "@/lib/data/egypt-data";

export default function ProfileForm({
  initialData,
}: {
  initialData: {
    full_name: string | null;
    phone: string | null;
    governorate: string | null;
    city: string | null;
    address: string | null;
    avatar_url: string | null;
  } | null;
}) {
  const [state, formAction, isPending] = useActionState<ProfileActionState, FormData>(
    updateProfile,
    { error: null, success: null }
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.avatar_url || null
  );

  // State for controlled selects
  const [governorate, setGovernorate] = useState(() => {
    const initial = initialData?.governorate || "";
    const found = governorates.find(g => g.governorate_name_ar === initial || g.governorate_name_en === initial);
    return found ? found.governorate_name_ar : initial;
  });
  
  const [city, setCity] = useState(() => {
    const initial = initialData?.city || "";
    const found = cities.find(c => c.city_name_ar === initial || c.city_name_en === initial);
    return found ? found.city_name_ar : initial;
  });

  // Sync state with initialData when it changes (e.g. after successful save)
  useEffect(() => {
    if (initialData?.governorate) {
      const found = governorates.find(g => g.governorate_name_ar === initialData.governorate || g.governorate_name_en === initialData.governorate);
      setGovernorate(found ? found.governorate_name_ar : initialData.governorate);
    }
    if (initialData?.city) {
      const found = cities.find(c => c.city_name_ar === initialData.city || c.city_name_en === initialData.city);
      setCity(found ? found.city_name_ar : initialData.city);
    }
  }, [initialData]);

  // Find governorate ID for filtering
  const selectedGovObj = governorates.find(
    g => g.governorate_name_ar === governorate || g.governorate_name_en === governorate
  );
  const filteredCities = selectedGovObj ? cities.filter(c => c.governorate_id === selectedGovObj.id) : [];

  // Reset city when governorate changes
  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGovernorate(e.target.value);
    setCity(""); // Reset city when governorate changes
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Messages */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 border border-red-100"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{state.error}</p>
        </motion.div>
      )}

      {state.success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 border border-green-100"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p>{state.success}</p>
        </motion.div>
      )}

      {/* Avatar Upload */}
      <div className="flex flex-col items-center justify-center p-6 border border-secondary/10 bg-white rounded-2xl shadow-sm">
        <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-secondary/5 border-2 border-secondary/20 flex items-center justify-center relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 md:w-12 md:h-12 text-secondary/40" />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <p className="text-sm text-secondary/60">انقر لتغيير الصورة الشخصية</p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-medium text-on-surface flex items-center gap-2">
            <User className="w-4 h-4 text-secondary/60" />
            الاسم بالكامل
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={initialData?.full_name || ""}
            placeholder="الاسم الثلاثي"
            className="w-full bg-transparent border-b border-secondary/30 py-3 px-2 focus:border-secondary focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-on-surface flex items-center gap-2">
            <div className="w-4 h-4 text-secondary/60">📱</div>
            رقم الهاتف
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={initialData?.phone || ""}
            placeholder="01xxxxxxxxx"
            className="w-full bg-transparent border-b border-secondary/30 py-3 px-2 focus:border-secondary focus:outline-none transition-colors dir-ltr text-right"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="governorate" className="text-sm font-medium text-on-surface flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary/60" />
            المحافظة
          </label>
          <select
            id="governorate"
            name="governorate"
            value={governorate}
            onChange={handleGovChange}
            className="w-full bg-transparent border-b border-secondary/30 py-3 px-2 focus:border-secondary focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">اختر المحافظة</option>
            {governorates.map((gov) => (
              <option key={gov.id} value={gov.governorate_name_ar}>
                {gov.governorate_name_ar}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-on-surface flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary/60" />
            المدينة / المركز
          </label>
          <select
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent border-b border-secondary/30 py-3 px-2 focus:border-secondary focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">اختر المدينة</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.city_name_ar}>
                {c.city_name_ar}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="text-sm font-medium text-on-surface">
            العنوان التفصيلي
          </label>
          <textarea
            id="address"
            name="address"
            defaultValue={initialData?.address || ""}
            placeholder="الشارع، رقم المبنى، الشقة..."
            rows={3}
            className="w-full bg-transparent border-b border-secondary/30 py-3 px-2 focus:border-secondary focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto px-10 rounded-full h-12 bg-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ التغييرات"
          )}
        </button>
      </div>
    </form>
  );
}
