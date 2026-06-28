import User from '../models/User.js';
import { Webhook } from 'svix';
import { ok, fail } from '../utils/respond.js';

// Build the common user payload from Clerk event data
const clerkUserPayload = (data) => ({
    _id:      data.id,
    email:    data.email_addresses[0].email_address,
    username: `${data.first_name || ''} ${data.last_name || ''}`.trim()
              || data.email_addresses[0].email_address,
    image:    data.image_url,
});

const clerkWebhooks = async (req, res) => {
    try {
        const whook  = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            'svix-id':        req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        await whook.verify(JSON.stringify(req.body), headers);
        const { type, data } = req.body;

        switch (type) {
            case 'user.created':  await User.create(clerkUserPayload(data)); break;
            case 'user.updated':  await User.findByIdAndUpdate(data.id, clerkUserPayload(data), { new: true }); break;
            case 'user.deleted':  await User.findByIdAndDelete(data.id); break;
        }

        ok(res, { message: 'Webhook received successfully' });
    } catch (err) {
        fail(res, err.message);
    }
};

export default clerkWebhooks;