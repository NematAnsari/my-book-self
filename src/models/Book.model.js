import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      require: true,
    },

    coverImage: {
      type: String, // cloudnary url
      require: true,
    },

    summary: {
      type: String,
      require: true,
      trim: true,
    },
    pageCount: {
      type: Number,
      require: true,
    },
    language: {
      type: String,
      require: true,
    },
    publisher: {
      type: String,
      require: true,
    },
    format: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      require: true,
    },
    pdfPath: { type: String },
    tags: {
      type: [String],
    },
    format: { type: String, enum: ["hardcover", "paperback", "ebook"] },
   
    price: { type: Number },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const BookModel = mongoose.model("book", BookSchema);
