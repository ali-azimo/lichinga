import mongoose from "mongoose";

const listarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      required: function() {
        return this.type === 'casa' || this.type === 'apartamento';
      },
    },
    bedroom: {
      type: Number,
      required: function() {
        return this.type === 'casa' || this.type === 'apartamento';
      },
    },
    finished: {
      type: Boolean,
      required: function() {
        return this.type === 'casa' || this.type === 'apartamento' || this.type === 'obra';
      },
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "casa",
        "apartamento",
        "terreno",
        "machamba",
        "obra",
      ],
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["venda", "arrendar"],
      default: "venda",
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
        views: {
            type: Number,
            default: 0,
        },
        shares: {
            type: Number,
            default: 0,
        },
    likes: {
      type: Number,
      default: 0
    },
    area: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

const Listar = mongoose.model("Listar", listarSchema);
export default Listar;