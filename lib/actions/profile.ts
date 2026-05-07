"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileActionState = {
  error: string | null;
  success: string | null;
};

const IMGBB_API_KEY = "4b69ea9c24dcfbfab5b8d4dc3784b006";

export async function updateProfile(
  prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();

  // 1. Authenticate User
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "يجب تسجيل الدخول لتحديث ملفك الشخصي.", success: null };
  }

  // 2. Extract form data
  const fullName = formData.get("full_name") as string | null;
  const phone = formData.get("phone") as string | null;
  const governorate = formData.get("governorate") as string | null;
  const city = formData.get("city") as string | null;
  const address = formData.get("address") as string | null;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl: string | undefined = undefined;

  // 3. Handle Image Upload to IMGBB
  if (avatarFile && avatarFile.size > 0) {
    try {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      const imgbbFormData = new FormData();
      imgbbFormData.append("image", base64);

      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imgbbFormData,
        }
      );

      const imgbbData = await imgbbResponse.json();

      if (imgbbData.success) {
        avatarUrl = imgbbData.data.url;
      } else {
        return { error: "حدث خطأ أثناء رفع الصورة.", success: null };
      }
    } catch (uploadError) {
      console.error("Image upload error:", uploadError);
      return { error: "فشل الاتصال بخادم رفع الصور.", success: null };
    }
  }

  // 4. Update Supabase Database
  try {
    const updateData: any = {
      full_name: fullName,
      phone: phone,
      governorate: governorate,
      city: city,
      address: address,
      updated_at: new Date().toISOString(),
    };

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return { error: "حدث خطأ أثناء حفظ البيانات.", success: null };
    }

    // Refresh layout and paths
    revalidatePath("/", "layout");
    revalidatePath("/profile");

    return { error: null, success: "تم حفظ التغييرات بنجاح!" };
  } catch (error) {
    return { error: "حدث خطأ غير متوقع.", success: null };
  }
}
