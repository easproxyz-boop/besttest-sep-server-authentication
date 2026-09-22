import rateLimit from '@fastify/rate-limit';
export async function registerRateLimit(fastify) {
    await fastify.register(rateLimit, {
        max: Number(process.env.RATE_LIMIT_MAX ?? 100), // requests
        timeWindow: process.env.RATE_LIMIT_WINDOW ?? '1 minute',
        // optional: use Redis so limits are shared across multiple server instances
        // redis: pubClient,
        // nameSpace: 'rate-limit:',
        errorResponseBuilder: (_request, context) => {
            return {
                status: 'error',
                message: `Rate limit exceeded, retry in ${context.after}`,
            };
        },
    });
}
//# sourceMappingURL=rateLimit.js.map