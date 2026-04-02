import { useState, useEffect } from 'react';

export type Platform = 'web' | 'desktop';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    // Check for Tauri global (Native Desktop)
    const isTauri = (window as any).__TAURI_METADATA__ || (window as any).__TAURI__ || navigator.userAgent.includes('Tauri');
    if (typeof window !== 'undefined' && isTauri) {
      setPlatform('desktop');
    } else {
      setPlatform('web');
    }
  }, []);

  const isDesktop = platform === 'desktop';
  const isWeb = platform === 'web';

  return { platform, isDesktop, isWeb };
}
