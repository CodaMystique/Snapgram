import { useParams } from "react-router-dom";

import { Loader } from "@/components/shared";
import PostForm from "@/components/forms/PostForm";
import { getPostById } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "@/assets";

function EditPost() {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById({ postId: id }),
  });

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src={Edit}
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" post={post} />}
      </div>
    </div>
  );
}

export default EditPost;
