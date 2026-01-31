import Favorite from '../models/favorite.model.js';
import Listing from '../models/listar.model.js';
import { errorHandler } from '../utils/error.js';

export const getUserFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId }).populate('listingId');
    const favoriteListings = favorites.map(fav => fav.listingId);
    res.status(200).json(favoriteListings);
  } catch (error) {
    next(error);
  }
};
export const addFavorite = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Propriedade não encontrada'));
    }
    const existingFavorite = await Favorite.findOne({ userId, listingId });
    if (existingFavorite) {
      return res.status(200).json({ 
        success: true, 
        message: 'Já está nos favoritos',
        favorite: existingFavorite 
      });
    }
    const favorite = await Favorite.create({
      userId,
      listingId
    });

    await Listing.findByIdAndUpdate(listingId, {
      $inc: { likes: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Adicionado aos favoritos',
      favorite
    });
  } catch (error) {
    next(error);
  }
};
export const removeFavorite = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;
    const favorite = await Favorite.findOne({ userId, listingId });
    if (!favorite) {
      return next(errorHandler(404, 'Favorito não encontrado'));
    }
    await Favorite.findOneAndDelete({ userId, listingId });
    await Listing.findByIdAndUpdate(listingId, {
      $inc: { likes: -1 }
    });
    res.status(200).json({
      success: true,
      message: 'Removido dos favoritos'
    });
  } catch (error) {
    next(error);
  }
};
export const checkFavorite = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({ userId, listingId });
    
    res.status(200).json({
      success: true,
      liked: !!favorite,
      favoriteId: favorite?._id
    });
  } catch (error) {
    next(error);
  }
};
export const countListingFavorites = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    
    const count = await Favorite.countDocuments({ listingId });
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};