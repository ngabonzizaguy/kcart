import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Package, 
  Gift, 
  Settings as SettingsIcon,
  Clock,
  CheckCircle,
  Trash2,
  MoreVertical,
  Star,
  TrendingUp,
  User,
  MapPin,
  CreditCard,
  AlertTriangle,
  Zap,
  Users,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'system' | 'general';
  title: { en: string; rw: string };
  message: { en: string; rw: string };
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface NotificationsScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

// Enhanced notifications with balanced content across all tabs
const mockNotifications: Notification[] = [
  // === ORDER NOTIFICATIONS (18 total - 4 unread, 14 read) ===
  {
    id: '1',
    type: 'order',
    title: { en: 'Order Delivered! 🎉', rw: 'Igicuruzwa Cyatanzwe! 🎉' },
    message: { en: 'Your order #1234 from Heaven Restaurant has been delivered. Rate your experience!', rw: 'Igicuruzwa #1234 kuva muri Heaven Restaurant cyatanzwe. Duhe amanota yawe!' },
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/orders/1234',
    priority: 'high',
    category: 'delivery'
  },
  {
    id: '2',
    type: 'order',
    title: { en: 'Driver is 2 minutes away! 🚗', rw: 'Umushumba ageza mu minota 2! 🚗' },
    message: { en: 'John from Express Delivery is approaching your location. Please be ready to receive your order.', rw: 'John wo muri Express Delivery agendesa aho uba. Nyamuneka witeguye kwakira igicuruzwa cyawe.' },
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/orders/1235',
    priority: 'high',
    category: 'tracking'
  },
  {
    id: '4',
    type: 'order',
    title: { en: 'Order Confirmed & Being Prepared 👨‍🍳', rw: 'Igicuruzwa Cyemejwe kandi Gira Gitegurwa 👨‍🍳' },
    message: { en: 'Chef Marco at Italian Corner is preparing your Margherita Pizza. Estimated cooking time: 18 minutes.', rw: 'Chef Marco wa Italian Corner ara gutegura Pizza yawe ya Margherita. Igihe giteganijwe cyo guteka: iminota 18.' },
    timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/orders/1236',
    priority: 'medium',
    category: 'preparation'
  },
  {
    id: '5',
    type: 'order',
    title: { en: 'Order Ready for Pickup! 📦', rw: 'Igicuruzwa Giteguye Gutorerwa! 📦' },
    message: { en: 'Your order from Kigali Coffee House is ready. Please collect within 15 minutes to ensure freshness.', rw: 'Igicuruzwa cyawe civa muri Kigali Coffee House giteguye. Nyamuneka gitori mu minota 15 kugira cyibahe.' },
    timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/orders/1237',
    priority: 'medium',
    category: 'pickup'
  },
  {
    id: '6',
    type: 'order',
    title: { en: 'Payment Confirmed 💳', rw: 'Kwishyura Byemejwe 💳' },
    message: { en: 'Payment of 12,500 RWF via MTN Mobile Money has been processed successfully for order #1238.', rw: 'Kwishyura kwa 12,500 RWF binyuze kuri MTN Mobile Money byakozwe neza ku gicuruzwa #1238.' },
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/1238',
    priority: 'medium',
    category: 'payment'
  },
  {
    id: '7',
    type: 'order',
    title: { en: 'Driver Assigned - Track Live! 🛵', rw: 'Umushumba Yagenewe - Mukurikirane! 🛵' },
    message: { en: 'Marie is picking up your order from Golden Spoon. Track her location in real-time and get live updates.', rw: 'Marie ara gutorera igicuruzwa cyawe muri Golden Spoon. Mukurikirana aho ali mu gihe nyacyo maze mukabona amakuru.' },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/1239',
    priority: 'medium',
    category: 'tracking'
  },
  {
    id: '8',
    type: 'order',
    title: { en: 'Group Order Update 👥', rw: 'Amakuru y\'Igicuruzwa cy\'Itsinda 👥' },
    message: { en: 'Your office group order for 12 people from Family Feast is being prepared. All items confirmed and payment received.', rw: 'Igicuruzwa cyawe cy\'itsinda cy\'abantu 12 civa muri Family Feast gira gitegurwa. Ibintu byose byemejwe maze kwishyurwa kwakirwa.' },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/1240',
    priority: 'medium',
    category: 'group'
  },
  {
    id: '9',
    type: 'order',
    title: { en: 'Special Dietary Requirements Confirmed 🥗', rw: 'Ibisabwa Byihariye by\'Ibiryo Byemejwe 🥗' },
    message: { en: 'Your gluten-free and dairy-free modifications for order #1241 from Green Garden have been confirmed by the chef.', rw: 'Guhindura kwawe kwa gluten na amata ku gicuruzwa #1241 civa muri Green Garden byemejwe n\'umutetsi.' },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/1241',
    priority: 'medium',
    category: 'dietary'
  },
  {
    id: '10',
    type: 'order',
    title: { en: 'Pre-Order Scheduled ⏰', rw: 'Gutumiza Mbere Guteganijwe ⏰' },
    message: { en: 'Your lunch pre-order for tomorrow at 12:30 PM from Gourmet Kitchen has been scheduled. We\'ll remind you 30 minutes before.', rw: 'Gutumiza mbere kwanjye ku musi ku saa 6:30 muri Gourmet Kitchen byateganijwe. Tuzakwibuka mbere y\'iminota 30.' },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/1242',
    priority: 'low',
    category: 'scheduled'
  },
  {
    id: '11',
    type: 'order',
    title: { en: 'Express Delivery Completed ⚡', rw: 'Gutanga Vuba Byakozwe ⚡' },
    message: { en: 'Your express order from Fast Track Junction was delivered in just 11 minutes! New record for your area.', rw: 'Igicuruzwa cyawe cy\'ubwoba civa muri Fast Track Junction cyatanzwe mu minota 11 gusa! Inyandiko nshya mu gace kanyu.' },
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/1243',
    priority: 'low',
    category: 'express'
  },
  {
    id: '12',
    type: 'order',
    title: { en: 'Refund Processed Successfully 💰', rw: 'Kugarurwa Amafaranga Byakozwe Neza 💰' },
    message: { en: 'Refund of 7,800 RWF for cancelled order #1244 has been credited to your MTN Mobile Money account.', rw: 'Kugarurwa amafaranga 7,800 RWF ku gicuruzwa cyahagaritswe #1244 yashyizwe kuri konti yawe ya MTN Mobile Money.' },
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/1244',
    priority: 'medium',
    category: 'refund'
  },
  {
    id: '13',
    type: 'order',
    title: { en: 'Late Delivery Compensation 🎁', rw: 'Igihembo cy\'Gutanga Butare 🎁' },
    message: { en: 'Sorry for the 15-minute delay! We\'ve added 300 loyalty points and a 20% discount coupon to your account.', rw: 'Imbabazi kubera gutinda iminota 15! Twongeyeho amanota 300 y\'ubwisanzure n\'igitike cy\'igabanuka rya 20% kuri konti yawe.' },
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/rewards',
    priority: 'medium',
    category: 'compensation'
  },
  {
    id: '14',
    type: 'order',
    title: { en: 'Subscription Delivery Tomorrow 🔄', rw: 'Gutanga Kwiyandikisha Ejo 🔄' },
    message: { en: 'Your weekly healthy meal subscription from NutriMax will be delivered tomorrow at 8:00 AM. Manage your subscription anytime.', rw: 'Kwiyandikisha kwawe kw\'ibiryo byiza bya cyumweru civa muri NutriMax bizatangwa ejo ku saa 2:00. Genzura kwiyandikisha kwawe igihe cyose.' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/subscription',
    priority: 'low',
    category: 'subscription'
  },
  {
    id: '15',
    type: 'order',
    title: { en: 'Weekend Special Order Complete 🎂', rw: 'Igicuruzwa Cyihariye cy\'Impera Cyarangiye 🎂' },
    message: { en: 'Your custom birthday cake order from Sweet Dreams Bakery has been completed perfectly. The birthday celebration awaits!', rw: 'Igicuruzwa cyawe cy\'ikeki y\'amavuko civa muri Sweet Dreams Bakery cyakozwe neza. Kwizihiza amavuko kurategereza!' },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/birthday',
    priority: 'high',
    category: 'special'
  },
  {
    id: '16',
    type: 'order',
    title: { en: 'Corporate Catering Success 🏢', rw: 'Gutegura Kw\'Ikigo Byagenze Neza 🏢' },
    message: { en: 'Your corporate catering order for 50 people from Executive Chef was delivered on time. Thank you for choosing DeliGo for your business needs.', rw: 'Igicuruzwa cyawe cy\'ikigo cya bantu 50 civa muri Executive Chef cyatanzwe ku gihe. Urakoze guhitamo DeliGo ku bikenewe n\'ubucuruzi bwawe.' },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/corporate',
    priority: 'medium',
    category: 'corporate'
  },
  {
    id: '17',
    type: 'order',
    title: { en: 'Midnight Snack Delivered 🌙', rw: 'Ibiryo by\'Ijoro Byatanzwe 🌙' },
    message: { en: 'Your late-night order from 24/7 Bites was delivered safely. Our night delivery service ensures you never go hungry.', rw: 'Igicuruzwa cyawe cy\'amanywa civa muri 24/7 Bites cyatanzwe neza. Serivisi yacu yo gutanga nijoro iraguha umwiruka ko utagira inzara.' },
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/orders/late-night',
    priority: 'low',
    category: 'special'
  },
  {
    id: '18',
    type: 'order',
    title: { en: 'Monthly Order Summary 📊', rw: 'Incamake y\'Ibicuruzwa by\'Ukwezi 📊' },
    message: { en: 'This month you ordered 23 times and saved 18,500 RWF with discounts and loyalty rewards. View your detailed monthly report.', rw: 'Uku kwezi watumije inshuro 23 maze ukizera 18,500 RWF n\'igabanuka n\'ibihembo by\'ubwisanzure. Reba raporo yawe y\'ukwezi.' },
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/reports/monthly',
    priority: 'low',
    category: 'summary'
  },

  // === PROMOTIONAL NOTIFICATIONS (8 total - 2 unread, 6 read) ===
  {
    id: '3',
    type: 'promo',
    title: { en: 'Flash Sale: 40% OFF! ⚡', rw: 'Igurisha Ryihuse: 40% Igabanuka! ⚡' },
    message: { en: 'Limited time offer! Get 40% off on orders above 8,000 RWF. Use code FLASH40. Valid for 2 hours only.', rw: 'Igitangaza cy\'igihe gito! Bona 40% igabanuka ku bicuruzwa bigera 8,000 RWF. Koresha code FLASH40. Bikoze mu masaha 2 gusa.' },
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    category: 'promotion'
  },
  {
    id: '19',
    type: 'promo',
    title: { en: 'BOGO Pizza Deal! 🍕', rw: 'Igitangaza cya Pizza! 🍕' },
    message: { en: 'Buy one get one free on all pizzas this weekend! Valid at Italian Corner, Pizza Palace, and Mamma Mia. Order now!', rw: 'Gura imwe ukabona indi ubuntu ku pizza zose uku cyumweru! Bikoze muri Italian Corner, Pizza Palace, na Mamma Mia. Tumiza ubu!' },
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    category: 'promotion'
  },
  {
    id: '20',
    type: 'promo',
    title: { en: 'New Restaurant: Mama\'s Kitchen! 🍽️', rw: 'Ikibanza Gishya: Igikoni cya Mama! 🍽️' },
    message: { en: 'Authentic Rwandan cuisine just joined DeliGo! Try Mama\'s Kitchen with 25% off your first order. Limited time offer.', rw: 'Ibiryo by\'u Rwanda byukuri byinjiye muri DeliGo! Gerageza Igikoni cya Mama hamwe na 25% igabanuka ku gicuruzwa cyawe cya mbere.' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    category: 'new_restaurant'
  },
  {
    id: '21',
    type: 'promo',
    title: { en: 'Weekend Free Delivery! 🚚', rw: 'Gutanga Ubuntu mu Mpera! 🚚' },
    message: { en: 'All weekend orders come with free delivery! No minimum order value required. Valid Saturday & Sunday.', rw: 'Ibicuruzwa byose by\'impera bizana gutanga ubuntu! Nta giciro gito gisabwa. Bikoze kuwa gatandatu na ku cyumweru.' },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    category: 'free_delivery'
  },
  {
    id: '22',
    type: 'promo',
    title: { en: 'Student Discount Available! 🎓', rw: 'Igabanuka ry\'Abanyeshuri Rihari! 🎓' },
    message: { en: 'Show your student ID and get 20% off all orders! Valid Monday-Friday. Perfect for your lunch breaks and study sessions.', rw: 'Erekana indangamuntu yawe y\'umunyeshuri ukabona 20% igabanuka ku bicuruzwa byose! Bikoze kuwa mbere-kuwa gatanu. Byiza ku kiruhuko n\'amasomo.' },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    category: 'discount'
  },
  {
    id: '23',
    type: 'promo',
    title: { en: 'Loyalty Tier Upgraded! 🏆', rw: 'Urwego rw\'Ubwisanzure Rwuzamutse! 🏆' },
    message: { en: 'Congratulations! You\'ve reached Platinum status with 100+ orders. Enjoy free delivery, priority support, and exclusive deals.', rw: 'Turabaramukije! Wageze ku rwego rwa Platinum n\'ibicuruzwa 100+. Ushimire gutanga ubuntu, ubufasha bwihuse, n\'amasezerano yihariye.' },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/loyalty',
    priority: 'high',
    category: 'achievement'
  },
  {
    id: '24',
    type: 'promo',
    title: { en: 'Family Feast Package! 👨‍👩‍👧‍👦', rw: 'Igikoni cy\'Umuryango! 👨‍👩‍👧‍👦' },
    message: { en: 'Order our new Family Feast for 4 people and save 30%! Includes main course, sides, dessert, and drinks. Perfect for family dinners.', rw: 'Tumiza Igikoni cyacu gishya cy\'abantu 4 ukize 30%! Kirimo ibiryo bikuru, ibinyangire, ibinyobwa, n\'amata. Byiza ku bifunguro by\'umuryango.' },
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    category: 'family_deal'
  },
  {
    id: '25',
    type: 'promo',
    title: { en: 'Happy Hour Drinks! 🍹', rw: 'Ibinyobwa by\'Igihe cy\'Urukundo! 🍹' },
    message: { en: 'Get 50% off all beverages from 3-6 PM daily! Fresh juices, smoothies, and specialty drinks. Stay hydrated and save money!', rw: 'Bona 50% igabanuka ku binyobwa byose kuva saa 9-12 buri munsi! Amaki mashya, smoothies, n\'ibinyobwa byihariye. Nywa amazi maze ukize amafaranga!' },
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    category: 'happy_hour'
  },

  // === SYSTEM NOTIFICATIONS (6 total - 1 unread, 5 read) ===
  {
    id: '26',
    type: 'system',
    title: { en: 'App Update Available! 📲', rw: 'Vugurura rya Porogaramu Rihari! 📲' },
    message: { en: 'DeliGo v2.4 is ready! New features include voice ordering, AI recommendations, and improved performance. Update now!', rw: 'DeliGo v2.4 yiteguye! Ibiranga bishya birimo gutumiza mu majwi, ibyifuzo bya AI, n\'imikorere myiza. Vugurura ubu!' },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/app-update',
    priority: 'medium',
    category: 'update'
  },
  {
    id: '27',
    type: 'system',
    title: { en: 'New AI Features Available! 🤖', rw: 'Ibiranga Bishya bya AI Bihari! 🤖' },
    message: { en: 'Discover our new AI-powered food recommendations, voice ordering, and smart nutrition tracking. Explore AI features now!', rw: 'Shakisha ibyifuzo byacu bishya bya AI ku biryo, gutumiza mu majwi, n\'gukurikirana intungamubiri. Shakisha ibiranga bya AI ubu!' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/ai-features',
    priority: 'medium',
    category: 'ai_features'
  },
  {
    id: '28',
    type: 'system',
    title: { en: 'Privacy Policy Updated 🔒', rw: 'Politiki y\'Ibanga Yavuguruwe 🔒' },
    message: { en: 'We\'ve updated our privacy policy to better protect your data. Review the changes and learn how we keep your information safe.', rw: 'Twavuguruye politiki yacu y\'ibanga kugira twirinde neza amakuru yanyu. Suzuma impinduka maze wige uburyo durinzira amakuru yanyu.' },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/privacy-policy',
    priority: 'low',
    category: 'privacy'
  },
  {
    id: '29',
    type: 'system',
    title: { en: 'Scheduled Maintenance Tonight 🔧', rw: 'Gusana Guteganyirijwe Uyu Mugoroba 🔧' },
    message: { en: 'DeliGo will undergo maintenance tonight 2:00-3:30 AM for performance improvements. Service will be briefly unavailable.', rw: 'DeliGo izakora isanwa uyu mugoroba kuva saa 8:00-9:30 z\'ijoro kugira ngo tuzamure imikorere. Serivisi izaba idhari gake.' },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    category: 'maintenance'
  },
  {
    id: '30',
    type: 'system',
    title: { en: 'Security Enhancement 🛡️', rw: 'Gutezimbere Umutekano 🛡️' },
    message: { en: 'We\'ve added two-factor authentication for enhanced account security. Enable 2FA in your profile settings for extra protection.', rw: 'Twongeyeho kwemeza habiri kugira twongere umutekano wa konti yanyu. Emera 2FA mu magenamiterere yawe kugira wiyongere kurinda.' },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: '/security-settings',
    priority: 'medium',
    category: 'security'
  },
  {
    id: '31',
    type: 'system',
    title: { en: 'Performance Improvements 🚀', rw: 'Gutezimbere Imikorere 🚀' },
    message: { en: 'We\'ve optimized the app for faster loading and smoother experience. Orders load 50% faster and search is more responsive!', rw: 'Twateye imbere porogaramu kugira ipakire vuba kandi ikore neza. Ibicuruzwa bipakira 50% vuba kandi gushakisha birakora neza!' },
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    category: 'performance'
  }
];

export function NotificationsScreen({ language, onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  // Content translations
  const content = {
    en: {
      title: 'Notifications',
      subtitle: 'Stay updated with your orders',
      markAllRead: 'Mark all as read',
      clearAll: 'Clear all',
      tabs: {
        all: 'All',
        orders: 'Orders',
        promos: 'Promos',
        system: 'System'
      },
      empty: {
        all: 'All caught up!',
        orders: 'No order updates',
        promos: 'No current offers',
        system: 'No system alerts'
      },
      emptyDescription: {
        all: 'You\'re up to date with all notifications',
        orders: 'Order updates will appear here',
        promos: 'Special offers and deals will appear here',
        system: 'App updates and alerts will appear here'
      },
      timeAgo: {
        now: 'Now',
        minute: 'min ago',
        minutes: 'mins ago',
        hour: 'hr ago',
        hours: 'hrs ago',
        day: 'day ago',
        days: 'days ago'
      },
      actions: {
        markAsRead: 'Mark as read',
        delete: 'Delete',
        viewOrder: 'View Order',
        useOffer: 'Use Offer'
      }
    },
    rw: {
      title: 'Ubutumwa',
      subtitle: 'Komeza ukurikirana ibicuruzwa byawe',
      markAllRead: 'Menya byose nk\'ubyasomye',
      clearAll: 'Siba byose',
      tabs: {
        all: 'Byose',
        orders: 'Ibisabwa',
        promos: 'Ibitangaza',
        system: 'Sisitemu'
      },
      empty: {
        all: 'Byose byasomwe!',
        orders: 'Nta makuru y\'ibisabwa',
        promos: 'Nta bitangaza bihari',
        system: 'Nta bubiko bwa sisitemu'
      },
      emptyDescription: {
        all: 'Wari uziko ubutumwa bwose',
        orders: 'Amakuru y\'ibisabwa azagaragara hano',
        promos: 'Ibitangaza n\'amahirwe azagaragara hano',
        system: 'Ivugurura n\'imbiko za sisitemu bizagaragara hano'
      },
      timeAgo: {
        now: 'Ubu',
        minute: 'umunota ushize',
        minutes: 'iminota ishize',
        hour: 'isaha ishize',
        hours: 'amasaha ashize',
        day: 'umunsi ushize',
        days: 'iminsi ishize'
      },
      actions: {
        markAsRead: 'Menya nk\'ubyasomye',
        delete: 'Siba',
        viewOrder: 'Reba Igicuruzwa',
        useOffer: 'Koresha Igitangaza'
      }
    }
  };

  // Get notification icon and color based on type and category
  const getNotificationIcon = (notification: Notification) => {
    const { type, category } = notification;
    
    if (type === 'order') {
      switch (category) {
        case 'delivery': return CheckCircle;
        case 'tracking': return MapPin;
        case 'preparation': return Clock;
        case 'pickup': return Package;
        case 'payment': return CreditCard;
        case 'express': return Zap;
        case 'group': return Users;
        case 'scheduled': return Calendar;
        case 'subscription': return RefreshCw;
        case 'special': return Star;
        default: return Package;
      }
    }
    
    if (type === 'promo') {
      switch (category) {
        case 'achievement': return Star;
        case 'new_restaurant': return TrendingUp;
        default: return Gift;
      }
    }
    
    if (type === 'system') {
      return SettingsIcon;
    }
    
    return Bell;
  };

  const getNotificationColor = (notification: Notification) => {
    const { type, priority } = notification;
    
    if (priority === 'high') {
      return 'text-orange-600 bg-orange-500/15 border-orange-500/20';
    }
    
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-500/15 border-blue-500/20';
      case 'promo': return 'text-green-600 bg-green-500/15 border-green-500/20';
      case 'system': return 'text-purple-600 bg-purple-500/15 border-purple-500/20';
      default: return 'text-gray-600 bg-gray-500/15 border-gray-500/20';
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMs = now.getTime() - notificationTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return content[language].timeAgo.now;
    if (diffInMinutes === 1) return `1 ${content[language].timeAgo.minute}`;
    if (diffInMinutes < 60) return `${diffInMinutes} ${content[language].timeAgo.minutes}`;
    if (diffInHours === 1) return `1 ${content[language].timeAgo.hour}`;
    if (diffInHours < 24) return `${diffInHours} ${content[language].timeAgo.hours}`;
    if (diffInDays === 1) return `1 ${content[language].timeAgo.day}`;
    return `${diffInDays} ${content[language].timeAgo.days}`;
  };

  // Filter notifications by tab
  const getFilteredNotifications = (tab: string) => {
    if (tab === 'all') return notifications;
    return notifications.filter(n => n.type === tab);
  };

  // Get unread count for tab
  const getUnreadCount = (tab: string) => {
    const filtered = getFilteredNotifications(tab);
    return filtered.filter(n => !n.isRead).length;
  };

  // Actions
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    const filteredNotifications = getFilteredNotifications(activeTab);
    setNotifications(prev => prev.map(n => 
      filteredNotifications.some(fn => fn.id === n.id) ? { ...n, isRead: true } : n
    ));
  };

  const clearAllNotifications = () => {
    const filteredNotifications = getFilteredNotifications(activeTab);
    const idsToDelete = filteredNotifications.map(n => n.id);
    setNotifications(prev => prev.filter(n => !idsToDelete.includes(n.id)));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  // Empty state component
  const EmptyState = ({ tab }: { tab: string }) => {
    const getEmptyIcon = (tab: string) => {
      switch (tab) {
        case 'orders': return Package;
        case 'promos': return Gift;
        case 'system': return SettingsIcon;
        default: return CheckCircle;
      }
    };
    
    const IconComponent = getEmptyIcon(tab);
    
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <IconComponent className="w-12 h-12 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {content[language].empty[tab as keyof typeof content[typeof language]['empty']]}
        </h3>
        <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
          {content[language].emptyDescription[tab as keyof typeof content[typeof language]['emptyDescription']]}
        </p>
      </div>
    );
  };

  const filteredNotifications = getFilteredNotifications(activeTab);
  const totalUnread = getUnreadCount('all');

  return (
    <div 
      className="w-full h-screen flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100"
      style={{ 
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Enhanced Header with Glass Effect */}
      <div className="bg-white/90 backdrop-blur-md border-b border-orange-200/30 flex-shrink-0 pt-safe shadow-sm">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 h-auto rounded-2xl hover:bg-orange-100/50 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Button>
              
              <div>
                <h1 className="text-foreground text-2xl font-bold">
                  {content[language].title}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {totalUnread > 0 
                    ? `${totalUnread} ${language === 'en' ? 'unread' : 'ntisomwa'}`
                    : content[language].subtitle
                  }
                </p>
              </div>
            </div>

            {/* Actions Dropdown */}
            {notifications.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 h-auto hover:bg-orange-100/50 rounded-2xl transition-all duration-200"
                  >
                    <MoreVertical className="w-5 h-5 text-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md border-orange-200/30">
                  <DropdownMenuItem 
                    onClick={markAllAsRead}
                    className="hover:bg-orange-50/50 text-foreground font-medium"
                  >
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    {content[language].markAllRead}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={clearAllNotifications} 
                    className="hover:bg-red-50/50 text-destructive font-medium"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    {content[language].clearAll}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Custom Tab Bar with Bottom Line Only Design */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200/20 flex-shrink-0 px-6 py-4">
        <div className="flex items-center gap-0 bg-orange-50/40 backdrop-blur-sm rounded-2xl p-2 border border-orange-200/20">
          {Object.entries(content[language].tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === key
                  ? 'text-orange-600'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/20'
              }`}
            >
              <span className="relative z-10">{label}</span>
              {getUnreadCount(key) > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center z-20 bg-orange-500 border-white text-white font-semibold"
                >
                  {getUnreadCount(key)}
                </Badge>
              )}
              
              {/* Bottom Line Indicator for Active Tab Only */}
              {activeTab === key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content Area - GUARANTEED TO WORK */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          height: 'auto',
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <div 
          className="px-6 py-6 space-y-4"
          style={{ 
            paddingBottom: '150px' // Fixed bottom padding for any context
          }}
        >
          {filteredNotifications.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification);
                const iconColorClass = getNotificationColor(notification);
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white/85 backdrop-blur-sm border rounded-3xl p-6 transition-all duration-300 hover:bg-white/95 hover:shadow-lg cursor-pointer group ${
                      !notification.isRead 
                        ? 'border-orange-300/40 shadow-md ring-1 ring-orange-500/10' 
                        : 'border-white/40 shadow-sm'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Enhanced Icon with Priority Indicator */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${iconColorClass} transition-all duration-300 group-hover:scale-105`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        {notification.priority === 'high' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                            <AlertTriangle className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {!notification.isRead && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`text-base font-semibold leading-tight ${
                            !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title[language]}
                          </h4>
                          
                          <div className="flex items-center gap-2 ml-3">
                            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="p-1.5 h-auto hover:bg-accent/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md">
                                {!notification.isRead && (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}>
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    {content[language].actions.markAsRead}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {content[language].actions.delete}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                          {notification.message[language]}
                        </p>
                        
                        {/* Action Button */}
                        {notification.actionUrl && (
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                              className="h-9 px-4 text-xs font-semibold bg-white/60 hover:bg-orange-500 hover:text-white border-orange-300/40 hover:border-orange-500 rounded-xl transition-all duration-200"
                            >
                              {notification.type === 'order' 
                                ? content[language].actions.viewOrder 
                                : content[language].actions.useOffer}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}