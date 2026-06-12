/**
 * scheduler.js — Background cron jobs for YoYo Rooms
 *
 * Jobs:
 *  1. Auto-cancel unpaid pending bookings older than 30 minutes (every 15 min)
 *  2. Send check-in reminder emails (daily at 8 AM IST)
 *
 * Uses: node-cron (standard 5-field cron expressions)
 */

import cron from 'node-cron';
import Booking     from '../models/Booking.js';
import User        from '../models/User.js';
import Room        from '../models/Room.js';
import transporter from '../configs/nodemailer.js';

// ── Helper: send check-in reminder email ─────────────────────────
const sendReminderEmail = async (toEmail, username, booking, room) => {
    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f6fc;font-family:'Inter',Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:#E8003D;padding:28px 24px;text-align:center">
      <span style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-1px">YoYo Rooms</span>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">⏰ Check-In Tomorrow!</p>
    </div>
    <div style="padding:32px 24px">
      <p style="font-size:16px;color:#0d0d1a">Hi <strong>${username}</strong>,</p>
      <p style="font-size:14px;color:#4a4a6a">Your check-in is <strong>tomorrow</strong>. Get ready for a great stay!</p>
      <div style="background:#f6f6fc;border-radius:12px;padding:20px;margin:20px 0">
        <p style="margin:4px 0;font-size:14px;color:#0d0d1a"><strong>🏨 Hotel:</strong> ${room?.hotel?.name || 'Your Hotel'}</p>
        <p style="margin:4px 0;font-size:14px;color:#0d0d1a"><strong>📍 City:</strong> ${room?.hotel?.city || ''}</p>
        <p style="margin:4px 0;font-size:14px;color:#0d0d1a"><strong>📅 Check-In:</strong> ${new Date(booking.checkInDate).toDateString()}</p>
        <p style="margin:4px 0;font-size:14px;color:#0d0d1a"><strong>📅 Check-Out:</strong> ${new Date(booking.checkOutDate).toDateString()}</p>
      </div>
      <p style="font-size:12px;color:#8888aa">Booking ID: ${booking._id}</p>
    </div>
    <div style="background:#f6f6fc;padding:16px;text-align:center">
      <p style="color:#8888aa;font-size:12px;margin:0">© 2025 YoYo Rooms. Have a wonderful stay! 🌟</p>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
        from: `"YoYo Rooms" <${process.env.SENDER_EMAIL}>`,
        to:   toEmail,
        subject: `📅 Check-In Tomorrow — ${room?.hotel?.name || 'Your Booking'}`,
        html,
    }).catch(err => console.warn('[Cron] Reminder email failed:', err.message));
};

// ── Job 1: Auto-cancel unpaid pending bookings ────────────────────
// Runs every 15 minutes
// Cancels bookings created > 30 min ago with status 'pending' and isPaid = false
const autoCancelUnpaid = async () => {
    try {
        const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 min ago
        const result = await Booking.updateMany(
            {
                status:    'pending',
                isPaid:    false,
                createdAt: { $lt: cutoff },
            },
            {
                $set: {
                    status:      'cancelled',
                    cancelledAt: new Date(),
                    refundStatus:'none',
                },
            }
        );
        if (result.modifiedCount > 0) {
            console.log(`[Cron] Auto-cancelled ${result.modifiedCount} unpaid bookings`);
        }
    } catch (err) {
        console.error('[Cron] autoCancelUnpaid error:', err.message);
    }
};

// ── Job 2: Check-in reminders ─────────────────────────────────────
// Runs every day at 8:00 AM IST (2:30 AM UTC)
// Sends email to users whose check-in date is tomorrow
const sendCheckInReminders = async () => {
    try {
        const tomorrow      = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
        const tomorrowEnd   = new Date(tomorrow.setHours(23, 59, 59, 999));

        const bookings = await Booking.find({
            checkInDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
            status:      { $ne: 'cancelled' },
            reminderSent:{ $ne: true },   // avoid double-sending
        }).populate('user room');

        for (const booking of bookings) {
            if (!booking.user?.email) continue;
            const room = await Room.findById(booking.room).populate('hotel');
            await sendReminderEmail(booking.user.email, booking.user.username, booking, room);
            // Mark as sent to prevent duplicate
            await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
        }

        if (bookings.length > 0) {
            console.log(`[Cron] Sent ${bookings.length} check-in reminders`);
        }
    } catch (err) {
        console.error('[Cron] sendCheckInReminders error:', err.message);
    }
};

// ── Register all jobs ─────────────────────────────────────────────
export const startScheduler = () => {
    // Every 15 minutes: auto-cancel unpaid bookings
    cron.schedule('*/15 * * * *', autoCancelUnpaid);

    // Every day at 8:00 AM IST = 2:30 AM UTC
    cron.schedule('30 2 * * *', sendCheckInReminders, {
        timezone: 'Asia/Kolkata',
    });

    console.log('📅 [Scheduler] Cron jobs started:');
    console.log('   - Auto-cancel unpaid bookings: every 15 min');
    console.log('   - Check-in reminders: daily at 8 AM IST');
};
