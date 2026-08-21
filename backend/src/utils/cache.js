import NodeCache from 'node-cache';

const defaultTTL = parseInt(process.env.CACHE_TTL || '600', 10); // default 10 mins
const cache = new NodeCache({
  stdTTL: defaultTTL,
  checkperiod: 120,
  useClones: false
});

export const cacheService = {
  get(key) {
    return cache.get(key);
  },

  set(key, value, ttl = defaultTTL) {
    return cache.set(key, value, ttl);
  },

  has(key) {
    return cache.has(key);
  },

  del(key) {
    return cache.del(key);
  },

  flush() {
    return cache.flushAll();
  },

  getStats() {
    return cache.getStats();
  }
};
