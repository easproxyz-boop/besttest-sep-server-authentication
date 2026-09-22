import { Redis } from 'ioredis';
declare const pubClient: Redis;
declare const subClient: Redis;
declare function connectRedis(): Promise<void>;
declare function disconnectRedis(): void;
export { connectRedis, disconnectRedis, pubClient, subClient };
