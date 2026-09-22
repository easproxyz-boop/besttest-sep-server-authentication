import { closeDatabaseConnection } from '../configuration/database/index.js';
import { disconnectRedis } from '../configuration/redis/index.js';
let isShuttingDown = false;
export function registerShutdown(fastify) {
    const shutdown = async (signal) => {
        if (isShuttingDown)
            return;
        isShuttingDown = true;
        fastify.log.info(`Received ${signal}, shutting down`);
        try {
            fastify.io?.close();
            await fastify.close();
            await closeDatabaseConnection();
            disconnectRedis();
            process.exit(0);
        }
        catch (error) {
            fastify.log.error(error);
            process.exit(1);
        }
    };
    process.on('SIGINT', () => {
        void shutdown('SIGINT');
    });
    process.on('SIGTERM', () => {
        void shutdown('SIGTERM');
    });
}
//# sourceMappingURL=shutdown.js.map