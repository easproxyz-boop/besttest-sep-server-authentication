import compress from '@fastify/compress';
export async function registerCompress(fastify) {
    await fastify.register(compress, {
        global: true,
        encodings: ['gzip', 'deflate', 'br'],
    });
}
//# sourceMappingURL=compress.js.map