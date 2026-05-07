import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export const metadata = {
  title: "الملف الشخصي | Lovely Smell",
  description: "إعدادات الحساب والملف الشخصي",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Get auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If no profile data exists, we pass a default object using user metadata if available
  const initialData = profile || {
    full_name: user.user_metadata?.full_name || null,
    phone: null,
    governorate: null,
    city: null,
    address: null,
    avatar_url: user.user_metadata?.avatar_url || null,
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-4 dir-rtl">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-right">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-secondary/60 hover:text-secondary mb-4 transition-colors group"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>العودة للرئيسية</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-secondary mb-2">
              إعدادات الحساب
            </h1>
            <p className="text-on-surface/70">
              قم بتحديث معلوماتك الشخصية وعنوان الشحن الخاص بك
            </p>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-sm border border-secondary/10">
          <ProfileForm 
            key={profile?.updated_at || "initial"} 
            initialData={initialData} 
          />
        </div>
      </div>
    </div>
  );
}
