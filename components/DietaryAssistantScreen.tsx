import React, { useState } from 'react';
import { ArrowLeft, Heart, Shield, AlertTriangle, CheckCircle, Plus, X, Search, Utensils, Activity, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { motion, AnimatePresence } from 'motion/react';

interface DietaryAssistantScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface DietaryRestriction {
  id: string;
  name: { en: string; rw: string };
  description: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  severity: 'high' | 'medium' | 'low';
  enabled: boolean;
}

interface NutritionGoal {
  id: string;
  name: { en: string; rw: string };
  target: number;
  current: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}

interface FoodRecommendation {
  id: string;
  name: { en: string; rw: string };
  restaurant: { en: string; rw: string };
  price: number;
  rating: number;
  matchScore: number;
  benefits: Array<{ en: string; rw: string }>;
  warnings: Array<{ en: string; rw: string }>;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  allergens: Array<{ en: string; rw: string }>;
}

export function DietaryAssistantScreen({ language, onBack }: DietaryAssistantScreenProps) {
  const [activeTab, setActiveTab] = useState<'restrictions' | 'goals' | 'recommendations'>('restrictions');
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([
    {
      id: 'gluten-free',
      name: { en: 'Gluten-Free', rw: 'Nta Gluten' },
      description: { en: 'Avoid wheat, barley, rye and other gluten-containing foods', rw: 'Kwirinda ingano, ubusagara, n\'ibindi biryo birimo gluten' },
      icon: Shield,
      severity: 'high',
      enabled: false
    },
    {
      id: 'vegetarian',
      name: { en: 'Vegetarian', rw: 'Imboga Nyine' },
      description: { en: 'No meat or fish, but includes dairy and eggs', rw: 'Nta nyama cyangwa amafi, ariko harimo amata n\'amagi' },
      icon: Heart,
      severity: 'medium',
      enabled: true
    },
    {
      id: 'vegan',
      name: { en: 'Vegan', rw: 'Ibimera Byonyine' },
      description: { en: 'No animal products whatsoever', rw: 'Nta bintu byose bikomoka ku bitungwa' },
      icon: Heart,
      severity: 'high',
      enabled: false
    },
    {
      id: 'dairy-free',
      name: { en: 'Dairy-Free', rw: 'Nta Mata' },
      description: { en: 'Avoid milk and milk-based products', rw: 'Kwirinda amata n\'ibintu bikomoka ku mata' },
      icon: AlertTriangle,
      severity: 'medium',
      enabled: false
    },
    {
      id: 'low-sodium',
      name: { en: 'Low Sodium', rw: 'Umunyu Muke' },
      description: { en: 'Limit salt and high-sodium foods', rw: 'Kugabanya umunyu n\'ibiryo birimo umunyu mwinshi' },
      icon: Target,
      severity: 'low',
      enabled: false
    }
  ]);

  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal[]>([
    {
      id: 'calories',
      name: { en: 'Daily Calories', rw: 'Kalori za Buri Munsi' },
      target: 2000,
      current: 1450,
      unit: 'kcal',
      icon: Activity,
      enabled: true
    },
    {
      id: 'protein',
      name: { en: 'Protein', rw: 'Proteine' },
      target: 120,
      current: 85,
      unit: 'g',
      icon: Utensils,
      enabled: true
    },
    {
      id: 'carbs',
      name: { en: 'Carbohydrates', rw: 'Karubohidrate' },
      target: 250,
      current: 180,
      unit: 'g',
      icon: Target,
      enabled: false
    },
    {
      id: 'fiber',
      name: { en: 'Fiber', rw: 'Fibre' },
      target: 25,
      current: 15,
      unit: 'g',
      icon: Heart,
      enabled: true
    }
  ]);

  const content = {
    en: {
      title: 'Dietary Assistant',
      subtitle: 'Personalized nutrition guidance',
      restrictions: 'Restrictions',
      goals: 'Goals',
      recommendations: 'Recommendations',
      myRestrictions: 'My Dietary Restrictions',
      myGoals: 'My Nutrition Goals',
      smartRecommendations: 'Smart Food Recommendations',
      addRestriction: 'Add Restriction',
      editGoals: 'Edit Goals',
      matchScore: 'Match Score',
      benefits: 'Benefits',
      warnings: 'Warnings',
      nutrition: 'Nutrition',
      allergens: 'Allergens',
      viewMenu: 'View Menu',
      addToCart: 'Add to Cart',
      progress: 'Progress',
      remaining: 'remaining',
      exceeded: 'exceeded',
      severity: {
        high: 'Critical',
        medium: 'Important',
        low: 'Preference'
      },
      noRestrictions: 'No dietary restrictions set',
      noGoals: 'No nutrition goals configured',
      noRecommendations: 'No recommendations available',
      enableRestriction: 'Enable this restriction'
    },
    rw: {
      title: 'Umufasha mu Kurya',
      subtitle: 'Ubuyobozi bw\'intungamubiri bwite',
      restrictions: 'Ibibujijwe',
      goals: 'Intego',
      recommendations: 'Ibyifuzo',
      myRestrictions: 'Ibibujijwe byanjye',
      myGoals: 'Intego zanjye z\'Intungamubiri',
      smartRecommendations: 'Ibyifuzo Byubwenge by\'Ibiryo',
      addRestriction: 'Ongeraho Ikibujijwe',
      editGoals: 'Hindura Intego',
      matchScore: 'Amanota yo Guhuza',
      benefits: 'Inyungu',
      warnings: 'Iburira',
      nutrition: 'Intungamubiri',
      allergens: 'Ibintu Bitera Allergie',
      viewMenu: 'Reba Menu',
      addToCart: 'Ongeraho mu Gitebo',
      progress: 'Iterambere',
      remaining: 'bisigaye',
      exceeded: 'birengeye',
      severity: {
        high: 'Ingenzi cyane',
        medium: 'Ingenzi',
        low: 'Ibyifuzo'
      },
      noRestrictions: 'Nta bibujijwe mu kurya byashyizweho',
      noGoals: 'Nta ntego z\'intungamubiri zishyizweho',
      noRecommendations: 'Nta byifuzo biboneka',
      enableRestriction: 'Gukoresha iki kibujijwe'
    }
  };

  // Mock recommendations based on restrictions and goals
  const mockRecommendations: FoodRecommendation[] = [
    {
      id: 'rec1',
      name: { en: 'Quinoa Buddha Bowl', rw: 'Igikombe cya Buddha cya Quinoa' },
      restaurant: { en: 'Healthy Hub', rw: 'Ikigo cy\'Ubuzima' },
      price: 5800,
      rating: 4.8,
      matchScore: 95,
      benefits: [
        { en: 'High in plant protein', rw: 'Proteine nyinshi z\'ibimera' },
        { en: 'Gluten-free grains', rw: 'Imbuto zidafite gluten' },
        { en: 'Rich in fiber', rw: 'Bikungahaye fiber' }
      ],
      warnings: [],
      nutrition: {
        calories: 420,
        protein: 18,
        carbs: 55,
        fat: 12,
        fiber: 8
      },
      allergens: [
        { en: 'May contain nuts', rw: 'Bishobora kuba birimo imbuto' }
      ]
    },
    {
      id: 'rec2',
      name: { en: 'Grilled Salmon Salad', rw: 'Salade ya Salmon Icyemo' },
      restaurant: { en: 'Ocean Fresh', rw: 'Nyanja Nshya' },
      price: 7200,
      rating: 4.6,
      matchScore: 88,
      benefits: [
        { en: 'Omega-3 fatty acids', rw: 'Amavuta ya Omega-3' },
        { en: 'High protein content', rw: 'Proteine nyinshi' },
        { en: 'Low carb option', rw: 'Karubohidrate nke' }
      ],
      warnings: [
        { en: 'Contains fish', rw: 'Birimo amafi' }
      ],
      nutrition: {
        calories: 380,
        protein: 32,
        carbs: 15,
        fat: 22,
        fiber: 6
      },
      allergens: [
        { en: 'Fish', rw: 'Amafi' }
      ]
    }
  ];

  const toggleRestriction = (id: string) => {
    setRestrictions(prev => 
      prev.map(restriction => 
        restriction.id === id 
          ? { ...restriction, enabled: !restriction.enabled }
          : restriction
      )
    );
  };

  const toggleGoal = (id: string) => {
    setNutritionGoals(prev => 
      prev.map(goal => 
        goal.id === id 
          ? { ...goal, enabled: !goal.enabled }
          : goal
      )
    );
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-primary';
  };

  const tabs = [
    { id: 'restrictions', label: content[language].restrictions, icon: Shield },
    { id: 'goals', label: content[language].goals, icon: Target },
    { id: 'recommendations', label: content[language].recommendations, icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/30 pt-safe">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'en' ? 'Back' : 'Subira'}</span>
          </button>
          
          <div className="text-center flex-1 mx-4">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-foreground font-medium">{content[language].title}</h1>
            </div>
            <p className="text-xs text-muted-foreground">{content[language].subtitle}</p>
          </div>
          
          <div className="w-12" />
        </div>
      </div>

      <div className="p-4 pb-safe">
        {/* Tab Navigation */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-6 border border-white/20">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative p-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
                >
                  <div className="text-center">
                    <IconComponent className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-white' : ''}`} />
                    <p className="text-xs font-medium">
                      {tab.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Restrictions Tab */}
          {activeTab === 'restrictions' && (
            <motion.div
              key="restrictions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-medium">{content[language].myRestrictions}</h2>
                <Badge variant="secondary" className="text-xs">
                  {restrictions.filter(r => r.enabled).length} {language === 'en' ? 'active' : 'zikora'}
                </Badge>
              </div>

              {restrictions.map((restriction) => {
                const IconComponent = restriction.icon;
                
                return (
                  <div
                    key={restriction.id}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        restriction.enabled 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-foreground font-medium">
                            {restriction.name[language]}
                          </h3>
                          <Badge className={`text-xs px-2 py-1 ${getSeverityColor(restriction.severity)}`}>
                            {content[language].severity[restriction.severity]}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">
                          {restriction.description[language]}
                        </p>
                      </div>
                      
                      <Switch
                        checked={restriction.enabled}
                        onCheckedChange={() => toggleRestriction(restriction.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                );
              })}

              {restrictions.filter(r => r.enabled).length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground font-medium mb-2">
                    {content[language].noRestrictions}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' 
                      ? 'Enable dietary restrictions to get personalized food recommendations.'
                      : 'Shyira ibibujijwe mu kurya kugira ubone ibyifuzo byihariye by\'ibiryo.'
                    }
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-medium">{content[language].myGoals}</h2>
                <Badge variant="secondary" className="text-xs">
                  {nutritionGoals.filter(g => g.enabled).length} {language === 'en' ? 'active' : 'zikora'}
                </Badge>
              </div>

              {nutritionGoals.map((goal) => {
                const IconComponent = goal.icon;
                const percentage = Math.min((goal.current / goal.target) * 100, 100);
                const remaining = Math.max(goal.target - goal.current, 0);
                const exceeded = Math.max(goal.current - goal.target, 0);
                
                return (
                  <div
                    key={goal.id}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        goal.enabled 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-foreground font-medium mb-1">
                          {goal.name[language]}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-foreground font-medium">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                          <span className={`text-xs ${
                            goal.current >= goal.target ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            ({Math.round(percentage)}%)
                          </span>
                        </div>
                      </div>
                      
                      <Switch
                        checked={goal.enabled}
                        onCheckedChange={() => toggleGoal(goal.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                    
                    {goal.enabled && (
                      <div className="space-y-2">
                        {/* Progress Bar */}
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(goal.current, goal.target)}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center gap-2 text-xs">
                          {goal.current >= goal.target ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>
                                {language === 'en' ? 'Goal reached!' : 'Intego igezweho!'}
                                {exceeded > 0 && ` (+${exceeded}${goal.unit} ${content[language].exceeded})`}
                              </span>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">
                              {remaining}{goal.unit} {content[language].remaining}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {nutritionGoals.filter(g => g.enabled).length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground font-medium mb-2">
                    {content[language].noGoals}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' 
                      ? 'Set nutrition goals to track your daily intake and get better recommendations.'
                      : 'Shyira intego z\'intungamubiri kugira ukurikirane ibiryo bya buri munsi ubona ibyifuzo byiza.'
                    }
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-medium">{content[language].smartRecommendations}</h2>
                <Badge variant="secondary" className="text-xs">
                  {mockRecommendations.length} {language === 'en' ? 'matches' : 'zihuje'}
                </Badge>
              </div>

              {mockRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-foreground font-medium">
                          {recommendation.name[language]}
                        </h3>
                        <Badge className="text-xs px-2 py-1 bg-green-100 text-green-700">
                          {content[language].matchScore}: {recommendation.matchScore}%
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-2">
                        {recommendation.restaurant[language]}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>{recommendation.rating}</span>
                        </div>
                        <span className="text-primary font-semibold">
                          {recommendation.price.toLocaleString()} RWF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  {recommendation.benefits.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-foreground font-medium text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {content[language].benefits}
                      </h4>
                      <div className="space-y-1">
                        {recommendation.benefits.map((benefit, index) => (
                          <p key={index} className="text-green-600 text-sm">
                            • {benefit[language]}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {recommendation.warnings.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-foreground font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {content[language].warnings}
                      </h4>
                      <div className="space-y-1">
                        {recommendation.warnings.map((warning, index) => (
                          <p key={index} className="text-orange-600 text-sm">
                            • {warning[language]}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nutrition Info */}
                  <div className="bg-muted/30 rounded-2xl p-3 mb-4">
                    <h4 className="text-foreground font-medium text-sm mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      {content[language].nutrition}
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-primary">
                          {recommendation.nutrition.calories}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en' ? 'Calories' : 'Kalori'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {recommendation.nutrition.protein}g
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en' ? 'Protein' : 'Proteine'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {recommendation.nutrition.fiber}g
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en' ? 'Fiber' : 'Fibre'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Allergens */}
                  {recommendation.allergens.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-foreground font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        {content[language].allergens}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.allergens.map((allergen, index) => (
                          <Badge key={index} className="text-xs bg-red-100 text-red-700">
                            {allergen[language]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border text-muted-foreground hover:text-foreground"
                    >
                      {content[language].viewMenu}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    >
                      {content[language].addToCart}
                    </Button>
                  </div>
                </div>
              ))}

              {mockRecommendations.length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground font-medium mb-2">
                    {content[language].noRecommendations}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' 
                      ? 'Set up your dietary restrictions and nutrition goals to get personalized recommendations.'
                      : 'Shyira ibibujijwe mu kurya n\'intego z\'intungamubiri kugira ubane ibyifuzo byihariye.'
                    }
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}