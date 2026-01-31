import Notification from '../models/notification.model.js';
import Listing from '../models/listar.model.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('sender', 'username avatar')
      .populate('listing', 'name imageUrls');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'Todas as notificações marcadas como lidas' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notificação excluída' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotification = async (userId, type, message, listingId = null, senderId = null) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      message,
      listing: listingId,
      sender: senderId
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};