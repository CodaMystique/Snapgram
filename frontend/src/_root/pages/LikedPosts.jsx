import React from "react";
import { getLikedPosts } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { GridPostList, Loader } from "@/components/shared";

function LikedPosts() {
  const { data: likedPosts, isLoading } = useQuery({
    queryKey: ["liked-posts"],
    queryFn: getLikedPosts,
  });

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {likedPosts.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={likedPosts} showStats={false} />
    </>
  );
}

export default LikedPosts;
