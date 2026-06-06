# Task: Build Cyanotype Clothing E-Commerce Site

## Summary
Built a complete full-stack cyanotype clothing e-commerce site using Next.js 16, TypeScript, Tailwind CSS 4, and shadcn/ui components.

## Files Created/Modified

### API Routes
- `src/app/api/upload/route.ts` — File upload handler (saves to public/uploads/)
- `src/app/api/products/route.ts` — CRUD operations for products (GET, POST, PUT, DELETE)
- `src/app/api/settings/route.ts` — Site settings management (GET, PUT)

### Storefront Components
- `src/components/storefront/Header.tsx` — Sticky header with promo bar, navigation dropdowns, mobile menu, and icons
- `src/components/storefront/Hero.tsx` — Full-width hero banner with dark overlay and animated headline
- `src/components/storefront/ProductGrid.tsx` — Responsive product grid (2/3/4 columns) with sold out badges and hover effects
- `src/components/storefront/Footer.tsx` — Newsletter signup, link columns, payment icons, and admin access button

### Admin Panel Components
- `src/components/admin/AdminPanel.tsx` — Main admin layout with sidebar navigation (desktop) and tab bar (mobile)
- `src/components/admin/InventoryForm.tsx` — Product add/edit form with image upload, category/technique selects, stock toggle
- `src/components/admin/InventoryTable.tsx` — Products table with thumbnails, badges, and edit/delete actions
- `src/components/admin/DesignForm.tsx` — Site settings form (promo text, hero headline, hero image upload with preview)

### Main Page
- `src/app/page.tsx` — Client-side toggle between storefront and admin views using React state

### Layout
- `src/app/layout.tsx` — Updated metadata for CYANOTYPE brand

## Key Features
- Storefront as default view with animated transitions
- Discreet admin access via gear icon in footer
- Full CRUD for products with image upload
- Site settings management (promo bar, hero, headline)
- Responsive design (mobile-first)
- Framer Motion animations
- Toast notifications for admin actions
- All prices displayed as "XXX DH"

## Status: Complete
- Lint: Passing (no errors)
- Dev server: Running, all routes returning 200
- Database: Seeded with 6 products and site settings
