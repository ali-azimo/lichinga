import { Message, Conversation } from '../models/message.model.js';
import User from '../models/user.model.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate({
      path: 'participants',
      select: 'username avatar'
    })
    .sort({ updatedAt: -1 });

    const conversationsWithDetails = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== req.user.id);
      return {
        ...conv.toObject(),
        otherParticipant,
        unreadCount: conv.unreadCount || 0
      };
    });

    res.json(conversationsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return res.status(404).json({ message: 'Conversa não encontrada' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username avatar');

    // Marcar mensagens como lidas
    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user.id }, read: false },
      { $set: { read: true } }
    );

    // Resetar contador de não lidas
    conversation.unreadCount = 0;
    await conversation.save();

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, receiverId } = req.body;

    let conversation;
    
    if (conversationId) {
      // Conversa existente
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversa não encontrada' });
      }
    } else {
      // Nova conversa
      conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, receiverId] }
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [req.user.id, receiverId]
        });
        await conversation.save();
      }
    }

    // Criar mensagem
    const message = new Message({
      conversation: conversation._id,
      sender: req.user.id,
      content,
      read: false
    });

    await message.save();

    // Atualizar conversa
    conversation.lastMessage = content;
    if (message.sender.toString() !== req.user.id) {
      conversation.unreadCount += 1;
    }
    conversation.updatedAt = new Date();
    await conversation.save();

    // Popular sender para resposta
    await message.populate('sender', 'username avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    })
    .populate({
      path: 'participants',
      select: 'username avatar'
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, receiverId]
      });
      await conversation.save();
      
      await conversation.populate({
        path: 'participants',
        select: 'username avatar'
      });
    }

    const otherParticipant = conversation.participants.find(p => p._id.toString() !== req.user.id);

    res.json({
      ...conversation.toObject(),
      otherParticipant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};