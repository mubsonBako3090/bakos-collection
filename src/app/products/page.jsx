import { Suspense } from 'react';
import ProductsView from '@/components/ProductsView';

export const metadata = { title: "Products - Bako's Collection" };

export default function ProductsPage() {
  // useSearchParams() needs a Suspense boundary during `next build`.
  return (
    <Suspense fallback={<p className="container my-5 text-muted">Loading…</p>}>
      <ProductsView />
    </Suspense>
  );
}
