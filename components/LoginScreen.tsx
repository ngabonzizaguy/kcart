import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { LanguageSelector } from './LanguageSelector';
import { Phone, ArrowLeft, User, Check, X } from 'lucide-react';

interface LoginScreenProps {
  language: 'en' | 'rw';
  userRole?: 'customer' | 'vendor' | null;
  onLanguageChange?: (language: 'en' | 'rw') => void;
  onBack?: () => void;
  onLogin?: () => void;
  onLoginSuccess?: () => void;
  onGuestLogin?: () => void;
  onContinueAsGuest?: () => void;
}

// Flag icon components using SVG
const FlagIcon = ({ country, className = "w-5 h-4" }: { country: string; className?: string }) => {
  const flags: Record<string, JSX.Element> = {
    'Rwanda': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#00A1DE"/>
        <rect y="8" width="24" height="4" fill="#FAD201"/>
        <rect y="12" width="24" height="4" fill="#007A3D"/>
        <g transform="translate(18, 2)">
          <circle cx="0" cy="0" r="2" fill="#FAD201"/>
          <path d="M-1.5,0 L-0.5,-1 L0,0 L0.5,-1 L1.5,0 L1,-0.5 L1.5,0 L0.5,1 L0,0 L-0.5,1 L-1.5,0 L-1,-0.5 Z" fill="#FAD201"/>
        </g>
      </svg>
    ),
    'US': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#B22234"/>
        <rect y="1" width="24" height="1" fill="#FFFFFF"/>
        <rect y="3" width="24" height="1" fill="#FFFFFF"/>
        <rect y="5" width="24" height="1" fill="#FFFFFF"/>
        <rect y="7" width="24" height="1" fill="#FFFFFF"/>
        <rect y="9" width="24" height="1" fill="#FFFFFF"/>
        <rect y="11" width="24" height="1" fill="#FFFFFF"/>
        <rect y="13" width="24" height="1" fill="#FFFFFF"/>
        <rect width="10" height="8" fill="#3C3B6E"/>
      </svg>
    ),
    'UK': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#012169"/>
        <path d="M0 0l24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1"/>
        <path d="M12 0v16M0 8h24" stroke="#FFFFFF" strokeWidth="3"/>
        <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2"/>
      </svg>
    ),
    'Kenya': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#FFFFFF"/>
        <rect width="24" height="4" fill="#000000"/>
        <rect y="4" width="24" height="2" fill="#FFFFFF"/>
        <rect y="6" width="24" height="4" fill="#CE1126"/>
        <rect y="10" width="24" height="2" fill="#FFFFFF"/>
        <rect y="12" width="24" height="4" fill="#007A3D"/>
        <ellipse cx="12" cy="8" rx="3" ry="2" fill="#FFFFFF"/>
        <ellipse cx="12" cy="8" rx="2" ry="1.3" fill="#000000"/>
      </svg>
    ),
    'Uganda': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#000000"/>
        <rect width="24" height="2.67" fill="#FCDC04"/>
        <rect y="2.67" width="24" height="2.67" fill="#D90000"/>
        <rect y="5.34" width="24" height="2.67" fill="#FCDC04"/>
        <rect y="8" width="24" height="2.67" fill="#D90000"/>
        <rect y="10.67" width="24" height="2.67" fill="#FCDC04"/>
        <rect y="13.34" width="24" height="2.66" fill="#000000"/>
        <circle cx="12" cy="8" r="2.5" fill="#FFFFFF"/>
      </svg>
    ),
    'Tanzania': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#00A1DE"/>
        <path d="M0 16L24 0v4L4 16z" fill="#007A3D"/>
        <path d="M0 16L24 0v2L2 16z" fill="#FCDC04"/>
        <path d="M0 14L22 0H24L0 16z" fill="#000000"/>
      </svg>
    ),
    'South Africa': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#007A3D"/>
        <path d="M0 0v16l8-8L0 0z" fill="#000000"/>
        <path d="M0 2v12l6-6L0 2z" fill="#FCDC04"/>
        <rect x="8" width="16" height="5.33" fill="#DE3831"/>
        <rect x="8" y="5.33" width="16" height="5.34" fill="#FFFFFF"/>
        <rect x="8" y="10.67" width="16" height="5.33" fill="#002395"/>
      </svg>
    ),
    'France': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#ED2939"/>
        <rect width="8" height="16" fill="#002395"/>
        <rect x="8" width="8" height="16" fill="#FFFFFF"/>
      </svg>
    ),
    'Germany': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#FFCE00"/>
        <rect width="24" height="5.33" fill="#000000"/>
        <rect y="5.33" width="24" height="5.34" fill="#DD0000"/>
      </svg>
    ),
    'China': (
      <svg className={className} viewBox="0 0 24 16" fill="none">
        <rect width="24" height="16" rx="2" fill="#DE2910"/>
        <polygon points="4,3 5,5 3,4 5,4 3,5" fill="#FFDE00"/>
        <polygon points="8,2 8.5,3 7.5,2.5 8.5,2.5 7.5,3" fill="#FFDE00"/>
        <polygon points="9,4 9.5,5 8.5,4.5 9.5,4.5 8.5,5" fill="#FFDE00"/>
        <polygon points="9,6 9.5,7 8.5,6.5 9.5,6.5 8.5,7" fill="#FFDE00"/>
        <polygon points="8,8 8.5,9 7.5,8.5 8.5,8.5 7.5,9" fill="#FFDE00"/>
      </svg>
    )
  };
  
  return flags[country] || <div className={className}></div>;
};

