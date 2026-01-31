import Like from "../models/like.model.js";
import Listing from "../models/listar.model.js";
import { errorHandler } from "../utils/error.js";
export const toggleLike = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    const existingLike = await Like.findOne({
      userRef: userId,
      listingRef: listingId,
    });

    let totalLikes;
    
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
     await Listing.findByIdAndUpdate(
        listingId,
        { $inc: { likes: -1 } },
        { new: true }
      );
            const updatedListing = await Listing.findById(listingId);
      totalLikes = updatedListing.likes || 0;
      
      return res.status(200).json({ 
        liked: false,
        totalLikes 
      });
    }
    const newLike = await Like.create({
      userRef: userId,
      listingRef: listingId,
    });
    await Listing.findByIdAndUpdate(
      listingId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    const updatedListing = await Listing.findById(listingId);
    totalLikes = updatedListing.likes || 0;

    res.status(201).json({ 
      liked: true, 
      like: newLike,
      totalLikes 
    });
  } catch (error) {
    next(error);
  }
};

export const getLikesByListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const totalLikes = await Like.countDocuments({
      listingRef: listingId,
    });

    const listing = await Listing.findById(listingId);
    const listingLikes = listing?.likes || 0;

    res.status(200).json({ 
      totalLikes,
      listingLikes 
    });
  } catch (error) {
    next(error);
  }
};

export const checkUserLike = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;
    const like = await Like.findOne({
      userRef: userId,
      listingRef: listingId,
    });
    const listing = await Listing.findById(listingId);
    const totalLikes = listing?.likes || 0;
    res.status(200).json({ 
      liked: !!like,
      totalLikes 
    });
  } catch (error) {
    next(error);
  }
};