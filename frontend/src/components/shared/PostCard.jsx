import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import PostStats from "@/components/shared/PostStats";
import { Edit } from "@/assets";
import { ProfilePlaceholder } from "@/assets";

function PostCard({ post, savedPostIds }) {
  const { authUser } = useAuthContext();

  return (
    <div className="post-card p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator._id}`}>
            <img
              src={post.creator.imageUrl || ProfilePlaceholder}
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex items-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.createdAt)}
              </p>
              <span>•</span>
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        {authUser._id === post.creator._id && (
          <Link to={`/edit-post/${post._id}`}>
            <img src={Edit} alt="edit" className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        )}
      </div>

      <Link to={`/post/${post._id}`} className="block mt-4">
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || ProfilePlaceholder}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats
        post={post}
        userId={authUser._id}
        savedPostIds={savedPostIds}
      />
    </div>
  );
}

export default PostCard;
