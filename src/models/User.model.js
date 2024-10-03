import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: {
    type: String, // cloudnary url
    require: true,
  },
  coverImage: {
    type: String, // cloudnary url
  },
  dob: {
    type: Date,
    // require: true,
  },
  password: {
    type: String,
    require: true,
    trim: [true, "Password is required"],
  },
  
});

export const UserModal = mongoose.model("user", UserSchema);
