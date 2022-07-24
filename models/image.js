const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 132,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    image: {
      url: String,
      key: String,
    },
    creator: {
      type: ObjectId,
      ref: "User",
    },
  },
  {timestamps: true }
);

module.exports = mongoose.model("Image", placeSchema);
