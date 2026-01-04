import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

/**
 * Custom hook to manage global keyboard shortcuts for the Aurora Gov application
 */
export function useKeyboardShortcuts() {
  const { setShowOnboarding, setShowDocumentWorkspace, setShowComparisonMode } = useApp();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || 
                       target.tagName === 'TEXTAREA' ||
                       target.contentEditable === 'true';

      // Help/Tutorial - F1 or Ctrl+H
      if (event.key === 'F1' || (event.ctrlKey && event.key === 'h')) {
        event.preventDefault();
        setShowOnboarding(true);
        return;
      }

      // Document Workspace - Ctrl+D (when not typing)
      if (!isTyping && event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        setShowDocumentWorkspace(prev => !prev);
        return;
      }

      // Comparison Mode - Ctrl+K (when not typing)
      if (!isTyping && event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setShowComparisonMode(prev => !prev);
        return;
      }

      // ESC - Close modals
      if (event.key === 'Escape') {
        setShowDocumentWorkspace(false);
        setShowComparisonMode(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowOnboarding, setShowDocumentWorkspace, setShowComparisonMode]);
}
