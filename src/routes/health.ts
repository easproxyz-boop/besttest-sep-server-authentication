import type { FastifyInstance } from 'fastify'
import { poolAuthentication } from '../configuration/database/index.ts'

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health/db', async (request, reply) => {
    try {
      const [rows] = await poolAuthentication.execute('SELECT 1 AS result')

      return {
        status: 'ok',
        database: 'connected',
        result: rows,
      }
    } catch (error: unknown) {
      request.log.error(error)

      return reply.code(500).send({
        status: 'error',
        database: 'disconnected',
      })
    }
  })
}