import React, { useState } from "react";
import {
  useParams,
  useLocation,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { getUserById } from "@/lib/http";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GridPostList } from "@/components/shared";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui";
import { LikedPosts } from "@/_root/pages";
import { ProfilePlaceholder, Edit, Posts, Like } from "@/assets";
import {
  toggleFollowUser as toggleFollowUserRequest,
  getUserPosts as getUserPostsRequest,
} from "@/lib/http";
import { useToast } from "@/components/ui";

function StatBlock({ value, label }) {
  return (
    <div className="flex-center gap-2">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
  );
}

function Profile() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { authUser: user } = useAuthContext();
  const { toast } = useToast();

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById({ userId: id }),
  });

  const { data: userPosts, isLoading: isUserPostLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getUserPostsRequest({ userId: id }),
  });

  const { isPending, mutate: toggleFollowUser } = useMutation({
    mutationFn: toggleFollowUserRequest,
    onError: (err) =>
      toast({
        title: err.info?.message || "Failed to follow. Please try again later",
      }),
  });

  const [isFollowing, setIsFollowing] = useState(
    currentUser?.followers.some((followerId) => followerId === user._id)
  );

  const [isFollowedByUser, setIsFollowedByUser] = useState(
    currentUser?.followings.some((followingId) => followingId === user._id)
  );

  if (isUserPostLoading || isUserLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  function handleToggleFollow() {
    setIsFollowing(!isFollowing);
    setIsFollowedByUser(!isFollowedByUser);
    toggleFollowUser({ userId: currentUser._id });
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || ProfilePlaceholder}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock
                value={currentUser.followers.length}
                label="Followers"
              />
              <StatBlock
                value={currentUser.followings.length}
                label="Following"
              />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user._id !== currentUser._id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser._id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg`}
              >
                <img src={Edit} alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>

            <div className={`${user._id === currentUser._id && "hidden"}`}>
              <Button
                type="button"
                className="shad-button_primary px-8"
                disabled={isPending}
                onClick={handleToggleFollow}
              >
                {isPending ? (
                  <Loader />
                ) : isFollowing ? (
                  "Unfollow"
                ) : isFollowedByUser ? (
                  "Follow Back"
                ) : (
                  "Follow"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser._id === user._id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img src={Posts} alt="posts" width={20} height={20} />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img src={Like} alt="like" width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={
            userPosts.length > 0 ? (
              <GridPostList
                posts={userPosts}
                showUser={false}
                savedPostsIds={currentUser.saved}
              />
            ) : (
              <p className="text-light-4">Not any post yet.</p>
            )
          }
        />
        {currentUser._id === user._id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
}

export default Profile;
