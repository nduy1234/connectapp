# Connect - Startup Networking Mobile App

A beautiful mobile-first startup networking platform built with React, Supabase, and Capacitor.

## Project Info

**URL**: https://lovable.dev/projects/f5037265-3c96-4a94-b2e3-c15668dd6b1c

## 🚀 Features

- ✨ **Authentication** - Email/password, Google, and Apple sign-in
- 👤 **User Profiles** - Comprehensive startup profiles with stories, goals, and media uploads
- 💬 **Real-time Messaging** - Connect and chat with other entrepreneurs
- 🔒 **Privacy Controls** - Manage profile visibility and messaging preferences
- 🔔 **Notifications** - Customizable notification settings
- 📱 **Mobile Native** - Built with Capacitor for iOS and Android

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase account (credentials already configured)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://ktwgptvbgyongxaanxdt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0d2dwdHZiZ3lvbmd4YWFueGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODM4NzQsImV4cCI6MjA3NDE1OTg3NH0.h4qPLsrgLrU07LBnKLoUfN_DaHQvG5pUqDxGZWzzsQA
VITE_SUPABASE_PROJECT_ID=ktwgptvbgyongxaanxdt
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080)

## 📱 Mobile Development

For detailed mobile development instructions with Capacitor, see [SETUP.md](./SETUP.md)

**Quick commands:**
```bash
# Build the app
npm run build

# Sync with Capacitor
npx cap sync

# Open in native IDE
npx cap open ios    # Requires macOS & Xcode
npx cap open android # Requires Android Studio
```

## 🗄️ Database Setup

See [SETUP.md](./SETUP.md) for complete Supabase database schema and RLS policies.

## 🎨 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui components
- **Backend:** Supabase (Auth, Database, Realtime)
- **Mobile:** Capacitor
- **State:** TanStack Query
- **Routing:** React Router v6

## 📝 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── MobileApp.tsx   # Main app component
│   ├── ConversationList.tsx
│   ├── ChatDetail.tsx
│   └── ComposeMessageDialog.tsx
├── hooks/              # Custom React hooks
│   └── useAuth.tsx     # Authentication hook
├── integrations/       # External integrations
│   └── supabase/      # Supabase client & types
├── lib/               # Utilities
│   ├── utils.ts
│   └── supabase.ts
└── pages/             # Route pages
    ├── Index.tsx
    └── NotFound.tsx
```

## 🚢 Deployment

### Web (Lovable)
This project is configured for Lovable. Visit [your project](https://lovable.dev/projects/f5037265-3c96-4a94-b2e3-c15668dd6b1c) and click "Publish".

### Mobile App Stores
1. Build: `npm run build`
2. Sync: `npx cap sync`
3. Open native IDE and follow platform-specific submission guidelines

## 📚 Documentation Links

- [Full Setup Guide](./SETUP.md)
- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)
