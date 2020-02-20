import * as Redis from 'ioredis';
import * as Redlock from 'redlock';
import { getConfig } from '../config-helper';

export function getRedisClient() {
  return new Redis(getConfig().REDIS_URL);
}

export function getRedlock() {
  const redis = getRedisClient()
  return new Redlock([redis], { retryCount: -1 });
}

export const useRedis = new Promise(resolve => {
  const redis = getRedisClient()
  redis.on('ready', () => {
    resolve(true);
  });
  redis.on('error', err => {
    resolve(false);
    return redis.quit();
  });
}).then(val => {
  console.log('Cache is', val ? 'redis' : 'in-memory');
  return val;
});
