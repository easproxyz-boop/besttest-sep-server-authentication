import 'dotenv/config'
import cors from '@fastify/cors'

import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import './types/fastify.d.js'
import { testDatabaseConnection, closeDatabaseConnection } from './configuration/database/index.js'
// The Redis module is JavaScript and currently has no accompanying declaration file.
import { connectRedis } from './configuration/redis/index.ts'
import { allowedOrigins } from './configuration/cors/index.ts'
import { setupSocketIO } from './plugins/socket.ts'
import { registerRateLimit } from './plugins/rateLimit.ts'
import { registerCompress } from './plugins/compress.ts'
import { healthRoutes } from './routes/health.ts'
import { testRoutes } from './routes/test.ts'
import { registerShutdown } from './utils/shutdown.ts'

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()


fastify.register(cors, {
  origin: allowedOrigins, // specific list, hindi '*'
  credentials: true,
})


fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

registerShutdown(fastify)

const start = async (): Promise<void> => {
  try {
    await testDatabaseConnection()
    await connectRedis()

    // Plugins should be registered before routes so they apply globally
    await registerRateLimit(fastify)
    await registerCompress(fastify)

    await fastify.register(healthRoutes)
    await fastify.register(testRoutes)

    
    setupSocketIO(fastify)

    const port = Number(process.env.PORT ?? 3000)

    await fastify.listen({ port, host: '0.0.0.0' })

    fastify.log.info(`Server running on http://localhost:${port}`)
    fastify.log.info(`Allowed origins: ${allowedOrigins.join(', ')}`)
  } catch (error: unknown) {
    fastify.log.error(error)
    await closeDatabaseConnection()
    process.exit(1)
  }
}

void start()