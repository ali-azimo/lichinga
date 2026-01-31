import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation
} from '../controllers/message.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/conversations', verifyToken, getConversations);
router.get('/:conversationId', verifyToken, getMessages);
router.post('/send', verifyToken, sendMessage);
router.get('/start/:receiverId', verifyToken, getOrCreateConversation);

export default router;