import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userRef: {
      type: String,
      required: true,
    },
    listingRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);
export default Like;
