import StorageCache from './storage';
import KEYS from './keys';

/**
 * 保存主题信息
 */
export const cacheThemeInfo = new StorageCache(KEYS.theme);

/**
 * 保存refreshToken
 */
export const cacheRefreshToken = new StorageCache(KEYS.refreshToken, 60 * 60 * 24);

/**
 * 保存tokenExp
 */
export const cacheTokenExp = new StorageCache(KEYS.tokenExp, 0);
