import { useState, useEffect } from 'react';

export type Platform = 'web' | 'desktop';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    // Check for Tauri global (Native Desktop)
    if (typeof window !== 'undefined' && (window as any).__TAURI_METADATA__ || (window as any).__TAURI__) {
      setPlatform('desktop');
    } else {
      setPlatform('web');
    }
  }, []);

  const isDesktop = platform === 'desktop';
  const isWeb = platform === 'web';

  return { platform, isDesktop, isWeb };
}
