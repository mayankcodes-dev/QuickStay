import User from '../models/User.js';
import { Webhook } from 'svix';

const clerkWebhooks = async (req, res) => {
    try {
        console.log('Webhook type:', req.body?.type);
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // Verifying the headers
        console.log('⏳ Verifying webhook signature...');
        await whook.verify(JSON.stringify(req.body), headers);
        console.log('✅ Webhook signature verified');

        //Getting DATA from the request body
        const { type, data } = req.body;

        // Switch case for different webhook events
        switch (type) {
            case "user.created": {

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                
                console.log('User data to create:', userData);
                await User.create(userData);

                break;
            }

            case "user.updated": {

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                console.log('User data to update:', userData);
                await User.findByIdAndUpdate(data.id, userData, { new: true });
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);

                break;
            }


        }

        res.json({ success: true, message: "Webhook received successfully" });


    } catch (err) {
        console.error('Webhook error:', err.message);
        res.json({ success: false, message: err.message });
    }
}

export default clerkWebhooks;