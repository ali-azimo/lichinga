import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  toggleLike,
  getLikesByListing,
  checkUserLike,
} from "../controllers/like.controller.js";

const router = express.Router();

// like / unlike
router.post("/toggle/:listingId", verifyToken, toggleLike);

// total de likes por listing
router.get("/count/:listingId", getLikesByListing);

// verificar se o user deu like
router.get("/check/:listingId", verifyToken, checkUserLike);

export default router;
