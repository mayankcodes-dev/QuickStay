import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload }  from '../middleware/uploadMiddleware.js';
import { registerHotel, updateHotel, getOwnerHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

hotelRouter.post('/',       protect, registerHotel);
hotelRouter.patch('/',      protect, upload.single('image'), updateHotel);
hotelRouter.get('/owner',   protect, getOwnerHotel);

export default hotelRouter;