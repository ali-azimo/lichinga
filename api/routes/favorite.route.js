import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} from '../controllers/favorite.controller.js';

const router = express.Router();

router.get('/:userId', verifyToken, getUserFavorites);
router.post('/add/:listingId', verifyToken, addFavorite);
router.delete('/remove/:listingId', verifyToken, removeFavorite);
router.get('/check/:listingId', verifyToken, checkFavorite);

export default router;