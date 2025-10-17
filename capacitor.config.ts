import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f50372653c964a94b2e3c15668dd6b1c',
  appName: 'Connect - A Lovable Mobile App',
  webDir: 'dist',
  server: {
    url: 'https://f5037265-3c96-4a94-b2e3-c15668dd6b1c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#6366f1',
    }
  }
};

export default config;