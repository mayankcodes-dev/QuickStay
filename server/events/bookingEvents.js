/**
 * bookingEvents.js — Central event bus using Node.js EventEmitter.
 * 
 * Architecture pattern: Event-Driven / Publisher-Subscriber
 * - Controllers emit events (publish)
 * - Listeners handle side-effects (email, sockets, analytics) — decoupled from business logic
 * 
 * Events emitted:
 *   booking:created  → { booking, user, room }
 *   booking:cancelled → { booking, user }
 *   booking:statusChanged → { booking, newStatus }
 */

import { EventEmitter } from 'events';

class BookingEventBus extends EventEmitter {}

export const bookingBus = new BookingEventBus();

// Prevent memory leak warnings for many listeners
bookingBus.setMaxListeners(20);
