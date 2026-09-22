import 'dotenv/config';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, } from 'fastify-type-provider-zod';
import './types/fastify.d.js';
import { testDatabaseConnection, closeDatabaseConnection } from './configuration/database/index.js';
// The Redis module is JavaScript and currently has no accompanying declaration file.
import { connectRedis } from './configuration/redis/index.js';
import { allowedOrigins } from './configuration/cors/index.js';
import { setupSocketIO } from './plugins/socket.js';
import { registerRateLimit } from './plugins/rateLimit.js';
import { registerCompress } from './plugins/compress.js';
import { healthRoutes } from './routes/health.js';
import { testRoutes } from './routes/test.js';
import { registerShutdown } from './utils/shutdown.js';
const fastify = Fastify({
    logger: true,
}).withTypeProvider();
fastify.register(cors, {
    origin: allowedOrigins, // specific list, hindi '*'
    credentials: true,
});
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);
registerShutdown(fastify);
const start = async () => {
    try {
        await testDatabaseConnection();
        await connectRedis();
        // Plugins should be registered before routes so they apply globally
        await registerRateLimit(fastify);
        await registerCompress(fastify);
        await fastify.register(healthRoutes);
        await fastify.register(testRoutes);
        setupSocketIO(fastify);
        const port = Number(process.env.PORT ?? 3000);
        await fastify.listen({ port, host: '0.0.0.0' });
        fastify.log.info(`Server running on http://localhost:${port}`);
        fastify.log.info(`Allowed origins: ${allowedOrigins.join(', ')}`);
    }
    catch (error) {
        fastify.log.error(error);
        await closeDatabaseConnection();
        process.exit(1);
    }
};
void start();
//# sourceMappingURL=server.js.map