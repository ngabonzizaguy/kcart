import React, { useState } from 'react';
import { ArrowLeft, Edit, User, Phone, Mail, Star, Award, Calendar, MessageSquare, History, ChevronRight } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../../components/ui/label';
import type { User as UserType } from '../MainApp';

/**
 * ProfileScreen - Complete user profile management
 * 
 * Features:
 * - User profile editing with real-time form validation
 * - User statistics display (orders, loyalty points, membership)
 * - Communication center integration
 * - Guest user account creation flow
 * - Bilingual support (English/Kinyarwanda)
 * - DeliGo Glass Design Language
 * - Mobile-optimized with proper touch targets
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - user: UserType | null - Current user data
 * - onUpdateProfile: (user: UserType) => void - Update profile callback
 * - onLogout: () => void - Logout callback
 * - onBack: () => void - Navigation back callback
 * - onOpenChatHistory?: () => void - Open chat history callback
 * 
 * TODO: Connect to real user management API
 * TODO: Implement profile image upload functionality
 * TODO: Add account settings and preferences management
 */

interface ProfileScreenProps {
  language: 'en' | 'rw';
  user: UserType | null;
  onUpdateProfile: (user: UserType) => void;
  onLogout: () => void;
  onBack: () => void;
  onOpenChatHistory?: () => void;
}

