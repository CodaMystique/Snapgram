import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Like, Liked, Save, Saved } from "@/assets";
import { checkIsLiked, checkIsSaved } from "@/lib/utils";
import {
  toggleLikePost as toggleLikePostRequest,
  toggleSavePost as toggleSavePostRequest,
} from "@/lib/http";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";

function PostStats({ post, userId, savedPostIds }) {
  const location = useLocation();

  const [likes, setLikes] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(checkIsSaved(savedPostIds, post._id));
  const [isLiked, setIsLiked] = useState(checkIsLiked(likes, userId));

  const { mutate: toggleLikePost } = useMutation({
    mutationFn: toggleLikePostRequest,
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries(["post", postId]);

      const previousPost = queryClient.getQueryData(["posts", postId]);

      queryClient.setQueryData(["posts", postId], (oldData) => ({
        ...oldData,
        likes: isLiked
          ? [...oldData.likes, userId]
          : oldData.likes.filter((id) => id !== userId),
      }));

      return { previousPost };
    },
    onError: (err, { postId }, context) => {
      if (context.previousPost) {
        queryClient.setQueryData(["posts", postId], context.previousPost);
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries(["posts", data.post._id]);
    },
  });

  const { mutate: toggleSavePost } = useMutation({
    mutationFn: toggleSavePostRequest,
  });

  function handleToggleLike() {
    setLikes((prevLikes) =>
      isLiked ? prevLikes.filter((id) => id !== userId) : [...prevLikes, userId]
    );
    setIsLiked((prevIsLiked) => !prevIsLiked);
    toggleLikePost({ postId: post._id });
  }

  function handleToggleSave() {
    setIsSaved((prevIsSaved) => !prevIsSaved);
    toggleSavePost({ postId: post._id });
  }

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div
        className="flex gap-2 mr-5 cursor-pointer"
        onClick={handleToggleLike}
      >
        <img src={isLiked ? Liked : Like} alt="like" width={20} height={20} />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 cursor-pointer" onClick={handleToggleSave}>
        <img src={isSaved ? Saved : Save} alt="save" width={20} height={20} />
      </div>
    </div>
  );
}

export default PostStats;
