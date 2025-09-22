import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Star, 
  Save, 
  Eye, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  Globe,
  CreditCard,
  Shield,
  Edit3,
  Upload
} from 'lucide-react';

/**
 * VendorProfileManager - Complete Business Profile Setup & Management
 * 
 * Features:
 * - Comprehensive business information form
 * - Operating hours management
 * - Location and contact details
 * - Business verification status
 * - Real-time customer preview
 * - Image upload for restaurant photos
 * - Integration with shared data architecture
 * 
 * Design: DeliGo Glass Design Language
 * - Warm glassmorphism with cream/orange palette
 * - Mobile-first with 44px touch targets
 * - Bilingual support (English/Kinyarwanda)
 * 
 * Real-time Integration: Uses onUpdateRestaurant to sync with customer app
 */

// Days of the week for operating hours
const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Business categories for restaurants
const BUSINESS_CATEGORIES = [
  'Fast Food', 'Fine Dining', 'Casual Dining', 'Cafe', 'Bakery', 
  'Street Food', 'Local Cuisine', 'International', 'Vegetarian', 'Organic'
];

// Mock data for vendor profile - TODO: Replace with real API data
const mockVendorProfile = {
  businessName: { en: 'Golden Spoon Restaurant', rw: 'Resitora ya Golden Spoon' },
  description: { 
    en: 'Authentic local cuisine with international flavors, serving the finest dishes in Kigali since 2020.',
    rw: 'Ibiryo by\'igihugu hamwe n\'ubunyangamugayo bw\'amahanga, dutanga ibiryo byiza cyane i Kigali kuva 2020.'
  },
  ownerName: 'Jean Baptiste Uwimana',
  phone: '+250 788 123 456',
  email: 'contact@goldenspoon.rw',
  businessLicense: 'RDB-2020-001234',
  category: 'Local Cuisine',
  location: {
    address: 'KN 5 Rd, Kacyiru, Kigali',
    lat: -1.9506,
    lng: 30.0588,
    district: 'Gasabo',
    sector: 'Kacyiru'
  },
  operatingHours: {
    Monday: { open: '08:00', close: '22:00', isOpen: true },
    Tuesday: { open: '08:00', close: '22:00', isOpen: true },
    Wednesday: { open: '08:00', close: '22:00', isOpen: true },
    Thursday: { open: '08:00', close: '22:00', isOpen: true },
    Friday: { open: '08:00', close: '23:00', isOpen: true },
    Saturday: { open: '08:00', close: '23:00', isOpen: true },
    Sunday: { open: '09:00', close: '21:00', isOpen: true }
  },
  images: {
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
    ]
  },
  verificationStatus: 'verified', // verified, pending, incomplete
  rating: 4.8,
  totalReviews: 247,
  joinedDate: '2020-03-15'
};

interface VendorProfileManagerProps {
  language: 'en' | 'rw';
  // Integration with shared data architecture
  restaurantData?: any;
  onUpdateRestaurant?: (id: string, updates: any) => Promise<void>;
}

