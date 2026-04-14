import { supabase } from './supabase';
import { PRODUCTS } from './data';

export async function seedProducts() {
  console.log('Seeding products to Supabase...');
  
  // Format products for Supabase (remove id if we want DB to generate, or keep if we want to sync)
  const productsToInsert = PRODUCTS.map(({ id, created_at, ...rest }) => ({
    ...rest,
    // Ensure numeric fields are numbers
    price: Number(rest.price),
    stock: Number(rest.stock),
  }));

  const { data, error } = await (supabase.from('products') as any)
    .upsert(productsToInsert, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('Error seeding products:', error);
    return { success: false, error };
  }

  console.log(`Successfully seeded ${data.length} products.`);
  return { success: true, count: data.length };
}
