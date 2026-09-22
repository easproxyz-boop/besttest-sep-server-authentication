import { Redis } from 'ioredis';
const pubClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
const subClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
pubClient.on('error', (err) => console.error('Redis pubClient error:', err));
subClient.on('error', (err) => console.error('Redis subClient error:', err));
async function connectRedis() {
    await Promise.all([
        pubClient.status === 'ready' ? Promise.resolve() : new Promise((resolve) => pubClient.once('ready', resolve)),
        subClient.status === 'ready' ? Promise.resolve() : new Promise((resolve) => subClient.once('ready', resolve)),
    ]);
    console.log('Redis Connected (ioredis)');
}
function disconnectRedis() {
    pubClient.disconnect();
    subClient.disconnect();
}
export { connectRedis, disconnectRedis, pubClient, subClient };
//# sourceMappingURL=index.js.map