const countryCodes = [
  { code: '+250', country: 'Rwanda' },
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+254', country: 'Kenya' },
  { code: '+256', country: 'Uganda' },
  { code: '+255', country: 'Tanzania' },
  { code: '+27', country: 'South Africa' }
];

export function LoginScreen({ 
  language, 
  userRole = null,
  onLanguageChange, 
  onBack, 
  onLogin,
  onLoginSuccess, 
  onGuestLogin,
  onContinueAsGuest 
}: LoginScreenProps) {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!name.trim()) {
      alert(language === 'en' ? 'Please enter your name' : 'Nyamuneka andika izina ryawe');
      return;
    }
    if (phoneNumber.length < 9) {
      alert(language === 'en' ? 'Please enter a valid phone number' : 'Nyamuneka shyiramo numero y\'telefoni nyayo');
      return;
    }
    
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpModal(true);
    }, 2000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      alert(language === 'en' ? 'Please enter all 6 digits' : 'Nyamuneka andika imibare 6 yose');
      return;
    }
    
    setOtpLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setOtpLoading(false);
      setShowOtpModal(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (onLogin) {
        onLogin();
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    // Simulate resend
    alert(language === 'en' ? 'OTP sent successfully!' : 'OTP yoherejwe neza!');
  };

  const content = {
    en: {
      customer: {
        title: 'Welcome Back',
        subtitle: 'Enter your details to continue ordering',
        continueAsGuest: 'Continue as Guest'
      },
      vendor: {
        title: 'Restaurant Login',
        subtitle: 'Enter your details to access your dashboard',
        continueAsGuest: 'Demo Mode'
      },
      default: {
        title: 'Welcome Back',
        subtitle: 'Enter your details to continue',
        continueAsGuest: 'Continue as Guest'
      },
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter your full name',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      countryCode: 'Country',
      sendOtp: 'Send OTP',
      sending: 'Sending...',
      or: 'or',
      secureLogin: '🔒 Secure login with OTP verification',
      otpTitle: 'Enter OTP Code',
      otpSubtitle: 'We sent a 6-digit code to',
      otpPlaceholder: 'Enter code',
      verifyOtp: 'Verify OTP',
      verifying: 'Verifying...',
      resendOtp: 'Resend OTP',
      didntReceive: 'Didn\'t receive the code?',
      changeNumber: 'Change Number'
    },
    rw: {
      customer: {
        title: 'Murakaza Neza',
        subtitle: 'Shyiramo amakuru yawe kugirango ukomeze gutumiza',
        continueAsGuest: 'Komeza Nk\'umukerarugendo'
      },
      vendor: {
        title: 'Kwinjira kwa Resitora',
        subtitle: 'Shyiramo amakuru yawe kugira ngo ubone dashboard yawe',
        continueAsGuest: 'Ubwoko bwo kwiga'
      },
      default: {
        title: 'Murakaza Neza',
        subtitle: 'Shyiramo amakuru yawe kugirango ukomeze',
        continueAsGuest: 'Komeza Nk\'umukerarugendo'
      },
      nameLabel: 'Izina Ryuzuye',
      namePlaceholder: 'Andika izina ryawe ryuzuye',
      phoneLabel: 'Numero ya Telefoni',
      phonePlaceholder: 'Andika numero ya telefoni yawe',
      countryCode: 'Igihugu',
      sendOtp: 'Ohereza OTP',
      sending: 'Irohereza...',
      or: 'cyangwa',
      secureLogin: '🔒 Kwinjira byizewe hamwe no kugenzura OTP',
      otpTitle: 'Andika Kode ya OTP',
      otpSubtitle: 'Twohereje kode y\'imibare 6 kuri',
      otpPlaceholder: 'Andika kode',
      verifyOtp: 'Kugenzura OTP',
      verifying: 'Biragenzuza...',
      resendOtp: 'Ongera Wohereze OTP',
      didntReceive: 'Ntiwabonye kode?',
      changeNumber: 'Hindura Numero'
    }
  };

  // Get role-specific content
  const roleContent = userRole && content[language][userRole] 
    ? content[language][userRole] 
    : content[language].default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-safe mt-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{language === 'en' ? 'Back' : 'Subira'}</span>
          </button>
        ) : (
          <div></div>
        )}
        
        {onLanguageChange ? (
          <LanguageSelector 
            selectedLanguage={language} 
            onLanguageChange={onLanguageChange} 
          />
        ) : (
          <div></div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-safe">
        {/* Logo */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
            <div className="text-4xl font-bold text-orange-500 text-center">
              DeliGo
            </div>
            <div className="text-orange-400 text-center mt-1">
              🍽️
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-sm">
          {/* Glass Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                {roleContent.title}
              </h1>
              <p className="text-gray-600 text-sm">
                {roleContent.subtitle}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 mb-8">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 text-sm font-medium">
                  {content[language].nameLabel}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={content[language].namePlaceholder}
                    className="pl-12 h-12 bg-white/50 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800"
                  />
                </div>
              </div>

              {/* Phone Input with Country Code */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
                  {content[language].phoneLabel}
                </Label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-20 h-12 bg-white/60 backdrop-blur-sm border-2 border-orange-200/40 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 text-gray-800 shadow-sm hover:bg-white/70 hover:border-orange-300/50 transition-all duration-200">
                      <div className="flex items-center gap-1 w-full justify-center">
                        <div className="w-4 h-3 flex-shrink-0">
                          <FlagIcon country={countryCodes.find(c => c.code === countryCode)?.country || 'Rwanda'} className="w-4 h-3" />
                        </div>
                        <span className="text-xs font-medium text-gray-800 leading-none">{countryCode}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-orange-200/40 rounded-2xl max-h-60 shadow-lg w-44">
                      {countryCodes.map((country) => (
                        <SelectItem 
                          key={country.code} 
                          value={country.code} 
                          className={`rounded-xl transition-colors py-3 px-3 relative ${
                            countryCode === country.code 
                              ? 'bg-orange-100/80 text-orange-900' 
                              : 'hover:bg-orange-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-5 h-4 flex-shrink-0">
                              <FlagIcon country={country.country} className="w-5 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 leading-none">
                              {country.code}
                            </span>
                            {countryCode === country.code && (
                              <Check className="w-4 h-4 text-orange-600 ml-auto flex-shrink-0" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Phone Number Input */}
                  <div className="relative flex-1 min-w-0">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder={content[language].phonePlaceholder}
                      className="pl-12 pr-4 h-12 bg-white/60 backdrop-blur-sm border-2 border-orange-200/40 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 text-gray-800 w-full shadow-sm hover:bg-white/70 hover:border-orange-300/50 transition-all duration-200 placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Send OTP Button */}
              <Button
                onClick={handleSendOTP}
                disabled={isLoading || !name.trim() || phoneNumber.length < 9}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
              >
                {isLoading ? content[language].sending : content[language].sendOtp}
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm">{content[language].or}</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Continue as Guest / Demo Mode */}
            <Button
              onClick={onGuestLogin || onContinueAsGuest}
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
            >
              {roleContent.continueAsGuest}
            </Button>

            {/* Security Note */}
            <p className="text-center text-xs text-gray-500 mt-6">
              {content[language].secureLogin}
            </p>
          </div>
        </div>

        {/* Footer Space */}
        <div className="mt-12">
          <p className="text-center text-gray-400 text-sm">
            {language === 'en' ? '© 2025 DeliGo. All rights reserved.' : '© 2025 DeliGo. Uburenganzira bwose'}
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl max-w-sm mx-4">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-orange-500" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {content[language].otpTitle}
            </DialogTitle>
            <p className="text-gray-600 text-sm mt-2">
              {content[language].otpSubtitle}<br />
              <span className="font-medium text-gray-800">{countryCode} {phoneNumber}</span>
            </p>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold bg-white/50 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleOtpSubmit}
              disabled={otpLoading || otp.join('').length !== 6}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {otpLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {content[language].verifying}
                </div>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  {content[language].verifyOtp}
                </>
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                {content[language].didntReceive}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleResendOtp}
                  className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  {content[language].resendOtp}
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="text-gray-500 hover:text-gray-600 font-medium text-sm"
                >
                  {content[language].changeNumber}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}