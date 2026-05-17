import { getProducts } from '../lib/actions/products';

async function test() {
  try {
    const result = await getProducts({ limit: 1 });
    console.log('Success:', result.products.length, 'products found out of', result.totalCount);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    process.exit(1);
  }
}

test();
