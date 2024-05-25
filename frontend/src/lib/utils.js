import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file) => URL.createObjectURL(file);

export function multiFormatDateString(timestamp = "") {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date = new Date(timestampNum * 1000);
  const now = new Date();

  const diff = now.getTime() - date.getTime();
  const diffInSeconds = diff / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
}

export function checkIsLiked(likeList, userId) {
  return likeList.includes(userId);
}

export function checkIsSaved(savedList, postId) {
  return savedList.includes(postId);
}

export function getRelatedPost(post, posts) {
  const relatedPosts = [];

  const postTags = post.tags;

  posts.forEach((otherPost) => {
    if (otherPost._id !== post._id) {
      const otherPostTags = otherPost.tags;

      const commonTags = postTags.filter((tag) => otherPostTags.includes(tag));

      if (commonTags.length > 0) {
        relatedPosts.push(otherPost);
      }
    }
  });

  return relatedPosts;
}
