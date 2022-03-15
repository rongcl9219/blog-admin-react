import CookieCache from '@/core/cookieCache/cookie';
import KEYS from '@/core/cookieCache/keys';

/**
 * 保存accessToken
 */
export const cacheAccessToken = new CookieCache(KEYS.accessToken);
