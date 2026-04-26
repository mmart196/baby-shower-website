# Baptism RSVP Website

A beautiful, responsive RSVP website for Baby Martinez's baptism celebration. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- ✨ Elegant baptism-themed design (white, gold, blue colors)
- 📝 RSVP form with guest count and dietary restrictions
- 📊 Admin dashboard to manage RSVPs
- 💾 Supabase database for persistent storage
- 📱 Mobile-responsive design
- 🔒 Simple password protection for admin access

## Getting Started

### 1. Install Dependencies

```bash
cd baptism-rsvp
pnpm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your Project URL and Anon Key from Settings > API
3. Update `src/lib/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key'
```

4. Run the SQL in `database/baptism-schema.sql` in the Supabase SQL Editor

### 3. Run Locally

```bash
pnpm dev
```

### 4. Admin Access

- Go to `#admin` in the URL
- Password: `baptism2025`
- View, filter, and export RSVPs

## Event Details

Update these in `src/data/initialData.ts`:

- Baby's name
- Date and time
- Church location
- Contact email

## Deployment

Build for production:

```bash
pnpm build
```

Deploy the `dist` folder to Vercel, Netlify, or any static host.

## Customization

- Colors: Edit Tailwind classes (amber = gold, blue = accent)
- Fonts: Already set to Playfair Display (headings) and Inter (body)
- Images: Replace the photo placeholder in Homepage.tsx

---

Made with love for Baby Martinez's special day ✝️
