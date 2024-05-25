import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    caption: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    imageId: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
