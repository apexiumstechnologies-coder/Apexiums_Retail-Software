import mongoose from "mongoose";

const wholesalerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    wholesalerId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    businessName: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      default: "wholesaler",
      enum: ["wholesaler"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wholesaler", wholesalerSchema);