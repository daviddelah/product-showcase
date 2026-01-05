# Product Showcase

A minimalist one-page product showcase website inspired by OpenAI Supply's clean aesthetic. Features a simple admin panel for managing products with image hover effects.

## Features

- **Minimalist Design**: Clean, gallery-style grid layout with generous whitespace
- **Hover Effects**: Smooth transition between primary and secondary product images
- **Admin Panel**: Full CRUD interface for managing products
- **Image Upload**: Easy drag-and-drop image uploads to Supabase Storage
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Built with Next.js 14 App Router and ISR for optimal performance
- **Secure**: Simple password-based authentication for admin access

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd product-showcase
npm install
```

### 2. Set Up Supabase

Follow the detailed instructions in [SETUP.md](./SETUP.md) to:
1. Create a Supabase project
2. Run the database migration
3. Create the storage bucket
4. Get your API keys

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Admin Password
ADMIN_PASSWORD=your-secure-password
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin/login

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Public homepage
│   ├── layout.tsx                  # Root layout
│   ├── admin/                      # Admin panel pages
│   │   ├── page.tsx               # Dashboard
│   │   ├── login/page.tsx         # Login
│   │   └── products/              # Product management
│   └── api/
│       ├── auth/                   # NextAuth routes
│       └── products/               # Product API endpoints
├── components/
│   ├── ProductCard.tsx             # Product card with hover
│   ├── ProductGrid.tsx             # Responsive grid
│   ├── ProductForm.tsx             # Create/edit form
│   ├── ImageUpload.tsx             # Image upload UI
│   └── AdminNav.tsx                # Admin navigation
├── lib/
│   ├── supabase/                   # Supabase clients
│   └── db/                         # Database queries
└── types/
    └── index.ts                    # TypeScript types
```

## Usage

### Adding Products

1. Log in at `/admin/login` with your admin password
2. Click "New Product"
3. Fill in:
   - **Title**: Product name
   - **Year Launched**: Year the product was released
   - **Primary Image**: Main product image (required)
   - **Secondary Image**: Alternate view for hover effect (optional)
4. Click "Create Product"

### Managing Products

- **Edit**: Click "Edit" next to any product in the dashboard
- **Delete**: Click "Delete" to remove a product (images are automatically deleted)
- **View Site**: Click "View Site" in the admin nav to see the public page

## Design Philosophy

The site follows a minimalist aesthetic inspired by OpenAI Supply:

- **Pure white background** (#ffffff)
- **Near-black text** (#171717)
- **Generous whitespace** for breathing room
- **Subtle borders** (1px, neutral colors)
- **High-quality photography** as the focal point
- **Smooth transitions** (500ms fade for hover effects)
- **Responsive grid** adapting to all screen sizes

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables in Vercel project settings
4. Update `NEXTAUTH_URL` to your production domain
5. Deploy

### Environment Variables for Production

Make sure to set all environment variables from `.env.local` in your Vercel project settings, updating `NEXTAUTH_URL` to your production URL.

## Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## API Routes

- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product (requires auth)
- `GET /api/products/[id]` - Fetch single product
- `PATCH /api/products/[id]` - Update product (requires auth)
- `DELETE /api/products/[id]` - Delete product (requires auth)

## License

MIT
