import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../configuration/redis/index.js';
import { allowedOrigins } from '../configuration/cors/index.js';
export function setupSocketIO(fastify) {
    const io = new SocketIOServer(fastify.server, {
        adapter: createAdapter(pubClient, subClient),
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });
    fastify.io = io;
    io.on('connection', (socket) => {
        fastify.log.info(`Client connected: ${socket.id}`);
        socket.on('join:room', (room) => {
            socket.join(room);
            socket.emit('joined-room', { room });
        });
        socket.on('leave:room', (room) => {
            socket.leave(room);
        });
        socket.on('disconnect', () => {
            fastify.log.info(`Disconnected: ${socket.id}`);
        });
    });
    return io;
}
//# sourceMappingURL=socket.js.map