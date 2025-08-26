# Supabase Database Setup for Baby Shower Website

## 🚀 Quick Setup

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New project"
3. Choose a name: `baby-shower-registry`
4. Set a database password (save this!)
5. Choose a region close to you

### 2. Get Your API Keys
1. In your Supabase dashboard, go to Settings > API
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon public key**: `eyJ...` (starts with eyJ)

### 3. Set Up the Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy the entire contents of `database/wishlist-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to create the table and insert initial data

### 4. Configure Your Website
1. Open `src/lib/supabase.ts`
2. Replace the placeholder values:
   ```typescript
   const supabaseUrl = 'https://your-actual-project-id.supabase.co'
   const supabaseAnonKey = 'your-actual-anon-key-here'
   ```

### 5. Switch to Database Mode
1. Open `src/components/Wishlist.tsx`
2. Change the import from:
   ```typescript
   import { useWishlist } from '../hooks/useWishlist';
   ```
   To:
   ```typescript
   import { useWishlistDatabase as useWishlist } from '../hooks/useWishlistDatabase';
   ```

3. Do the same in `src/components/AdminDashboard.tsx`

## 🎯 What This Gives You

✅ **Persistent Data**: Claims are saved permanently  
✅ **Real-time Sync**: All users see the same data  
✅ **Admin Features**: Full CRUD operations  
✅ **Backup**: Automatic fallback to localStorage  
✅ **Messages**: Guest messages stored in database  

## 🛠️ Database Features

- **Row Level Security**: Public can read/write (appropriate for family registry)
- **Optimized Queries**: Indexed for fast performance
- **Data Validation**: Ensures data integrity
- **Automatic Timestamps**: Tracks when items are claimed

## 🔧 Troubleshooting

**Can't connect?**
- Double-check your URL and API key
- Make sure you ran the SQL schema
- Check browser console for errors

**Data not syncing?**
- Website falls back to localStorage automatically
- Check your internet connection
- Verify Supabase project is active

## 📊 Viewing Your Data
- Go to Supabase Dashboard > Table Editor
- Click on `wishlist_items` table
- See all claims, messages, and item data in real-time!

## 🔒 Security Note
This setup allows public read/write access, which is appropriate for a family baby registry where guests need to claim items. The data is not sensitive and the worst case is someone unclaiming an item (which admins can fix).
