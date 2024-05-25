import mongoose from "mongoose";
import isValidEmail from "../utils/validation/isValidEmail.js";
import isStrongPassword from "../utils/validation/isStrongPassword.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 30,
      minlength: 1,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 30,
      minlength: 1,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [isValidEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: [
        isStrongPassword,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      ],
    },
    bio: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageId: {
      type: String,
      default: "",
    },
    posts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    },
    liked: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    },
    saved: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    followings: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
