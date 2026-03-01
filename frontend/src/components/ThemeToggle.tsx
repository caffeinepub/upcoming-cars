import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border bg-secondary hover:bg-accent transition-all duration-200 hover:border-auto-red group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-muted-foreground group-hover:text-auto-red transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-muted-foreground group-hover:text-auto-red transition-colors" />
      )}
    </button>
  );
}
