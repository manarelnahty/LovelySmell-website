import { getProducts } from './lib/actions/products';

async function test() {
  try {
    const products = await getProducts({ limit: 1 });
    console.log('Success:', products.length, 'products found');
  } catch (err) {
    console.error('Failed to fetch products:', err);
    process.exit(1);
  }
}

test();
