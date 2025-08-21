import { describe, it, expect } from 'vitest';
import { isLiveMode } from './api';
import { API_CONFIG } from '../../src_config_api';

describe('isLiveMode', () => {
  it('returns false in test mode', () => {
    expect(API_CONFIG.MODE).toBe('test');
    expect(isLiveMode()).toBe(false);
  });
});