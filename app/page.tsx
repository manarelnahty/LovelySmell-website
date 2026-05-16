import { getProducts } from '@/lib/actions/products';
import HomeClient from './HomeClient';

export default async function Page() {
  // Fetch best sellers (featured products) from Supabase
  const bestSellers = await getProducts({ 
    isBestseller: true,
    limit: 8 
  });

  return <HomeClient bestSellers={bestSellers.products} />;
}
