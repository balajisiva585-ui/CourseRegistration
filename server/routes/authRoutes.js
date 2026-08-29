import express from 'express';
import { loginUser, registerStudent, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerStudent);
router.get('/profile', protect, getProfile);

export default router;
