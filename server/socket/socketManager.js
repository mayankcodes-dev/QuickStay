/**
 * socketManager.js — Socket.io server logic
 * 
 * Channels used:
 *   owner:{userId}     → owner dashboard gets new booking toast
 *   room:{roomId}      → viewers of a room get live availability + viewer count
 * 
 * Events (server → client):
 *   new:booking        → { booking } — sent to hotel owner
 *   availability:update → { roomId, available } — live availability badge
 *   viewers:count      → { count } — "X people viewing this"
 *
 * Events (client → server):
 *   join:owner         → userId — owner joins their notification channel
 *   watch:room         → roomId — user starts watching a room page
 *   leave:room         → roomId — user leaves room page
 */

// roomViewers: Map<roomId, Set<socketId>>
const roomViewers = new Map();

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        // ── Owner notification channel ──────────────────────────
        socket.on('join:owner', (userId) => {
            if (!userId) return;
            socket.join(`owner:${userId}`);
            console.log(`[Socket] Owner ${userId} joined notifications`);
        });

        // ── Room viewer tracking ────────────────────────────────
        socket.on('watch:room', (roomId) => {
            if (!roomId) return;
            socket.join(`room:${roomId}`);

            // Track viewer
            if (!roomViewers.has(roomId)) roomViewers.set(roomId, new Set());
            roomViewers.get(roomId).add(socket.id);

            // Broadcast updated count to everyone in this room's channel
            const count = roomViewers.get(roomId).size;
            io.to(`room:${roomId}`).emit('viewers:count', { count, roomId });
            console.log(`[Socket] Room ${roomId} viewers: ${count}`);
        });

        socket.on('leave:room', (roomId) => {
            if (!roomId) return;
            socket.leave(`room:${roomId}`);

            if (roomViewers.has(roomId)) {
                roomViewers.get(roomId).delete(socket.id);
                const count = roomViewers.get(roomId).size;
                io.to(`room:${roomId}`).emit('viewers:count', { count, roomId });
            }
        });

        // ── Cleanup on disconnect ───────────────────────────────
        socket.on('disconnect', () => {
            // Remove from all room viewer sets
            roomViewers.forEach((viewers, roomId) => {
                if (viewers.has(socket.id)) {
                    viewers.delete(socket.id);
                    const count = viewers.size;
                    io.to(`room:${roomId}`).emit('viewers:count', { count, roomId });
                }
            });
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });
};

/**
 * Notify hotel owner of new booking — called from event bus listener
 */
export const notifyOwner = (io, ownerId, payload) => {
    io.to(`owner:${ownerId}`).emit('new:booking', payload);
};

/**
 * Broadcast live availability change for a room — called from event bus listener
 */
export const broadcastAvailability = (io, roomId, available) => {
    io.to(`room:${roomId}`).emit('availability:update', { roomId, available });
};
