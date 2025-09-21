import React from 'react';
import { Button } from './ui/button';

/**
 * DevModeHelper - Quick development mode switcher
 * 
 * This component provides quick buttons to switch between different development modes.
 * Only visible in development environment.
 * 
 * Usage: Add to any component for quick mode switching during development
 */
export function DevModeHelper() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const currentUrl = window.location.pathname;
  
  const switchToProductionMode = () => {
    window.location.href = currentUrl;
  };
  
  const switchToDevMode = () => {
    window.location.href = currentUrl + '?nav=true';
  };
  
  const switchToScrollTest = () => {
    window.location.href = currentUrl + '?nav=true';
    // Small delay to allow URL change, then navigate to scroll test
    setTimeout(() => {
      // This would need to be handled by the AppNavigator
      console.log('Navigate to scroll test - use the Scroll Test button in dev nav');
    }, 100);
  };

  const isInDevMode = window.location.search.includes('nav=true');
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-xl p-3 space-y-2">
      <div className="text-white text-xs font-medium mb-2">
        🔧 Dev Mode: {isInDevMode ? 'Component Testing' : 'Production Flow'}
      </div>
      
      {isInDevMode ? (
        <Button
          size="sm"
          onClick={switchToProductionMode}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
        >
          ✅ Switch to Production Mode
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={switchToDevMode}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs"
        >
          🔧 Switch to Component Testing
        </Button>
      )}
      
      <div className="text-white/70 text-xs leading-tight">
        <div className="font-medium text-white">Recommended:</div>
        <div>• Use Production Mode for feature development</div>
        <div>• Use Component Testing only for visual debugging</div>
      </div>
    </div>
  );
}

/**
 * Console commands for quick mode switching
 * 
 * Run these in browser console for quick development mode changes:
 */

// Add global dev helpers to window for easy console access
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).devMode = {
    production: () => {
      window.location.href = window.location.pathname;
    },
    components: () => {
      window.location.href = window.location.pathname + '?nav=true';
    },
    scrollTest: () => {
      window.location.href = window.location.pathname + '?nav=true';
      console.log('🎯 URL switched to dev mode. Click "Scroll Test" button in the navigation bar.');
    },
    help: () => {
      console.log(`
🔧 DeliGo Development Commands:

devMode.production()  - Switch to complete app flow (RECOMMENDED)
devMode.components()  - Switch to component testing mode  
devMode.scrollTest()  - Quick access to scroll testing
devMode.help()        - Show this help

DEVELOPMENT WORKFLOW:
✅ Use devMode.production() for all feature development
✅ Test real user flows, navigation, state management
🔧 Use devMode.components() only for isolated component debugging

Current mode: ${window.location.search.includes('nav=true') ? 'Component Testing' : 'Production Flow'}
      `);
    }
  };

  // Show help on first load
  console.log('🎯 DeliGo Dev Mode loaded! Type devMode.help() for commands.');
}