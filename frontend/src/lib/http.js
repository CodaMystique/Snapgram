import { SignupValidation, LoginValidation } from "./validation";

// Function for user signup
export async function signup({ name, username, email, password }) {
  const credentials = SignupValidation.parse({
    name,
    username,
    email,
    password,
  });

  const response = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while signing up");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

// Function for user login
export async function login({ email, password }) {
  const credentials = LoginValidation.parse({
    email,
    password,
  });

  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while logging in");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

// Function for user logout
export async function logout() {
  const response = await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while logging out");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
}

// Function for creating a post
export async function createPost({ caption, tags, image, location }) {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("tags", JSON.stringify(tags));
  formData.append("image", image);
  formData.append("location", location);

  const response = await fetch("http://localhost:3000/api/posts", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the post");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

// Function for editing a post
export async function editPost({ postId, caption, tags, image, location }) {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("tags", JSON.stringify(tags));
  formData.append("image", image);
  formData.append("location", location);

  const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while editing the post");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

// Function for getting a post by its ID
export async function getPostById({ postId }) {
  if (!postId || !postId.trim()) {
    throw new Error("Post id is required");
  }

  const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while getting post by id");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.post;
}

// Function for deleting a post
export async function deletePost({ postId }) {
  if (!postId || !postId.trim()) {
    throw new Error("Post id is required");
  }

  const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the post");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

// Function for getting recent posts
export async function getRecentPosts({ limit }) {
  if (limit && limit < 0) {
    throw new Error("Limit must be a positive number");
  }

  const response = await fetch(
    `http://localhost:3000/api/posts/recent${limit ? `?limit=${limit}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while getting recent posts");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.posts;
}

// Function for toggling like on a post
export async function toggleLikePost({ postId }) {
  if (!postId || !postId.trim()) {
    throw new Error("Post id is required");
  }

  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/toggle-like`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while toggling like");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

// Function for toggling save on a post
export async function toggleSavePost({ postId }) {
  if (!postId || !postId.trim()) {
    throw new Error("Post id is required");
  }

  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/toggle-save`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while toggling save");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

// Function for getting saved posts
export async function getSavedPosts({ limit }) {
  if (limit && limit < 0) {
    throw new Error("Limit must be a positive number");
  }

  const response = await fetch(
    `http://localhost:3000/api/posts/saved${limit ? `?limit=${limit}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while getting saved posts");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.posts;
}

// Function for getting user's posts
export async function getUserPosts({ limit, userId }) {
  if (limit && limit < 0) {
    throw new Error("Limit must be a positive number");
  }

  if (!userId || !userId.trim()) {
    throw new Error("User id is required");
  }

  const response = await fetch(
    `http://localhost:3000/api/posts/user/${userId}${limit ? `?${limit}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while getting user posts");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.posts;
}

// Function for getting recent users
export async function getRecentUsers({ limit }) {
  if (limit && limit < 0) {
    throw new Error("Limit must be a positive number");
  }

  const response = await fetch(
    `http://localhost:3000/api/user/recent${limit ? `?limit=${limit}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while getting recent users");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.users;
}

export async function fetchPosts({ pageParam = null, limit = 9 }) {
  const response = await fetch(
    `http://localhost:3000/api/posts${
      pageParam ? `?cursor=${pageParam}&limit=${limit}` : `?limit=${limit}`
    }`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while getting posts");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data;
}

export async function searchPost({ searchQuery, limit }) {
  if (limit && limit < 0) {
    throw new Error("Limit must be a positive number");
  }

  if (!searchQuery || !searchQuery.trim() === "") {
    throw new Error("Search query is required");
  }

  const response = await fetch(
    `http://localhost:3000/api/posts/search?search=${searchQuery}${
      limit ? `?limit=${limit}` : ""
    }`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while searching posts");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.posts;
}

export async function fetchUsers() {
  const response = await fetch(`http://localhost:3000/api/user`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching users");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.users;
}

export async function getUserById({ userId }) {
  if (!userId || !userId.trim()) {
    throw new Error("User id is required");
  }

  const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while getting user by id");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.user;
}

export async function getLikedPosts({ limit }) {
  if (limit && parseInt(limit) < 0) {
    throw new Error("Limit must be a positive number");
  }

  const response = await fetch(
    `http://localhost:3000/api/posts/liked-posts${
      limit ? `?limit=${limit}` : ""
    }`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while getting liked posts");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data.posts;
}

export async function toggleFollowUser({ userId }) {
  if (!userId || !userId.trim()) {
    throw new Error("User id is required");
  }

  const response = await fetch(
    `http://localhost:3000/api/user/${userId}/toggle-follow`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while toggling follow");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

export async function updateProfile({ name, bio, image }) {
  console.log(image);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  formData.append("image", image);

  const response = await fetch(
    `http://localhost:3000/api/user/update-profile`,
    {
      credentials: "include",
      method: "PUT",
      body: formData,
    }
  );

  const data = await response.json();

  console.log(data);

  return data.user;
}
