import type { FastifyInstance } from 'fastify'
import compress from '@fastify/compress'

export async function registerCompress(fastify: FastifyInstance): Promise<void> {
  await fastify.register(compress, {
    global: true,
    encodings: ['gzip', 'deflate', 'br'],
  })
}