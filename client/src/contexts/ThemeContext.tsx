import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemeVariant = 'default' | 'premium' | 'gradient' | 'neon';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [themeVariant, setThemeVariant] = useState<ThemeVariant>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('themeVariant') as ThemeVariant) || 'default';
    }
    return 'default';
  });

  const [isPremium, setIsPremium] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isPremium') === 'true';
    }
    return false;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    
    const updateTheme = (newTheme: 'light' | 'dark') => {
      setResolvedTheme(newTheme);
      root.classList.remove('light', 'dark', 'premium', 'gradient', 'neon');
      root.classList.add(newTheme, themeVariant);
      
      // Set CSS custom properties for gradients
      if (themeVariant === 'gradient') {
        root.style.setProperty('--gradient-primary', newTheme === 'dark' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)');
        root.style.setProperty('--gradient-secondary', newTheme === 'dark'
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)');
      } else if (themeVariant === 'neon') {
        root.style.setProperty('--neon-primary', newTheme === 'dark' ? '#00ffff' : '#ff6b6b');
        root.style.setProperty('--neon-secondary', newTheme === 'dark' ? '#ff00ff' : '#4ecdc4');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      updateTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e: MediaQueryListEvent) => {
        updateTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      updateTheme(theme);
    }
  }, [theme, themeVariant]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('themeVariant', themeVariant);
  }, [themeVariant]);

  useEffect(() => {
    localStorage.setItem('isPremium', isPremium.toString());
  }, [isPremium]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      resolvedTheme, 
      themeVariant, 
      setThemeVariant, 
      isPremium, 
      setIsPremium 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
