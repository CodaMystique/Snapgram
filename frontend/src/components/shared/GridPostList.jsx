import React from "react";
import { Link } from "react-router-dom";
import { PostStats } from "@/components/shared";
import { useAuthContext } from "@/context/AuthContext";
import { ProfilePlaceholder } from "@/assets";

function GridPostList({
  posts,
  showUser = true,
  showStats = true,
  savedPostsIds,
}) {
  const { authUser } = useAuthContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post._id} className="relative min-w-80 h-80">
          <Link to={`/post/${post._id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post.creator.imageUrl || ProfilePlaceholder}
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && (
              <PostStats
                post={post}
                userId={authUser._id}
                savedPostIds={savedPostsIds}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default GridPostList;
