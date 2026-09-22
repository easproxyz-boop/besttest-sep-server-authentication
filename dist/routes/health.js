import { poolAuthentication } from '../configuration/database/index.js';
export async function healthRoutes(fastify) {
    fastify.get('/health/db', async (request, reply) => {
        try {
            const [rows] = await poolAuthentication.execute('SELECT 1 AS result');
            return {
                status: 'ok',
                database: 'connected',
                result: rows,
            };
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({
                status: 'error',
                database: 'disconnected',
            });
        }
    });
}
//# sourceMappingURL=health.js.map