// Single source of truth for categories (used by the navbar, sidebar,
// landing page, product filters, admin form and API validation).
export const CATEGORIES = [
  { name: 'Art', slug: 'art', icon: 'bi-palette' },
  { name: 'Fashion', slug: 'fashion', icon: 'bi-bag-check' },
  { name: 'Phones', slug: 'phones', icon: 'bi-phone' },
  { name: 'Digital Assets', slug: 'digital-assets', icon: 'bi-cpu' },
  { name: 'Game Items', slug: 'game-items', icon: 'bi-controller' },
  { name: 'Furniture', slug: 'furniture', icon: 'bi-house-door' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', icon: 'bi-stars' },
  { name: 'Groceries & Everyday Essentials', slug: 'groceries-essentials', icon: 'bi-basket' },
  { name: 'Automobile Accessories', slug: 'automobile-accessories', icon: 'bi-car-front' },
];

/** Accepts either a slug ("digital-assets") or a name ("Digital Assets"). */
export function findCategory(value) {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  return CATEGORIES.find((c) => c.slug === v || c.name.toLowerCase() === v) || null;
}