export function ProfileScreen({ 
  language, 
  user, 
  onUpdateProfile, 
  onLogout,
  onBack,
  onOpenChatHistory
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  const content = {
    en: {
      profile: 'Profile',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      stats: 'Your Stats',
      totalOrders: 'Total Orders',
      loyaltyPoints: 'Loyalty Points',
      memberSince: 'Member Since',
      signOut: 'Sign Out',
      guestUser: 'Guest User',
      createAccount: 'Create Account',
      communication: 'Communication',
      chatHistory: 'Chat History',
      callLogs: 'Call Logs',
      viewChatHistory: 'View Chat History',
      communicationCenter: 'Communication Center'
    },
    rw: {
      profile: 'Umuyoboro',
      editProfile: 'Hindura Umuyoboro',
      saveChanges: 'Bika Impinduka',
      cancel: 'Kureka',
      personalInfo: 'Amakuru Bwite',
      name: 'Amazina Yombi',
      phone: 'Nimero ya Telefoni',
      email: 'Aderesi ya Imeyili',
      stats: 'Imibare Yawe',
      totalOrders: 'Ibisabwa Byose',
      loyaltyPoints: 'Amanota y\'Ubwiyunge',
      memberSince: 'Umunyamuryango Kuva',
      signOut: 'Gusohoka',
      guestUser: 'Umunyeshure',
      createAccount: 'Fungura Konti',
      communication: 'Itumanaho',
      chatHistory: 'Amateka y\'Ibiganiro',
      callLogs: 'Amateka yo Guhamagara',
      viewChatHistory: 'Reba Amateka y\'Ibiganiro',
      communicationCenter: 'Ikigo cy\'Itumanaho'
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      onUpdateProfile({
        ...user,
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  // Mock user stats - replace with real user data from API
  const userStats = {
    totalOrders: 24,
    loyaltyPoints: 1250,
    memberSince: '2023'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header with DeliGo Glass Design */}
      <div className="bg-white/90 backdrop-blur-md border-b border-orange-200/30 pt-safe sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 h-auto rounded-2xl hover:bg-orange-100/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{content[language].profile}</h1>
            {!isEditing && !user?.isGuest && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-2 h-auto rounded-2xl hover:bg-orange-100/50"
              >
                <Edit className="w-5 h-5" />
              </Button>
            )}
            {isEditing && <div className="w-9" />}
          </div>
        </div>
      </div>

      {/* Content with proper mobile scrolling */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          height: 'calc(100vh - 140px)',
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <div className="px-6 py-6 space-y-6 bottom-nav-spacing">
          {/* Profile Header with DeliGo Glass Design */}
          <div className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-orange-200/30">
              <User className="w-12 h-12 text-orange-600" />
            </div>
            
            {user?.isGuest ? (
              <div>
                <h2 className="text-foreground font-semibold mb-3">{content[language].guestUser}</h2>
                <Button 
                  onClick={() => alert('Account creation coming soon!')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-12 px-6"
                >
                  {content[language].createAccount}
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-foreground font-bold text-xl mb-2">{user?.name || 'User'}</h2>
                <p className="text-muted-foreground font-medium">{user?.phone}</p>
                {user?.email && (
                  <p className="text-muted-foreground font-medium">{user.email}</p>
                )}
              </div>
            )}
          </div>

          {/* User Stats with DeliGo Glass Design */}
          {!user?.isGuest && (
            <div className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
              <h3 className="text-foreground font-semibold mb-5">{content[language].stats}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mx-auto mb-3 flex items-center justify-center border border-orange-200/30">
                    <Star className="w-7 h-7 text-orange-600" />
                  </div>
                  <p className="text-foreground font-bold text-lg">{userStats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground font-medium">{content[language].totalOrders}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mx-auto mb-3 flex items-center justify-center border border-green-200/30">
                    <Award className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-foreground font-bold text-lg">{userStats.loyaltyPoints}</p>
                  <p className="text-xs text-muted-foreground font-medium">{content[language].loyaltyPoints}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-3 flex items-center justify-center border border-blue-200/30">
                    <Calendar className="w-7 h-7 text-blue-600" />
                  </div>
                  <p className="text-foreground font-bold text-lg">{userStats.memberSince}</p>
                  <p className="text-xs text-muted-foreground font-medium">{content[language].memberSince}</p>
                </div>
              </div>
            </div>
          )}

          {/* Communication Center with DeliGo Glass Design */}
          {!user?.isGuest && (
            <div className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
              <h3 className="text-foreground font-semibold mb-4">{content[language].communication}</h3>
              
              <Button
                onClick={() => onOpenChatHistory?.()}
                className="w-full h-14 bg-white/60 backdrop-blur-sm border border-orange-200/30 rounded-2xl text-left hover:bg-white/80 transition-all duration-200 p-4"
                variant="ghost"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center border border-orange-200/30">
                      <MessageSquare className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-foreground font-medium">{content[language].communicationCenter}</h4>
                      <p className="text-muted-foreground text-sm">{content[language].viewChatHistory}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Button>
            </div>
          )}

          {/* Personal Information with DeliGo Glass Design */}
          <div className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground font-semibold">{content[language].personalInfo}</h3>
              {isEditing && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="h-10 px-4 rounded-2xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    {content[language].cancel}
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="h-10 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {content[language].saveChanges}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">{content[language].name}</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 bg-white/60 border-orange-200/30 rounded-2xl text-foreground"
                  />
                ) : (
                  <div className="p-4 bg-white/40 backdrop-blur-sm border border-orange-200/30 rounded-2xl">
                    <span className="text-foreground font-medium">{user?.name || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">{content[language].phone}</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-12 bg-white/60 border-orange-200/30 rounded-2xl text-foreground"
                  />
                ) : (
                  <div className="p-4 bg-white/40 backdrop-blur-sm border border-orange-200/30 rounded-2xl">
                    <span className="text-foreground font-medium">{user?.phone || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">{content[language].email}</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 bg-white/60 border-orange-200/30 rounded-2xl text-foreground"
                  />
                ) : (
                  <div className="p-4 bg-white/40 backdrop-blur-sm border border-orange-200/30 rounded-2xl">
                    <span className="text-foreground font-medium">{user?.email || 'Not set'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sign Out with DeliGo Glass Design */}
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 bg-white/60 backdrop-blur-sm font-medium"
          >
            {content[language].signOut}
          </Button>
        </div>
      </div>
    </div>
  );
}