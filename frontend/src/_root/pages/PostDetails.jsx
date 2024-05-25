import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button, useToast } from "@/components/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";

import {
  getPostById as getPostByIdRequest,
  deletePost as deletePostRequest,
  getUserPosts as getUserPostsRequest,
  getSavedPosts as getSavedPostsRequest,
} from "@/lib/http";
import { multiFormatDateString } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";

import { Back, Delete, Edit, ProfilePlaceholder } from "@/assets";

import { getRelatedPost } from "@/lib/utils";

function PostDetails() {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { authUser: user } = useAuthContext();

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostByIdRequest({ postId: id }),
  });

  const { data: userPosts, isLoading: isUserPostLoading } = useQuery({
    queryKey: ["posts", post?.creator._id],
    queryFn: () => getUserPostsRequest({ userId: post?.creator._id }),
  });

  const { data: savedPosts, isLoading: isSavedPostsLoading } = useQuery({
    queryKey: ["saved-posts", user._id],
    queryFn: getSavedPostsRequest,
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: () => deletePostRequest({ postId: id }),
    onError: (err) => {
      toast({
        title: err.info?.message || "Delete post failed. Please try again.",
      });
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const relatedPosts = post && userPosts ? getRelatedPost(post, userPosts) : [];
  const savedPostIds = savedPosts && savedPosts.map((post) => post._id);

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img src={Back} alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPostLoading || isSavedPostsLoading ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post.imageUrl} alt="creator" className="post_details-img" />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post.creator._id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={post.creator.imageUrl || ProfilePlaceholder}
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post.createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/edit-post/${post._id}`}
                  className={`${user._id !== post.creator._id && "hidden"}`}
                >
                  <img src={Edit} alt="edit" width={24} height={24} />
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger
                    variant="ghost"
                    className={`ost_details-delete_btn ${
                      user._id !== post.creator._id && "hidden"
                    }`}
                  >
                    <img src={Delete} alt="delete" width={24} height={24} />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-dark-1 rounded-lg shadow-lg">
                    <AlertDialogHeader className="px-2 py-1">
                      <AlertDialogTitle className="text-light-1 base-medium lg:body-bold">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-light-3 small-medium lg:base-regular mt-2">
                        This action cannot be undone. This will permanently
                        delete your post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="px-2 py-1 flex justify-end gap-1">
                      <AlertDialogCancel className="shad-button_ghost">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePost({ postId: post._id })}
                        className="shad-button_primary px-5"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats
                post={post}
                userId={user._id}
                savedPostIds={savedPostIds}
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || isPostLoading || isSavedPostsLoading ? (
          <Loader />
        ) : relatedPosts.length > 0 ? (
          <GridPostList posts={relatedPosts} savedPostsIds={savedPostIds} />
        ) : (
          <p className="text-light-4 mt-10 text-center w-full">
            No related post found
          </p>
        )}
      </div>
    </div>
  );
}

export default PostDetails;
