# Connect - Setup Guide

This is a mobile-first startup networking app built with React, Supabase, and Capacitor.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- A Supabase account (credentials already configured)

### Installation

1. **Install dependencies:**
```bash
npm install
# or
bun install
```

2. **Set up environment variables:**
Create a `.env` file in the root directory with:
```env
VITE_SUPABASE_URL=https://ktwgptvbgyongxaanxdt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0d2dwdHZiZ3lvbmd4YWFueGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODM4NzQsImV4cCI6MjA3NDE1OTg3NH0.h4qPLsrgLrU07LBnKLoUfN_DaHQvG5pUqDxGZWzzsQA
VITE_SUPABASE_PROJECT_ID=ktwgptvbgyongxaanxdt
```

3. **Run the development server:**
```bash
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

## 📱 Mobile Development with Capacitor

This app is configured to run as a native mobile app using Capacitor.

### Setup Mobile Development

1. **Build the web app:**
```bash
npm run build
```

2. **Add platforms:**
```bash
# For iOS (requires macOS with Xcode)
npx cap add ios

# For Android (requires Android Studio)
npx cap add android
```

3. **Sync changes:**
```bash
npx cap sync
```

4. **Open in native IDE:**
```bash
# Open in Xcode
npx cap open ios

# Open in Android Studio
npx cap open android
```

### Live Reload in Development

The app is configured to use live reload from the development server:
- The `capacitor.config.ts` points to the Lovable project URL
- For local development, update the `server.url` in `capacitor.config.ts` to `http://localhost:5173`
- Remember to run `npx cap sync` after changes

## 🗄️ Database Setup

### Supabase Tables

You'll need to create the following tables in your Supabase project:

#### Profiles Table
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  full_name text,
  avatar_url text,
  company_name text,
  location text,
  industry text,
  startup_story text,
  goals text,
  favorite_startup text
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = user_id);
```

#### Messages Table
```sql
create table messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references auth.users not null,
  receiver_id uuid references auth.users not null,
  content text not null,
  read boolean default false
);

-- Enable RLS
alter table messages enable row level security;

-- Policies
create policy "Users can view messages they sent or received"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update messages they received"
  on messages for update
  using (auth.uid() = receiver_id);
```

## 🎨 Features

- ✅ Email/Password Authentication
- ✅ Social Auth (Google, Apple - needs configuration in Supabase)
- ✅ User Profiles with startup information
- ✅ Real-time Messaging
- ✅ Privacy Settings
- ✅ Notification Preferences
- ✅ Mobile-optimized UI
- ✅ Glass morphism design
- ✅ Smooth animations

## 🔧 Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Mobile:** Capacitor
- **State Management:** TanStack Query
- **Routing:** React Router

## 📝 Environment Variables

All environment variables should be prefixed with `VITE_` to be accessible in the React app.

Current configuration:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

## 🚢 Deployment

### Web Deployment
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- Lovable (already configured)
- Firebase Hosting

### Mobile Deployment
1. Build for production: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Open in native IDE: `npx cap open ios/android`
4. Build and submit to App Store/Play Store

## 🔐 Security Notes

- Never commit `.env` files to version control
- The Supabase keys provided are public keys - they're safe to use in client-side code
- Row Level Security (RLS) policies protect your data in Supabase
- Enable additional Supabase security features as needed

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
