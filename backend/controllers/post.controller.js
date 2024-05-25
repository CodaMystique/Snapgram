import cloudinary from "cloudinary";
import Post from "../models/post.model.js";
import validatePostData from "../utils/validation/validatePostData.js";
import User from "../models/user.model.js";

export async function createPost(req, res) {
  const { success, error } = validatePostData({
    ...req.body,
    file: req.file,
  });

  const { _id: userId } = req.user;

  if (!success) {
    return res.status(400).json({ success: false, error });
  }

  const { caption, tags, location } = req.body;
  const { buffer, originalname } = req.file;

  const parsedTags = JSON.parse(tags);

  try {
    const base64str = buffer.toString("base64");

    const fileExtension = originalname.split(".").pop().toLowerCase();

    const result = await cloudinary.uploader.upload(
      `data:image/${fileExtension};base64,${base64str}`
    );

    const newPost = new Post({
      creator: req.user._id,
      caption,
      tags: parsedTags,
      imageUrl: result.secure_url,
      imageId: result.public_id,
      location,
    });

    const savedPost = await newPost.save();

    const user = await User.findById(userId);
    user.posts.push(savedPost._id);
    await user.save();

    res
      .status(201)
      .json({ post: savedPost, message: "Post created successfully" });
  } catch (err) {
    console.error("Error in createPost controller: " + err.message);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
}

export async function getPostById(req, res) {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.status(200).json({ post, message: "Post retrieved successfully" });
  } catch (err) {
    console.error("Error in getPost controller: " + err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function editPost(req, res) {
  const { success, error } = validatePostData({
    ...req.body,
  });

  if (!success) {
    return res.status(400).json({ message: error });
  }

  const { postId } = req.params;
  const { caption, tags, location } = req.body;

  const { buffer, originalname } = req.file || {};

  const parsedTags = JSON.parse(tags);

  try {
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    if (buffer && originalname) {
      const base64str = buffer.toString("base64");

      const fileExtension = originalname.split(".").pop().toLowerCase();

      const result = await cloudinary.uploader.upload(
        `data:image/${fileExtension};base64,${base64str}`,
        {
          folder: "post_images",
          public_id: `${Date.now()}`,
          crop: "scale",
        }
      );

      await cloudinary.uploader.destroy(post.imageId);

      post.caption = caption;
      post.tags = parsedTags;
      post.location = location;
      post.imageUrl = result.secure_url;
      post.imageId = result.public_id;
    } else {
      post.caption = caption;
      post.tags = parsedTags;
      post.location = location;
    }

    const updatedPost = await post.save();

    res
      .status(200)
      .json({ post: updatedPost, message: "Post updated successfully" });
  } catch (err) {
    console.error("Error in editPost controller: " + err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function deletePost(req, res) {
  const { postId } = req.params;
  const { _id: userId } = req.user;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    await cloudinary.uploader.destroy(post.imageId);

    user.liked.filter((postId) => postId.equals(post._id));
    await Post.findOneAndDelete(post._id);

    await user.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error in deletePost controller: " + err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function getRecentPosts(req, res) {
  const { limit } = req.query;

  if (limit && parseInt(limit) < 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  try {
    let recentPosts;

    if (limit) {
      recentPosts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .populate({
          path: "creator",
          select: "-password",
        });
    } else {
      recentPosts = await Post.find().sort({ createdAt: -1 }).populate({
        path: "creator",
        select: "-password",
      });
    }

    res.status(200).json({
      posts: recentPosts,
      message: "Posts retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getRecentPosts controller: " + err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function toggleLikePost(req, res) {
  const { postId } = req.params;
  const { _id: userId } = req.user;

  if (!postId || !postId.trim()) {
    return res.status(400).json({ message: "Post id is required" });
  }

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((likeId) => !likeId.equals(userId));
      user.liked = user.liked.filter((postId) => !postId.equals(post._id));
    } else {
      post.likes.push(userId);
      user.liked.push(post._id);
    }

    const updatedPost = await post.save();
    await user.save();

    res.status(200).json({
      post: updatedPost,
      message: `${isLiked ? "Disliked" : "Liked"} successfully `,
    });
  } catch (err) {
    console.error("Error in toggleLikePost controller: " + err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function toggleSavePost(req, res) {
  const { postId } = req.params;
  const { _id: userId } = req.user;

  if (!postId || !postId.trim()) {
    return res.status(400).json({ message: "Post id is required" });
  }

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isSaved = user.saved.includes(post._id);

    if (isSaved) {
      user.saved = user.saved.filter(
        (savedPostId) => !savedPostId.equals(post._id)
      );
    } else {
      user.saved.push(post._id);
    }

    await user.save();

    res.status(200).json({
      message: `${isSaved ? "Unsaved" : "Saved"} successfully `,
    });
  } catch (err) {
    console.error("Error in toggleSavePost controller: " + err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function getSavedPosts(req, res) {
  const { _id: userId } = req.user;
  const { limit } = req.query;

  if (limit && parseInt(limit) < 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  try {
    const user = await User.findById(userId)
      .sort({ createdAt: -1 })
      .populate({
        path: "saved",
        options: { limit: limit ? parseInt(limit) : undefined },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedPosts = user.saved;

    return res.status(200).json({
      posts: savedPosts,
      message: "Saved Posts retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getSavedPosts controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function getUserPosts(req, res) {
  const { limit } = req.query;
  const { userId } = req.params;

  if (!userId || !userId.trim()) {
    return res.status(400).json({ message: "User id is required" });
  }

  if (limit && parseInt(limit) < 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  try {
    const user = await User.findById(userId).populate({
      path: "posts",
      options: { limit: limit ? parseInt(limit) : undefined },
      populate: { path: "creator", select: "-password" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = user.posts;

    return res.status(200).json({
      posts,
      message: "User Posts retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getUserPosts controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function getPosts(req, res) {
  const { cursor, limit } = req.query;

  if (limit && parseInt(limit) < 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  try {
    const parsedLimit = limit ? parseInt(limit) : 10;
    const query = cursor ? { _id: { $gt: cursor } } : {};

    const posts = await Post.find(query)
      .limit(parsedLimit)
      .sort({ _id: 1 })
      .lean()
      .populate({ path: "creator", select: "-password" });

    const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

    return res.status(200).json({ documents: posts, nextCursor });
  } catch (err) {
    console.error("Error in getPosts controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function searchPost(req, res) {
  const { search, limit } = req.query;

  if (!search || !search.trim()) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const searchRegex = new RegExp(search, "i");

    const posts = await Post.find({
      caption: { $regex: searchRegex },
    }).limit(limit ? parseInt(limit) : undefined);

    return res
      .status(200)
      .json({ posts, message: "Searched Posts retrieved successfully" });
  } catch (err) {
    console.error("Error in searchPost controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function getLikedPosts(req, res) {
  const { limit } = req.query;

  if (limit && parseInt(limit) < 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  try {
    const user = await User.findById(req.user._id)
      .populate("liked")
      .limit(limit);

    res.status(200).json({
      posts: user.liked,
      message: "Liked Posts retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getLikedPosts controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}
