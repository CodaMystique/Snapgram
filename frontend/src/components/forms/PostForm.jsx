import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { FileUploader, Loader } from "@/components/shared";
import {
  createPost as createPostRequest,
  editPost as editPostRequest,
} from "@/lib/http";
import { queryClient } from "@/lib/utils";

import { useMutation } from "@tanstack/react-query";

function PostForm({ post, action }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(PostValidation(action === "Create")),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const { mutate: createPost, isPending: isLoadingCreate } = useMutation({
    mutationFn: createPostRequest,
    onError: (err) => {
      toast({
        title: err.info?.message || `Create post failed. Please try again.`,
      });
    },
    onSuccess: () => {
      navigate("/");
    },
  });
  const { mutate: updatePost, isPending: isLoadingUpdate } = useMutation({
    mutationFn: editPostRequest,
    onError: (err, _, context) => {
      toast({
        title: err.info?.message || `Update post failed. Please try again.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", post._id]);
      navigate(`/post/${post._id}`);
    },
  });

  function handleSubmit(data) {
    if (post && action === "Update") {
      const updatedPost = updatePost({
        postId: post._id,
        caption: data.caption,
        tags: data.tags.split(",").map((tag) => tag.trim()),
        image: data.file[0],
        location: data.location,
      });
      return;
    }

    createPost({
      caption: data.caption,
      tags:
        data.tags.trim() === ""
          ? []
          : data.tags.split(",").map((tag) => tag.trim()),
      image: data.file[0],
      location: data.location,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
