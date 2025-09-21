import React, { useState } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { ArrowLeft, Save, Sparkles, Volume2, VolumeX, ChefHat, User, BarChart3, Lightbulb, Info } from 'lucide-react';

interface AISettingsProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface AITask {
  id: string;
  name: { en: string; rw: string };
  description: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}

export function AISettings({ language, onBack }: AISettingsProps) {
  const [voicePrompts, setVoicePrompts] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [aiTasks, setAiTasks] = useState<AITask[]>([
    {
      id: 'smart-meals',
      name: { 
        en: 'Smart Meals', 
        rw: 'Ibiryo Byubwenge' 
      },
      description: { 
        en: 'Get personalized meal recommendations based on your preferences and order history',
        rw: 'Boneka ibiryo byawe byihariye ukurikije ibyo ukunze n\'amateka y\'ikurikira ryawe'
      },
      icon: ChefHat,
      enabled: true
    },
    {
      id: 'profile-setup',
      name: { 
        en: 'Profile Setup', 
        rw: 'Gushyiraho Imyirondoro' 
      },
      description: { 
        en: 'AI assistance for completing your profile and preferences',
        rw: 'Ubufasha bwa AI mu kuzuza imyirondoro yawe n\'ibyifuzo'
      },
      icon: User,
      enabled: true
    },
    {
      id: 'order-analytics',
      name: { 
        en: 'Order Analytics', 
        rw: 'Isesengura ry\'Ikurikira' 
      },
      description: { 
        en: 'Smart insights about your ordering patterns and spending',
        rw: 'Ubushishozi bwubwenge bw\'uburyo ukurikira n\'gukoresha amafaranga'
      },
      icon: BarChart3,
      enabled: false
    },
    {
      id: 'supply-tips',
      name: { 
        en: 'Supply Tips', 
        rw: 'Inama z\'Ibikoresho' 
      },
      description: { 
        en: 'Helpful suggestions for meal planning and cost-saving',
        rw: 'Inama nziza zo gutegura ibiryo no kuzigama amafaranga'
      },
      icon: Lightbulb,
      enabled: false
    },
    {
      id: 'blockchain-explain',
      name: { 
        en: 'Blockchain Explain', 
        rw: 'Gusobanura Blockchain' 
      },
      description: { 
        en: 'Easy explanations of blockchain transactions and history',
        rw: 'Ibisobanuro byoroshye bya blockchain n\'amateka y\'ibikorwa'
      },
      icon: Info,
      enabled: true
    }
  ]);

  const toggleTask = (taskId: string) => {
    setAiTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, enabled: !task.enabled }
          : task
      )
    );
    setHasChanges(true);
  };

  const toggleVoicePrompts = () => {
    setVoicePrompts(prev => !prev);
    setHasChanges(true);
  };

  const handleSave = () => {
    alert(language === 'en' 
      ? 'AI preferences saved successfully!' 
      : 'Ibyifuzo bya AI byabitswe neza!'
    );
    setHasChanges(false);
  };

  const handleReset = () => {
    setAiTasks(prev => 
      prev.map(task => ({
        ...task,
        enabled: ['smart-meals', 'profile-setup', 'blockchain-explain'].includes(task.id)
      }))
    );
    setVoicePrompts(false);
    setHasChanges(true);
  };

  const content = {
    en: {
      title: 'AI Assistant Settings',
      subtitle: 'Customize your AI experience',
      aiTasks: 'AI Tasks & Features',
      voiceSettings: 'Voice Settings',
      voicePrompts: 'Voice Prompts',
      voiceDescription: 'Enable voice responses and audio feedback',
      save: 'Save Changes',
      reset: 'Reset',
      enabledCount: 'enabled',
      taskEnabled: 'On',
      taskDisabled: 'Off'
    },
    rw: {
      title: 'Igenamiterere rya AI',
      subtitle: 'Hindura uburambe bwawe bwa AI',
      aiTasks: 'Imirimo n\'Ibiranga bya AI',
      voiceSettings: 'Igenamiterere ry\'Ijwi',
      voicePrompts: 'Ibiteganijwe by\'Ijwi',
      voiceDescription: 'Orohereza ibisubizo by\'ijwi n\'amakuru y\'amajwi',
      save: 'Bika Impinduka',
      reset: 'Subiza',
      enabledCount: 'byoroherejwe',
      taskEnabled: 'Gufungura',
      taskDisabled: 'Gufunga'
    }
  };

  const enabledTasksCount = aiTasks.filter(task => task.enabled).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
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
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-foreground text-lg">{content[language].title}</h1>
            </div>
            <p className="text-muted-foreground text-sm">{content[language].subtitle}</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            {content[language].reset}
          </Button>
        </div>
      </div>

      <div className="p-4 pb-20">
        {/* Status Bar */}
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-foreground font-medium text-sm">
              {language === 'en' ? 'Configuration' : 'Igenamiterere'}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">
                {language === 'en' ? 'Active Features' : 'Ibiranga Bikora'}
              </p>
              <p className="text-orange-600 font-medium">
                {enabledTasksCount} / {aiTasks.length}
              </p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-xs">
                {language === 'en' ? 'Voice' : 'Ijwi'}
              </p>
              <p className={`font-medium text-xs ${voicePrompts ? 'text-green-600' : 'text-muted-foreground'}`}>
                {voicePrompts ? content[language].taskEnabled : content[language].taskDisabled}
              </p>
            </div>
          </div>
        </div>

        {/* AI Tasks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">{content[language].aiTasks}</h2>
            <span className="text-muted-foreground text-xs">
              {enabledTasksCount} {content[language].enabledCount}
            </span>
          </div>

          <div className="space-y-3">
            {aiTasks.map((task) => {
              const IconComponent = task.icon;
              
              return (
                <div 
                  key={task.id}
                  className="bg-card border border-border rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Task Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      task.enabled 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-card-foreground font-medium text-sm">
                          {task.name[language]}
                        </h3>
                        <Switch
                          checked={task.enabled}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="data-[state=checked]:bg-orange-500 scale-75"
                        />
                      </div>
                      
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {task.description[language]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voice Settings Section */}
        <div className="mb-6">
          <h2 className="text-foreground mb-4">{content[language].voiceSettings}</h2>
          
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              {/* Voice Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                voicePrompts 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {voicePrompts ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </div>

              {/* Voice Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-card-foreground font-medium text-sm">
                    {content[language].voicePrompts}
                  </h3>
                  <Switch
                    checked={voicePrompts}
                    onCheckedChange={toggleVoicePrompts}
                    className="data-[state=checked]:bg-orange-500 scale-75"
                  />
                </div>
                
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {content[language].voiceDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm border-t border-border">
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`w-full h-12 rounded-xl shadow-lg transition-all ${
            hasChanges 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          {content[language].save}
        </Button>
        
        {hasChanges && (
          <p className="text-center text-muted-foreground text-xs mt-2">
            {language === 'en' 
              ? 'You have unsaved changes' 
              : 'Ufite impinduka zitarabitswe'
            }
          </p>
        )}
      </div>
    </div>
  );
}