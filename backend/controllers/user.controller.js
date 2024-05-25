import cloudinary from "cloudinary";
import User from "../models/user.model.js";

export async function getRecentUsers(req, res) {
  const { limit } = req.query;

  if (limit && parseInt(limit) < 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  try {
    let users;
    if (limit) {
      users = await User.find().sort({ createdAt: -1 }).limit(limit);
    } else {
      users = await User.find().sort({ createdAt: -1 });
    }

    res.status(200).json({ users, message: "Users retrieved successfully" });
  } catch (err) {
    console.error("Error in getRecentUsers", err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({ users, message: "Users retrieved successfully" });
  } catch (err) {
    console.error("Error in getUsers", err.message);
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({ user, message: "User retrieved successfully" });
  } catch (err) {}
}

export async function toggleFollowUser(req, res) {
  const { userId: userToFollowId } = req.params;
  const { _id: currentUserId } = req.user;

  if (userToFollowId === currentUserId) {
    return res.status(400).json({ message: "You cannot follow yourself." });
  }

  try {
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found." });
    }

    const isFollowing = userToFollow.followers.includes(currentUserId);

    if (isFollowing) {
      userToFollow.followers = userToFollow.followers.filter(
        (followerId) => followerId.toString() !== currentUserId.toString()
      );
      await userToFollow.save();

      currentUser.followings = currentUser.followings.filter(
        (followingId) => followingId.toString() !== userToFollowId.toString()
      );
      await currentUser.save();

      return res.status(200).json({ message: "User unfollowed successfully." });
    } else {
      userToFollow.followers.push(currentUserId);
      await userToFollow.save();

      currentUser.followings.push(userToFollowId);
      await currentUser.save();

      return res.status(200).json({ message: "User followed successfully." });
    }
  } catch (err) {
    console.error("Error in toggleFollowUser", err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

// export async function updateProfile(req, res) {
//   try {
//     const { name, bio } = req.body;
//     const userId = req.user._id;

//     // Check if an image is uploaded
//     let imageUrl = req.user.imageUrl;
//     let imageId = req.user.imageId;

//     if (req.file) {
//       // Upload the image to Cloudinary
//       const result = await cloudinary.v2.uploader.upload(req.file.path, {
//         folder: "profile_pics",
//         public_id: `${Date.now()}`,
//         crop: "scale",
//       });

//       if (imageId || imageId.trim()) {
//         await cloudinary.v2.uploader.destroy(currentImageId);
//       }

//       // Update the imageUrl and imageId fields
//       imageUrl = result.secure_url;
//       imageId = result.public_id;
//     }

//     // Update the user document
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { name, bio, imageUrl, imageId },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

export async function updateProfile(req, res) {
  const user = req.user;
  const { name, bio } = req.body;

  const imageId = user.imageId;
  const { buffer, originalname } = req.file || {};

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (buffer && originalname) {
      const base64str = buffer.toString("base64");

      const fileExtension = originalname.split(".").pop().toLowerCase();

      const result = await cloudinary.uploader.upload(
        `data:image/${fileExtension};base64,${base64str}`
      );

      if (imageId) {
        await cloudinary.uploader.destroy(imageId);
      }

      user.name = name;
      user.bio = bio;
      user.imageUrl = result.secure_url;
      user.imageId = result.public_id;
    } else {
      user.name = name;
      user.bio = bio;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error in updateProfile", err.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}