export function VendorProfileManager({ 
  language, 
  restaurantData,
  onUpdateRestaurant 
}: VendorProfileManagerProps) {
  const [profileData, setProfileData] = useState(mockVendorProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Content localization
  const content = {
    en: {
      title: 'Business Profile',
      subtitle: 'Manage your restaurant information',
      tabs: {
        basic: 'Basic Info',
        hours: 'Operating Hours',
        location: 'Location & Contact', 
        images: 'Photos',
        preview: 'Customer View'
      },
      basic: {
        businessName: 'Business Name',
        businessNamePlaceholder: 'Enter your restaurant name',
        description: 'Business Description',
        descriptionPlaceholder: 'Describe your restaurant and cuisine...',
        ownerName: 'Owner/Manager Name',
        ownerNamePlaceholder: 'Enter owner name',
        category: 'Business Category',
        selectCategory: 'Select category',
        businessLicense: 'Business License Number',
        licensePlaceholder: 'RDB-YYYY-XXXXXX'
      },
      hours: {
        title: 'Operating Hours',
        subtitle: 'Set when your restaurant is open for orders',
        day: 'Day',
        openTime: 'Open Time',
        closeTime: 'Close Time',
        isOpen: 'Open',
        closed: 'Closed',
        allDay: '24 Hours',
        copyToAll: 'Copy to All Days'
      },
      contact: {
        title: 'Contact Information',
        phone: 'Phone Number',
        phonePlaceholder: '+250 XXX XXX XXX',
        email: 'Email Address',
        emailPlaceholder: 'contact@restaurant.rw',
        address: 'Full Address',
        addressPlaceholder: 'Street, District, Kigali',
        district: 'District',
        sector: 'Sector'
      },
      images: {
        title: 'Restaurant Photos',
        subtitle: 'Upload photos to showcase your restaurant',
        logo: 'Restaurant Logo',
        cover: 'Cover Photo',
        gallery: 'Gallery Photos',
        upload: 'Upload Photo',
        replace: 'Replace Photo',
        maxSize: 'Max 5MB per image'
      },
      preview: {
        title: 'Customer View',
        subtitle: 'How your restaurant appears to customers',
        viewOnApp: 'This is how customers see your restaurant',
        rating: 'Rating',
        reviews: 'reviews',
        openNow: 'Open Now',
        closedNow: 'Closed Now',
        opensAt: 'Opens at',
        closesAt: 'Closes at'
      },
      verification: {
        verified: 'Verified Business',
        pending: 'Verification Pending',
        incomplete: 'Profile Incomplete',
        verifiedDesc: 'Your business is verified and visible to customers',
        pendingDesc: 'Your verification is being reviewed',
        incompleteDesc: 'Complete your profile to get verified'
      },
      actions: {
        edit: 'Edit Profile',
        save: 'Save Changes',
        cancel: 'Cancel',
        saving: 'Saving...',
        saved: 'Profile updated successfully!',
        error: 'Failed to update profile'
      }
    },
    rw: {
      title: 'Ibikubiye ku Bucuruzi',
      subtitle: 'Gucunga amakuru ya resitora yawe',
      tabs: {
        basic: 'Amakuru y\'Ibanze',
        hours: 'Amasaha yo Gukora',
        location: 'Aho Iherereye & Kuvugana',
        images: 'Amafoto',
        preview: 'Ukuntu Abakiriya Babona'
      },
      basic: {
        businessName: 'Izina ry\'Ubucuruzi',
        businessNamePlaceholder: 'Andika izina rya resitora yawe',
        description: 'Ibisobanuro by\'Ubucuruzi',
        descriptionPlaceholder: 'Sobanura resitora yawe n\'ibiryo...',
        ownerName: 'Izina ry\'Umutware/Umuyobozi',
        ownerNamePlaceholder: 'Andika izina ry\'umutware',
        category: 'Ubwoko bw\'Ubucuruzi',
        selectCategory: 'Hitamo ubwoko',
        businessLicense: 'Numero y\'Uruhushya rw\'Ubucuruzi',
        licensePlaceholder: 'RDB-YYYY-XXXXXX'
      },
      hours: {
        title: 'Amasaha yo Gukora',
        subtitle: 'Shyiraho igihe resitora yawe ifungura amatungo',
        day: 'Umunsi',
        openTime: 'Igihe yo Gufungura',
        closeTime: 'Igihe yo Gufunga',
        isOpen: 'Ifunguye',
        closed: 'Ifunzwe',
        allDay: 'Amasaha 24',
        copyToAll: 'Kwigana ku Minsi Yose'
      },
      contact: {
        title: 'Amakuru yo Kuvugana',
        phone: 'Numero ya Terefone',
        phonePlaceholder: '+250 XXX XXX XXX',
        email: 'Aderesi ya Email',
        emailPlaceholder: 'kuvugana@resitora.rw',
        address: 'Aderesi Yuzuye',
        addressPlaceholder: 'Umuhanda, Akarere, Kigali',
        district: 'Akarere',
        sector: 'Umurenge'
      },
      images: {
        title: 'Amafoto ya Resitora',
        subtitle: 'Ohereza amafoto yo kwerekana resitora yawe',
        logo: 'Ikimenyetso cya Resitora',
        cover: 'Ifoto Nkuru',
        gallery: 'Amafoto y\'Imyumburiryo',
        upload: 'Ohereza Ifoto',
        replace: 'Gusimbura Ifoto',
        maxSize: 'Ntarengwa 5MB kuri buri foto'
      },
      preview: {
        title: 'Ukuntu Abakiriya Babona',
        subtitle: 'Ukuntu resitora yawe igaragara ku bakiriya',
        viewOnApp: 'Uku ni ukuntu abakiriya babona resitora yawe',
        rating: 'Amanota',
        reviews: 'icyo bavuga',
        openNow: 'Ifunguye Ubu',
        closedNow: 'Ifunzwe Ubu',
        opensAt: 'Izafungura saa',
        closesAt: 'Izafunga saa'
      },
      verification: {
        verified: 'Ubucuruzi Bwemejwe',
        pending: 'Kwemeza Birindiriye',
        incomplete: 'Profil Itarangiye',
        verifiedDesc: 'Ubucuruzi bwawe bwemejwe kandi bugaragara ku bakiriya',
        pendingDesc: 'Kwemeza kwawe gusuzumwa',
        incompleteDesc: 'Rangiza profil yawe kugira ngo wemezwe'
      },
      actions: {
        edit: 'Hindura Profil',
        save: 'Bika Impinduka',
        cancel: 'Bireke',
        saving: 'Bibika...',
        saved: 'Profil yahinduwe neza!',
        error: 'Kuraguza profil byanze'
      }
    }
  };

  // Initialize with restaurant data if available
  useEffect(() => {
    if (restaurantData) {
      setProfileData(prev => ({
        ...prev,
        businessName: restaurantData.name || prev.businessName,
        description: restaurantData.description || prev.description,
        location: {
          ...prev.location,
          ...restaurantData.location
        },
        operatingHours: restaurantData.operatingHours || prev.operatingHours,
        images: {
          ...prev.images,
          ...restaurantData.images
        }
      }));
    }
  }, [restaurantData]);

  const handleSave = async () => {
    if (!onUpdateRestaurant) {
      toast.success(content[language].actions.saved);
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      // TODO: Replace with real restaurant ID
      const restaurantId = restaurantData?.id || 'rest-001';
      
      // Update shared data through App.tsx handler
      await onUpdateRestaurant(restaurantId, {
        name: profileData.businessName,
        description: profileData.description,
        location: profileData.location,
        operatingHours: profileData.operatingHours,
        images: profileData.images,
        category: profileData.category,
        phone: profileData.phone,
        email: profileData.email
      });

      toast.success(content[language].actions.saved);
      setIsEditing(false);
      
      console.log('✅ Profile updated - Changes will sync to customer app immediately');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(content[language].actions.error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const getVerificationBadge = () => {
    const { verification } = content[language];
    switch (profileData.verificationStatus) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {verification.verified}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            {verification.pending}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {verification.incomplete}
          </Badge>
        );
    }
  };

  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = DAYS_OF_WEEK[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for Monday start
    const currentTime = now.toTimeString().slice(0, 5);
    const hours = profileData.operatingHours[currentDay];
    
    if (!hours?.isOpen) return { isOpen: false, message: content[language].preview.closedNow };
    
    const isCurrentlyOpen = currentTime >= hours.open && currentTime <= hours.close;
    
    return {
      isOpen: isCurrentlyOpen,
      message: isCurrentlyOpen 
        ? `${content[language].preview.openNow} • ${content[language].preview.closesAt} ${hours.close}`
        : `${content[language].preview.closedNow} • ${content[language].preview.opensAt} ${hours.open}`
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6 pb-safe">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-medium text-gray-800 mb-1">{content[language].title}</h1>
            <p className="text-sm text-gray-600">{content[language].subtitle}</p>
          </div>
          {getVerificationBadge()}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{profileData.rating}</span>
              <span className="text-gray-500">({profileData.totalReviews} {content[language].preview.reviews})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{profileData.category}</span>
            </div>
          </div>

          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-10 px-4"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {content[language].actions.edit}
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10 px-4"
              >
                {content[language].actions.cancel}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-10 px-4"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? content[language].actions.saving : content[language].actions.save}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-2 border border-white/20">
          <TabsList className="grid w-full grid-cols-5 bg-transparent gap-1">
            <TabsTrigger 
              value="basic" 
              className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
            >
              {content[language].tabs.basic}
            </TabsTrigger>
            <TabsTrigger 
              value="hours" 
              className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
            >
              {content[language].tabs.hours}
            </TabsTrigger>
            <TabsTrigger 
              value="location" 
              className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
            >
              {content[language].tabs.location}
            </TabsTrigger>
            <TabsTrigger 
              value="images" 
              className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
            >
              {content[language].tabs.images}
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
            >
              {content[language].tabs.preview}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
            <CardContent className="p-6 space-y-6">
              {/* Business Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].basic.businessName} (English)
                  </label>
                  <Input
                    value={profileData.businessName.en}
                    onChange={(e) => handleInputChange('businessName.en', e.target.value)}
                    placeholder={content[language].basic.businessNamePlaceholder}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].basic.businessName} (Kinyarwanda)
                  </label>
                  <Input
                    value={profileData.businessName.rw}
                    onChange={(e) => handleInputChange('businessName.rw', e.target.value)}
                    placeholder={content[language].basic.businessNamePlaceholder}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 h-12"
                  />
                </div>
              </div>

              {/* Business Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].basic.description} (English)
                  </label>
                  <Textarea
                    value={profileData.description.en}
                    onChange={(e) => handleInputChange('description.en', e.target.value)}
                    placeholder={content[language].basic.descriptionPlaceholder}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].basic.description} (Kinyarwanda)
                  </label>
                  <Textarea
                    value={profileData.description.rw}
                    onChange={(e) => handleInputChange('description.rw', e.target.value)}
                    placeholder={content[language].basic.descriptionPlaceholder}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 min-h-[100px]"
                  />
                </div>
              </div>

              {/* Owner and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].basic.ownerName}
                  </label>
                  <Input
                    value={profileData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder={content[language].basic.ownerNamePlaceholder}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].basic.category}
                  </label>
                  <Select 
                    value={profileData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 h-12">
                      <SelectValue placeholder={content[language].basic.selectCategory} />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Business License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content[language].basic.businessLicense}
                </label>
                <Input
                  value={profileData.businessLicense}
                  onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                  placeholder={content[language].basic.licensePlaceholder}
                  disabled={!isEditing}
                  className="rounded-xl border-gray-200 h-12"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operating Hours Tab */}
        <TabsContent value="hours" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{content[language].hours.title}</h3>
                <p className="text-sm text-gray-600">{content[language].hours.subtitle}</p>
              </div>

              <div className="space-y-4">
                {DAYS_OF_WEEK.map(day => {
                  const hours = profileData.operatingHours[day];
                  return (
                    <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-2xl">
                      <div className="w-20 text-sm font-medium text-gray-700">
                        {day.slice(0, 3)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={hours.isOpen}
                          onChange={(e) => handleInputChange(`operatingHours.${day}.isOpen`, e.target.checked)}
                          disabled={!isEditing}
                          className="w-4 h-4 text-orange-500 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          {hours.isOpen ? content[language].hours.isOpen : content[language].hours.closed}
                        </span>
                      </div>

                      {hours.isOpen && (
                        <>
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleInputChange(`operatingHours.${day}.open`, e.target.value)}
                            disabled={!isEditing}
                            className="w-32 rounded-lg border-gray-200 h-10"
                          />
                          <span className="text-gray-400">to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleInputChange(`operatingHours.${day}.close`, e.target.value)}
                            disabled={!isEditing}
                            className="w-32 rounded-lg border-gray-200 h-10"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location & Contact Tab */}
        <TabsContent value="location" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">{content[language].contact.title}</h3>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {content[language].contact.phone}
                  </label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={content[language].contact.phonePlaceholder}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    {content[language].contact.email}
                  </label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={content[language].contact.emailPlaceholder}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 h-12"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {content[language].contact.address}
                </label>
                <Input
                  value={profileData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  placeholder={content[language].contact.addressPlaceholder}
                  disabled={!isEditing}
                  className="rounded-xl border-gray-200 h-12"
                />
              </div>

              {/* District and Sector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].contact.district}
                  </label>
                  <Input
                    value={profileData.location.district}
                    onChange={(e) => handleInputChange('location.district', e.target.value)}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content[language].contact.sector}
                  </label>
                  <Input
                    value={profileData.location.sector}
                    onChange={(e) => handleInputChange('location.sector', e.target.value)}
                    disabled={!isEditing}
                    className="rounded-xl border-gray-200 h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{content[language].images.title}</h3>
                <p className="text-sm text-gray-600">{content[language].images.subtitle}</p>
                <p className="text-xs text-gray-500 mt-1">{content[language].images.maxSize}</p>
              </div>

              <div className="space-y-6">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {content[language].images.logo}
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                      {profileData.images.logo ? (
                        <ImageWithFallback 
                          src={profileData.images.logo}
                          alt="Restaurant Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <Button 
                        variant="outline"
                        className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {profileData.images.logo ? content[language].images.replace : content[language].images.upload}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Cover Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {content[language].images.cover}
                  </label>
                  <div className="space-y-3">
                    <div className="w-full h-40 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                      {profileData.images.cover ? (
                        <ImageWithFallback 
                          src={profileData.images.cover}
                          alt="Restaurant Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <Button 
                        variant="outline"
                        className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {profileData.images.cover ? content[language].images.replace : content[language].images.upload}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {content[language].images.gallery}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profileData.images.gallery.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                        <ImageWithFallback 
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {isEditing && (
                      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">{content[language].images.upload}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{content[language].preview.title}</h3>
                <p className="text-sm text-gray-600">{content[language].preview.subtitle}</p>
              </div>

              {/* Customer View Preview */}
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 rounded-2xl p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  {/* Restaurant Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                      {profileData.images.logo && (
                        <ImageWithFallback 
                          src={profileData.images.logo}
                          alt="Restaurant"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">
                        {profileData.businessName[language]}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {profileData.description[language].slice(0, 80)}...
                      </p>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{profileData.rating}</span>
                          <span className="text-gray-500">({profileData.totalReviews})</span>
                        </div>
                        <Badge className="bg-gray-100 text-gray-600 text-xs">
                          {profileData.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Status and Hours */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getCurrentStatus().isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={getCurrentStatus().isOpen ? 'text-green-600' : 'text-red-600'}>
                          {getCurrentStatus().message}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{profileData.location.district}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50/50 rounded-xl">
                  <p className="text-sm text-blue-700 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {content[language].preview.viewOnApp}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}