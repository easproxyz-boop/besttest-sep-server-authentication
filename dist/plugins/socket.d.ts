import type { FastifyInstance } from 'fastify';
import { Server as SocketIOServer } from 'socket.io';
export declare function setupSocketIO(fastify: FastifyInstance): SocketIOServer;
