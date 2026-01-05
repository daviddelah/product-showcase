# Product Showcase - Setup Instructions

## 1. Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in project details:
   - Name: product-showcase (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your location
4. Wait for project to finish setting up

### Run Database Migration
1. In your Supabase project dashboard, go to the **SQL Editor**
2. Open the migration file: `supabase/migrations/001_initial_schema.sql`
3. Copy the entire SQL content
4. Paste into the SQL Editor
5. Click **Run** to execute

### Create Storage Bucket
1. Navigate to **Storage** in the left sidebar
2. Click **New bucket**
3. Bucket name: `product-images`
4. Make bucket **public**
5. Click **Create bucket**

### Configure Storage Policies
1. Click on the `product-images` bucket
2. Go to **Policies** tab
3. Click **New policy** and create the following policies:

**Policy 1: Public read access**
```sql
CREATE POLICY "Public images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
```

**Policy 2: Service role upload**
```sql
CREATE POLICY "Service role can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');
```

**Policy 3: Service role update**
```sql
CREATE POLICY "Service role can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');
```

**Policy 4: Service role delete**
```sql
CREATE POLICY "Service role can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
```

### Get API Keys
1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your Supabase keys from above

3. Generate NextAuth secret:
```bash
openssl rand -base64 32
```
Replace `your-nextauth-secret` with the generated value

4. Set a secure admin password:
Replace `your-secure-password` with your desired admin password

Example `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
NEXTAUTH_SECRET=abc123xyz789...
NEXTAUTH_URL=http://localhost:3000
ADMIN_PASSWORD=MySecurePassword123!
```

## 3. Run the Development Server

```bash
npm run dev
```

Visit:
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## 4. First Login

1. Go to http://localhost:3000/admin/login
2. Enter the password you set in `ADMIN_PASSWORD`
3. You'll be redirected to the admin dashboard
4. Click "New Product" to create your first product

## Deployment

See the main README for deployment instructions to Vercel.
