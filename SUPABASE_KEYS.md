# Supabase Keys Configuration

## Your Project Information:
- **Project ID**: ncbwsxrajwvgdscsxosq
- **Project URL**: https://ncbwsxrajwvgdscsxosq.supabase.co
- **Dashboard URL**: https://supabase.com/dashboard/project/ncbwsxrajwvgdscsxosq

## Getting Your API Keys:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/ncbwsxrajwvgdscsxosq)
2. Click on "Settings" in the left sidebar
3. Click on "API" 
4. Copy the **"anon public"** key (this is what we need, not the publishable key)

The anon key should look like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jYndze...
```

## Current Configuration Status:
- ✅ Project URL configured correctly
- ⚠️  Need correct anon public key from dashboard

## Next Steps:
1. Get the anon public key from Settings > API
2. Replace the key in `src/lib/supabase.ts`
3. Run the database schema in SQL Editor
4. Switch components to use database hook
