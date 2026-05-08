'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const fullName = formData.get('name') as string

  if (password !== confirmPassword) {
    return { error: 'كلمات المرور غير متطابقة' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: 'تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.' }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  // Get the site URL for the redirect
  const headersList = await (await import('next/headers')).headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'https' // Default to https for production
  let origin = headersList.get('origin') || process.env.URL || `${protocol}://${host}`
  
  // Ensure origin doesn't have a trailing slash for consistency
  if (origin.endsWith('/')) origin = origin.slice(0, -1)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const headersList = await (await import('next/headers')).headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  let origin = headersList.get('origin') || process.env.URL || `${protocol}://${host}`
  
  if (origin.endsWith('/')) origin = origin.slice(0, -1)

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' }
}

export async function updatePassword(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: 'كلمات المرور غير متطابقة' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?message=تم تحديث كلمة المرور بنجاح')
}
