import { GridPostList, Loader } from "@/components/shared";
import { useQuery } from "@tanstack/react-query";
import { getSavedPosts } from "@/lib/http";
import { useAuthContext } from "@/context/AuthContext";
import { Save } from "@/assets";

function Saved() {
  const { authUser } = useAuthContext();

  const { data: savePosts, isLoading } = useQuery({
    queryKey: ["saved-posts", authUser._id],
    queryFn: getSavedPosts,
  });

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src={Save}
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
}

export default Saved;
