import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { poolAuthentication } from '../configuration/database/index.ts'

const createTestBodySchema = z.object({
  dt_firstname: z.string().min(1, 'First name is required'),
  dt_middlename: z.string().optional().default(''),
  dt_lastname: z.string().min(1, 'Last name is required'),
  dt_session: z.string().min(1, 'Session is required'),
})

const createTestResponseSchema = z.object({
  status: z.literal('ok'),
  message: z.string(),
  insertId: z.number(),
})

const testRecordSchema = z.object({
  dt_no: z.number(),
  dt_firstname: z.string(),
  dt_middlename: z.string(),
  dt_lastname: z.string(),
  dt_session: z.string(),
})

const getTestResponseSchema = z.array(testRecordSchema)

const errorResponseSchema = z.object({
  status: z.literal('error'),
  message: z.string(),
})

export async function testRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/test/insert',
    {
      schema: {
        body: createTestBodySchema,
        response: {
          201: createTestResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { dt_firstname, dt_middlename, dt_lastname, dt_session } =
        request.body as z.infer<typeof createTestBodySchema>

      try {
        const [result] = await poolAuthentication.execute(
          `INSERT INTO \`tbl_test\` (\`dt_firstname\`, \`dt_middlename\`, \`dt_lastname\`, \`dt_session\`) VALUES (?, ?, ?, ?)`,
          [dt_firstname, dt_middlename, dt_lastname, dt_session],
        )

        const insertId = (result as { insertId: number }).insertId

        return reply.code(201).send({
          status: 'ok',
          message: 'Record created successfully',
          insertId,
        })
      } catch (error: unknown) {
        request.log.error(error)

        return reply.code(500).send({
          status: 'error',
          message: 'Failed to insert record',
        })
      }
    },
  )

  fastify.get(
    '/test/get',
    {
      schema: {
        response: {
          200: getTestResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const [rows] = await poolAuthentication.execute(
          `SELECT \`dt_no\`, \`dt_firstname\`, \`dt_middlename\`, \`dt_lastname\`, \`dt_session\` FROM \`tbl_test\` ORDER BY \`dt_no\` DESC`,
        )

        return reply.code(200).send(rows as z.infer<typeof testRecordSchema>[])
      } catch (error: unknown) {
        request.log.error(error)

        return reply.code(500).send({
          status: 'error',
          message: 'Failed to fetch records',
        })
      }
    },
  )
}