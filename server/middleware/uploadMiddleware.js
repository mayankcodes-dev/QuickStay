import multer from 'multer';

const upload = multer({storage: multer.diskStorage({})});

// Support both: import upload from '...' AND import { upload } from '...'
export { upload };
export default upload;