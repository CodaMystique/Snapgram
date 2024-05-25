import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui";
import { Search } from "@/assets";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchPosts, searchPost, getSavedPosts } from "@/lib/http";
import { Loader } from "@/components/shared";
import { GridPostList } from "@/components/shared";
import useDebounce from "@/hooks/useDebounce";
import { useAuthContext } from "@/context/AuthContext";

function SearchResults({ isSearchFetching, searchedPosts, savedPostsIds }) {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} savedPostsIds={savedPostsIds} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
}

function Explore() {
  const { authUser } = useAuthContext();
  const { ref, inView } = useInView();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingPosts,
  } = useInfiniteQuery({
    queryKey: ["infinite-posts"],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, limit: 9 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { data: savedPosts, isLoading: isSavedPostsLoading } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: getSavedPosts,
  });

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useQuery({
    queryKey: ["search-posts", debouncedSearch],
    queryFn: () => searchPost({ searchQuery: debouncedSearch }),
    enabled: !!debouncedSearch,
  });

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);

  if (isLoadingPosts || isSavedPostsLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item.documents.length === 0);

  const savedPostsIds = savedPosts.map((post) => post._id);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src={Search} width={24} height={24} alt="search" />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        {/* <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src={Filter} width={20} height={20} alt="filter" />
        </div> */}
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
            savedPostsIds={savedPostsIds}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((page, index) => (
            <GridPostList
              key={`page-${index}`}
              posts={page.documents}
              savedPostsIds={savedPostsIds}
            />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Explore;
