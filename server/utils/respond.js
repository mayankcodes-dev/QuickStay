/**
 * Shared response helpers — keeps controllers DRY.
 *
 *   ok(res, data)        → 200 { success: true, ...data }
 *   fail(res, msg, status) → 4xx/5xx { success: false, message }
 */

export const ok   = (res, data = {})        => res.json({ success: true, ...data });
export const fail = (res, msg, status = 400) => res.status(status).json({ success: false, message: msg });
