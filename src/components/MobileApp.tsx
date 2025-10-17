import React, { useState, useRef } from 'react';
import { Home, User, BookOpen, MessageCircle, Briefcase, Bell, Settings, Eye, EyeOff, Mail, Lock, ArrowLeft, Check, Loader2, Users, Calendar, Activity, Rocket, Camera, Video, Upload, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConversationList } from './ConversationList';
import { ChatDetail } from './ChatDetail';
import { ComposeMessageDialog } from './ComposeMessageDialog';
interface UserData {
  name: string;
  firstName: string;
  email: string;
}
interface FormData {
  email: string;
  password: string;
  name: string;
  resetEmail: string;
}
interface ProfileData {
  startupStory: string;
  companyName: string;
  location: string;
  industry: string;
  goals: string;
  favoriteStartup: string;
}
type Screen = 'signin' | 'forgot-password' | 'reset-success' | 'welcome' | 'main';
type Tab = 'home' | 'profile' | 'resource' | 'message' | 'startups';
type WelcomeOption = 'network' | 'collaborate' | 'explore';
function MobileApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('signin');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<WelcomeOption[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    startupStory: '',
    companyName: '',
    location: '',
    industry: '',
    goals: '',
    favoriteStartup: ''
  });
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [messagingPrivacy, setMessagingPrivacy] = useState<'anyone' | 'favorites'>('anyone');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [favoritesNotifications, setFavoritesNotifications] = useState(true);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [selectedChatUserName, setSelectedChatUserName] = useState<string>('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Sample conversation data
  const conversations = [
    { id: 1, name: 'Sarah Chen', startupName: 'TechFlow AI', lastMessage: 'Looking forward to our collaboration!', time: '2m ago', avatar: 'SC' },
    { id: 2, name: 'Michael Rodriguez', startupName: 'FinWave', lastMessage: 'Thanks for the intro, let\'s connect', time: '15m ago', avatar: 'MR' },
    { id: 3, name: 'Emily Watson', startupName: 'GreenTech Solutions', lastMessage: 'I love your approach to sustainability', time: '1h ago', avatar: 'EW' },
    { id: 4, name: 'David Kim', startupName: 'HealthHub', lastMessage: 'Would love to discuss potential partnership', time: '3h ago', avatar: 'DK' },
    { id: 5, name: 'Jessica Lee', startupName: 'EduConnect', lastMessage: 'Great meeting you at the conference!', time: '1d ago', avatar: 'JL' },
  ];

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    messageSearchQuery === '' || 
    conv.name.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
    conv.startupName.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(messageSearchQuery.toLowerCase())
  );
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    resetEmail: ''
  });
  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAuth = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const firstName = isSignUp ? formData.name.split(' ')[0] : 'John';
      setUser({
        name: isSignUp ? formData.name : 'John Doe',
        firstName: firstName,
        email: formData.email
      });
      setCurrentScreen('welcome');
      setIsLoading(false);
    }, 2000);
  };
  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setTimeout(() => {
      const fullName = provider === 'google' ? 'Google User' : 'Apple User';
      const firstName = fullName.split(' ')[0];
      setUser({
        name: fullName,
        firstName: firstName,
        email: 'user@example.com'
      });
      setCurrentScreen('welcome');
      setIsLoading(false);
    }, 2000);
  };
  const handleForgotPassword = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentScreen('reset-success');
      setIsLoading(false);
    }, 2000);
  };
  const handleOptionToggle = (option: WelcomeOption) => {
    setSelectedOptions(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
  };
  const handleSaveProfile = async () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      // Show success notification
      console.log('Profile saved:', profileData);
      setIsSaving(false);
    }, 1500);
  };
  const handleWelcomeNext = () => {
    setCurrentScreen('main');
  };
  if (currentScreen === 'signin' || currentScreen === 'forgot-password' || currentScreen === 'reset-success') {
    return <div className="mobile-container">
        <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {currentScreen === 'signin' && <div className="glass-effect rounded-3xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <span className="text-white font-bold text-lg tracking-wide">connect</span>
                  </div>
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    {isSignUp ? "Let's connect!" : 'Welcome Back'}
                  </h1>
                  <p className="text-foreground-secondary">
                    {isSignUp ? 'Join our community today' : 'Sign in to your account'}
                  </p>
                </div>

                <form onSubmit={e => {
              e.preventDefault();
              handleAuth();
            }} className="space-y-6">
                  {isSignUp && <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                      <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" placeholder="Enter your full name" required />
                    </div>}
                  
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                      <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full pl-12 pr-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" placeholder="Enter your email" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                      <input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="w-full pl-12 pr-12 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" placeholder="Enter your password" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {!isSignUp && <div className="text-right mt-2">
                        <button type="button" onClick={() => setCurrentScreen('forgot-password')} className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
                          Forgot Password?
                        </button>
                      </div>}
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 button-hover-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </div> : isSignUp ? 'Create Account' : 'Sign In'}
                  </button>

                  {isSignUp && <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border-light"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-surface-glass text-foreground-muted font-medium">Or continue with</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button type="button" onClick={() => handleSocialAuth('google')} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-xl glass-effect hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 button-hover-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Continue with Google
                        </button>

                        <button type="button" onClick={() => handleSocialAuth('apple')} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-3 bg-foreground hover:bg-foreground-secondary text-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-200 button-hover-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                          Continue with Apple
                        </button>
                      </div>
                    </>}
                </form>

                <div className="mt-8 text-center">
                  <p className="text-foreground-secondary">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:text-primary-dark font-semibold transition-colors">
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </div>}

            {currentScreen === 'forgot-password' && <div className="glass-effect rounded-3xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <span className="text-white font-bold text-lg tracking-wide">connect</span>
                  </div>
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    Reset Password
                  </h1>
                  <p className="text-foreground-secondary">
                    Enter your email to receive reset instructions
                  </p>
                </div>

                <form onSubmit={e => {
              e.preventDefault();
              handleForgotPassword();
            }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                      <input type="email" value={formData.resetEmail} onChange={e => handleInputChange('resetEmail', e.target.value)} className="w-full pl-12 pr-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" placeholder="Enter your email address" required />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 button-hover-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Sending Reset Link...
                      </div> : 'Send Reset Link'}
                  </button>

                  <button type="button" onClick={() => setCurrentScreen('signin')} className="w-full flex items-center justify-center text-foreground-secondary hover:text-foreground font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </button>
                </form>
              </div>}

            {currentScreen === 'reset-success' && <div className="glass-effect rounded-3xl shadow-success p-8 text-center">
                <div className="w-20 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-success">
                  <span className="text-white font-bold text-lg tracking-wide">connect</span>
                </div>
                <h1 className="text-3xl font-bold text-success mb-4">
                  Check Your Email
                </h1>
                <p className="text-foreground-secondary mb-8">
                  We've sent password reset instructions to<br />
                  <span className="font-semibold text-foreground">{formData.resetEmail}</span>
                </p>
                <button onClick={() => setCurrentScreen('signin')} className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 button-hover-scale">
                  Back to Sign In
                </button>
              </div>}
          </div>
        </div>
      </div>;
  }
  if (currentScreen === 'welcome') {
    return <div className="mobile-container">
        <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="glass-effect rounded-3xl shadow-xl p-8 text-center">
              <div className="w-20 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-white font-bold text-lg tracking-wide">connect</span>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-4">
                Welcome {user?.firstName}!
              </h1>
              <p className="text-foreground-secondary mb-8">
                What would you like to do? Select all that apply.
              </p>
            </div>

            <div className="space-y-4 mt-6 mb-8">
              <div onClick={() => handleOptionToggle('network')} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 button-hover-scale ${selectedOptions.includes('network') ? 'border-primary bg-accent shadow-glass' : 'border-border glass-effect hover:border-primary-light hover:bg-accent/50'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${selectedOptions.includes('network') ? 'bg-gradient-primary shadow-glow' : 'bg-gradient-to-r from-muted to-muted-foreground'}`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">Network with others</h3>
                    <p className="text-foreground-secondary text-sm">Connect and build relationships with professionals</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedOptions.includes('network') ? 'border-primary bg-primary' : 'border-border'}`}>
                    {selectedOptions.includes('network') && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>

              <div onClick={() => handleOptionToggle('collaborate')} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 button-hover-scale ${selectedOptions.includes('collaborate') ? 'border-success bg-success/10 shadow-success' : 'border-border glass-effect hover:border-success hover:bg-success/5'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${selectedOptions.includes('collaborate') ? 'bg-gradient-success shadow-success' : 'bg-gradient-to-r from-muted to-muted-foreground'}`}>
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">Collaborate with others</h3>
                    <p className="text-foreground-secondary text-sm">Work together on projects and share ideas</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedOptions.includes('collaborate') ? 'border-success bg-success' : 'border-border'}`}>
                    {selectedOptions.includes('collaborate') && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>

              <div onClick={() => handleOptionToggle('explore')} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 button-hover-scale ${selectedOptions.includes('explore') ? 'border-warning bg-warning/10 shadow-warning' : 'border-border glass-effect hover:border-warning hover:bg-warning/5'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${selectedOptions.includes('explore') ? 'bg-gradient-warning shadow-warning' : 'bg-gradient-to-r from-muted to-muted-foreground'}`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">Explore resources</h3>
                    <p className="text-foreground-secondary text-sm">Discover learning materials and helpful guides</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedOptions.includes('explore') ? 'border-warning bg-warning' : 'border-border'}`}>
                    {selectedOptions.includes('explore') && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleWelcomeNext} className="w-full bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 button-hover-scale">
              Next
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="mobile-container">
      <div className="min-h-screen bg-gradient-background">
        {/* Main Content */}
        <div className="pb-20 custom-scrollbar">
          {activeTab === 'home' && <div className="p-6 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold gradient-text">
                    Welcome back, {user?.firstName}!
                  </h1>
                  <p className="text-foreground-secondary mt-1">Here's what's happening today</p>
                </div>
                <div className="w-16 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-sm tracking-wide">connect</span>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="glass-effect rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Recent Notifications</h2>
                  
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-info/10 rounded-xl border-l-4 border-info">
                    <div className="w-2 h-2 bg-info rounded-full mt-2 shadow-lg shadow-info/50"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">New message received</p>
                      <p className="text-foreground-secondary text-sm">You have a new message from Sarah</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-success/10 rounded-xl border-l-4 border-success">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 shadow-lg shadow-success/50"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Profile updated</p>
                      <p className="text-foreground-secondary text-sm">Your profile has been successfully updated</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-secondary/10 rounded-xl border-l-4 border-secondary">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shadow-lg shadow-secondary/50"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">New Connection</p>
                      <p className="text-foreground-secondary text-sm">John connected with you</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Settings */}
              <div className="glass-effect rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-foreground mb-6">Quick Settings</h2>
                <div className="space-y-4">
                  <div onClick={() => setActiveTab('profile')} className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-accent transition-all duration-200 cursor-pointer card-hover">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-foreground">Edit Profile</span>
                    </div>
                  </div>
                  <div onClick={() => setShowPrivacySettings(true)} className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-accent transition-all duration-200 cursor-pointer card-hover">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-success rounded-xl flex items-center justify-center shadow-success">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-foreground">Privacy Settings</span>
                    </div>
                  </div>
                  <div onClick={() => setShowNotificationSettings(true)} className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-accent transition-all duration-200 cursor-pointer card-hover">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-warning rounded-xl flex items-center justify-center shadow-warning">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-foreground">Notification Preferences</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              
            </div>}

          {activeTab === 'profile' && <div className="p-6 space-y-6">
              <div className="glass-effect rounded-2xl p-8 shadow-xl text-center">
                {/* Profile Image Preview */}
                <div className="flex justify-center mb-6">
                  {selectedImage ? <img src={URL.createObjectURL(selectedImage)} alt="Profile Preview" className="w-24 h-24 rounded-3xl object-cover shadow-glow border-2 border-primary/20" /> : <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow">
                      <User className="w-12 h-12 text-white" />
                    </div>}
                </div>
                <h2 className="text-2xl font-bold gradient-text mb-2">
                  {user?.name || 'Your Profile'}
                </h2>
                
                {/* My Startup Story Field */}
                <div className="mt-6 text-left">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    My Startup Story
                  </label>
                  <textarea value={profileData.startupStory} onChange={e => handleProfileChange('startupStory', e.target.value)} placeholder="Share your entrepreneurial journey, what inspired you to start, and what drives you forward..." className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none" rows={4} maxLength={500} />
                </div>

                {/* Additional Profile Fields */}
                <div className="mt-6 space-y-6 text-left">
                  {/* Company Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Company Name
                    </label>
                    <input type="text" value={profileData.companyName} onChange={e => handleProfileChange('companyName', e.target.value)} placeholder="Enter your company or startup name" className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
                  </div>

                  {/* Location Field */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Location
                    </label>
                    <input type="text" value={profileData.location} onChange={e => handleProfileChange('location', e.target.value)} placeholder="City, State/Country" className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
                  </div>

                  {/* Industry Field */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Industry
                    </label>
                    <input type="text" value={profileData.industry} onChange={e => handleProfileChange('industry', e.target.value)} placeholder="e.g., FinTech, HealthTech, AI/ML, E-commerce" className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
                  </div>

                  {/* Goals Field */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      My Goals
                    </label>
                    <textarea value={profileData.goals} onChange={e => handleProfileChange('goals', e.target.value)} placeholder="What are your current goals and what do you hope to achieve?" className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none" rows={3} maxLength={300} />
                    <span className="text-xs text-foreground-secondary mt-1 block">
                      Up to 300 characters
                    </span>
                  </div>

                  {/* Favorite Startup Field */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      One of my favorite startups and why
                    </label>
                    <textarea value={profileData.favoriteStartup} onChange={e => handleProfileChange('favoriteStartup', e.target.value)} placeholder="Share a startup you admire and what inspires you about them" className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none" rows={3} maxLength={300} />
                    <span className="text-xs text-foreground-secondary mt-1 block">
                      Up to 300 characters
                    </span>
                  </div>

                </div>
              </div>

              {/* Upload Options */}
              <div className="glass-effect rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-foreground mb-6">Upload Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profile Image Upload */}
                  <div className="p-6 border-2 border-dashed border-border rounded-xl hover:border-info hover:bg-info/5 transition-all duration-200 cursor-pointer group" onClick={() => imageInputRef.current?.click()}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-info rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-info group-hover:scale-110 transition-transform duration-200">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Profile Image</h4>
                      <p className="text-foreground-secondary text-sm mb-4">
                        {selectedImage ? `Selected: ${selectedImage.name}` : "Upload a profile picture to personalize your account"}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-info font-medium">
                        <Upload className="w-4 h-4" />
                        <span>{selectedImage ? 'Change Image' : 'Choose Image'}</span>
                      </div>
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedImage(file);
                    console.log('Image selected:', file);
                  }
                }} />
                  </div>

                  {/* Short Video Upload */}
                  <div className="p-6 border-2 border-dashed border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all duration-200 cursor-pointer group" onClick={() => videoInputRef.current?.click()}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform duration-200">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Short Video</h4>
                      <p className="text-foreground-secondary text-sm mb-4">
                        {selectedVideo ? `Selected: ${selectedVideo.name}` : "Share a short video introduction about yourself"}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-secondary font-medium">
                        <Upload className="w-4 h-4" />
                        <span>{selectedVideo ? 'Change Video' : 'Choose Video'}</span>
                      </div>
                    </div>
                    <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedVideo(file);
                    console.log('Video selected:', file);
                  }
                }} />
                  </div>
                </div>
              </div>

              {/* Save Profile Button */}
              <button onClick={handleSaveProfile} disabled={isSaving} className="w-full bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 button-hover-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSaving ? <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving Profile...
                  </div> : 'Save Profile'}
              </button>
            </div>}

          {activeTab === 'resource' && <div className="p-6">
              <div className="glass-effect rounded-2xl p-8 shadow-xl text-center">
                <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-success">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-success mb-4">
                  Resources
                </h2>
                <p className="text-foreground-secondary">Explore our learning materials and guides</p>
              </div>
            </div>}

          {activeTab === 'message' && (
            selectedChatUserId ? (
              <ChatDetail
                partnerId={selectedChatUserId}
                partnerName={selectedChatUserName}
                onBack={() => {
                  setSelectedChatUserId(null);
                  setSelectedChatUserName('');
                }}
              />
            ) : (
              <div className="p-6">
                <div className="glass-effect rounded-2xl p-6 shadow-xl">
                  {/* Header with New Message Button */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Messages</h2>
                    <Button
                      onClick={() => setShowNewMessageDialog(true)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Message
                    </Button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search messages or users..."
                      value={messageSearchQuery}
                      onChange={(e) => setMessageSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Conversation List */}
                  <ConversationList
                    searchQuery={messageSearchQuery}
                    onSelectConversation={(userId, userName) => {
                      setSelectedChatUserId(userId);
                      setSelectedChatUserName(userName);
                    }}
                  />
                </div>
              </div>
            )
          )}

          {activeTab === 'startups' && <div className="p-6">
              <div className="glass-effect rounded-2xl p-8 shadow-xl text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-secondary/30">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-4">
                  Startups
                </h2>
                <p className="text-foreground-secondary">Discover innovative startups and opportunities</p>
              </div>
            </div>}
        </div>

        {/* Privacy Settings Modal */}
        {showPrivacySettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-md glass-effect rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Privacy Settings</h2>
                <button 
                  onClick={() => setShowPrivacySettings(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 glass-effect rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Profile Visibility</h3>
                    <p className="text-sm text-foreground-secondary">Who can see your profile</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${profileVisibility === 'public' ? 'text-primary' : 'text-foreground-muted'}`}>
                      Public
                    </span>
                    <button
                      onClick={() => setProfileVisibility(profileVisibility === 'public' ? 'private' : 'public')}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        profileVisibility === 'public' 
                          ? 'bg-primary shadow-glow' 
                          : 'bg-muted'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        profileVisibility === 'public' 
                          ? 'translate-x-6' 
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                    <span className={`text-sm font-medium ${profileVisibility === 'private' ? 'text-primary' : 'text-foreground-muted'}`}>
                      Private
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 glass-effect rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Messaging Privacy</h3>
                    <p className="text-sm text-foreground-secondary">Who can send you messages</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${messagingPrivacy === 'anyone' ? 'text-primary' : 'text-foreground-muted'}`}>
                      Anyone
                    </span>
                    <button
                      onClick={() => setMessagingPrivacy(messagingPrivacy === 'anyone' ? 'favorites' : 'anyone')}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        messagingPrivacy === 'anyone' 
                          ? 'bg-primary shadow-glow' 
                          : 'bg-muted'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        messagingPrivacy === 'anyone' 
                          ? 'translate-x-6' 
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                    <span className={`text-sm font-medium ${messagingPrivacy === 'favorites' ? 'text-primary' : 'text-foreground-muted'}`}>
                      Favorites Only
                    </span>
                  </div>
                </div>

                {/* Account Management Section */}
                <div className="glass-effect rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">Account Management</h3>
                  <p className="text-sm text-foreground-secondary mb-4">Options to deactivate or delete your account</p>
                  
                  <div className="space-y-3">
                    <button className="w-full p-3 border border-warning text-warning rounded-xl hover:bg-warning/10 transition-all duration-200 font-medium">
                      Deactivate Account
                    </button>
                    <button className="w-full p-3 border border-destructive text-destructive rounded-xl hover:bg-destructive/10 transition-all duration-200 font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings Modal */}
        {showNotificationSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-md glass-effect rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>
                <button 
                  onClick={() => setShowNotificationSettings(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 glass-effect rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Message Notifications</h3>
                    <p className="text-sm text-foreground-secondary">Toggle push/email alerts when someone sends you a message</p>
                  </div>
                  <button
                    onClick={() => setMessageNotifications(!messageNotifications)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      messageNotifications 
                        ? 'bg-primary shadow-glow' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      messageNotifications 
                        ? 'translate-x-6' 
                        : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 glass-effect rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Favorites & Activity Notifications</h3>
                    <p className="text-sm text-foreground-secondary">Control alerts when someone saves you as a favorite</p>
                  </div>
                  <button
                    onClick={() => setFavoritesNotifications(!favoritesNotifications)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      favoritesNotifications 
                        ? 'bg-primary shadow-glow' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      favoritesNotifications 
                        ? 'translate-x-6' 
                        : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border px-6 py-4 shadow-xl">
          <div className="flex justify-around items-center">
            {[{
            id: 'home' as Tab,
            icon: Home,
            label: 'Home'
          }, {
            id: 'profile' as Tab,
            icon: User,
            label: 'Profile'
          }, {
            id: 'resource' as Tab,
            icon: BookOpen,
            label: 'Resource'
          }, {
            id: 'message' as Tab,
            icon: MessageCircle,
            label: 'Message'
          }, {
            id: 'startups' as Tab,
            icon: Briefcase,
            label: 'Startups'
          }].map(({
            id,
            icon: Icon,
            label
          }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${activeTab === id ? 'text-primary bg-accent button-hover-scale shadow-glass' : 'text-foreground-muted hover:text-foreground hover:bg-muted button-hover-scale'}`}>
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
              </button>)}
          </div>
        </div>

        {/* Compose Message Dialog */}
        <ComposeMessageDialog
          open={showNewMessageDialog}
          onOpenChange={setShowNewMessageDialog}
        />
      </div>
    </div>;
}
export default MobileApp;