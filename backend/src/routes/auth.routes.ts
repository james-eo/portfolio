import express from 'express';
import { login, logout, getMe, updatePassword } from '@/controllers/auth.controller';
import { protect } from '@/middleware/auth.middleware';

const router = express.Router();

// Public
router.post('/login', login);

// Protected (admin only)
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

export default router;
