import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { fetchUsers } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

function AllUsers() {
  const { toast } = useToast();

  const { data: creators, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    onError: (err) => {
      console.log(err);
      toast({ title: "Something went wrong." });
    },
  });

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.map((creator) => (
              <li key={creator?._id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AllUsers;
