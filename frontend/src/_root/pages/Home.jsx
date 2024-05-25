import React from "react";
import { PostCard, UserCard } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getRecentPosts, getRecentUsers } from "@/lib/http";
import Loader from "@/components/shared/Loader";
import { useAuthContext } from "@/context/AuthContext";
import { getSavedPosts } from "@/lib/http";

function Home() {
  const { authUser } = useAuthContext();

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isErrorPosts,
    error: errorPosts,
  } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: () => getRecentPosts({ limit: 20 }),
  });

  const { data: savedPosts, isLoading: isSavedPostsLoading } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: getSavedPosts,
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isErrorUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: ["recent-users"],
    queryFn: () => getRecentUsers({ limit: 10 }),
  });

  return (
    <div className="flex flex-1">
      <div className="home-container">
        {isErrorPosts ? (
          <p className="body-medium text-light-1">
            {errorPosts.info?.message || "Something bad happened"}
          </p>
        ) : (
          <div className="home-posts">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
            {isPostsLoading || isSavedPostsLoading ? (
              <Loader />
            ) : posts.length > 0 ? (
              <ul className="flex flex-col flex-1 gap-9 w-full ">
                {posts.map((post) => (
                  <li key={post._id} className="flex justify-center w-full">
                    <PostCard
                      post={post}
                      savedPostIds={savedPosts.map((post) => post._id)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No post found</p>
            )}
          </div>
        )}
      </div>
      {isErrorUsers ? (
        <p className="body-medium text-light-1">
          {errorUsers.info?.message || "Something bad happened"}
        </p>
      ) : (
        <div className="home-creators">
          <h3 className="h3-bold text-light-1">Top Creators</h3>
          {isUsersLoading && !users ? (
            <Loader />
          ) : (
            <ul className="grid 2xl:grid-cols-2 gap-6">
              {users.length > 0 ? (
                users.map((users) => (
                  <li key={users._id}>
                    <UserCard user={users} />
                  </li>
                ))
              ) : (
                <p>No recent user found</p>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
