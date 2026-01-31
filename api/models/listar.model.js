import mongoose from "mongoose";

const listarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["casa", "apartamento", "terreno", "machamba", "obra"],
    },

    transactionType: {
      type: String,
      enum: ["venda", "arrendar"],
      default: "venda",
      required: true,
    },

    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.regularPrice;
        },
        message: "O preço com desconto não pode ser maior que o preço normal",
      },
    },

    bathroom: {
      type: Number,
      min: 0,
      required: function () {
        return this.type === "casa" || this.type === "apartamento";
      },
    },

    bedroom: {
      type: Number,
      min: 0,
      required: function () {
        return this.type === "casa" || this.type === "apartamento";
      },
    },

    finished: {
      type: Boolean,
      required: function () {
        return (
          this.type === "casa" ||
          this.type === "apartamento" ||
          this.type === "obra"
        );
      },
    },

    parking: {
      type: Boolean,
      required: function () {
        return this.type === "casa" || this.type === "apartamento";
      },
    },

    offer: {
      type: Boolean,
      required: true,
    },

    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 2;
        },
        message: "Deve enviar no mínimo 2 imagens",
      },
    },

    area: {
      type: Number,
      default: 0,
      min: 0,
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
      default: 0,
    },
  },
  { timestamps: true }
);

const Listar =
  mongoose.models.Listar || mongoose.model("Listar", listarSchema);

export default Listar;
