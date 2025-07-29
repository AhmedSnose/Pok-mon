import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Environment Configuration', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    // Reset import.meta.env before each test
    vi.stubGlobal('import.meta', {
      env: {},
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses default API URL when VITE_BASE_API_URL is not set', async () => {
    vi.stubGlobal('import.meta', {
      env: {},
    });

    // Dynamically import to get fresh config
    const config = await import('../../config/env');
    
    expect(config.default.baseApiUrl).toBe('https://pokeapi.co/api/v2');
  });

  it('uses environment variable when VITE_BASE_API_URL is set', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_BASE_API_URL: 'https://custom-api.com/v1',
      },
    });

    // Clear module cache and re-import
    vi.resetModules();
    const config = await import('../../config/env');
    
    expect(config.default.baseApiUrl).toBe('https://custom-api.com/v1');
  });

  it('handles empty string environment variable', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_BASE_API_URL: '',
      },
    });

    vi.resetModules();
    const config = await import('../../config/env');
    
    expect(config.default.baseApiUrl).toBe('https://pokeapi.co/api/v2');
  });

  it('handles undefined environment variable', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_BASE_API_URL: undefined,
      },
    });

    vi.resetModules();
    const config = await import('../../config/env');
    
    expect(config.default.baseApiUrl).toBe('https://pokeapi.co/api/v2');
  });
});