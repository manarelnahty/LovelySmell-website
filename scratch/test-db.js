const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  console.log('Testing fetch without category filter...');
  const { data: d1, error: e1 } = await supabase
    .from('products')
    .select('*, categories(name_ar), product_images(image_url, is_primary)')
    .eq('is_active', true);
  
  if (e1) console.error('Error 1:', e1);
  else console.log('Result 1 (count):', d1.length);

  console.log('Testing fetch with category filter (using !inner)...');
  const categoryName = 'عطور شرقية';
  const { data: d2, error: e2 } = await supabase
    .from('products')
    .select('*, categories!inner(name_ar), product_images(image_url, is_primary)')
    .eq('is_active', true)
    .eq('categories.name_ar', categoryName);

  if (e2) console.error('Error 2:', e2);
  else console.log('Result 2 (count):', d2.length);
}

testFetch();
