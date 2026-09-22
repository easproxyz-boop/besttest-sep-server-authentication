import type { FastifyInstance } from 'fastify'
import { closeDatabaseConnection } from '../configuration/database/index.js'
import { disconnectRedis } from '../configuration/redis/index.js'

let isShuttingDown = false

export function registerShutdown(fastify: FastifyInstance): void {
  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) return
    isShuttingDown = true

    fastify.log.info(`Received ${signal}, shutting down`)

    try {
      fastify.io?.close()
      await fastify.close()
      await closeDatabaseConnection()
      disconnectRedis()
      process.exit(0)
    } catch (error: unknown) {
      fastify.log.error(error)
      process.exit(1)
    }
  }

  process.on('SIGINT', () => {
    void shutdown('SIGINT')
  })

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM')
  })
}