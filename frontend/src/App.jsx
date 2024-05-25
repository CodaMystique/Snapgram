import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/utils";

import RootLayout from "@/_root/RootLayout.jsx";
import {
  Home,
  Explore,
  Saved,
  AllUsers,
  CreatePost,
  EditPost,
  PostDetails,
  Profile,
  UpdateProfile,
} from "./_root/pages/";

import AuthLayout from "@/_auth/AuthLayout.jsx";
import { LoginForm, SignupForm } from "@/_auth/forms/index.js";
import { Toaster } from "@/components/ui/toaster";

import { AuthContextProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginForm /> },
      { path: "/signup", element: <SignupForm /> },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/explore", element: <Explore /> },
      { path: "/saved", element: <Saved /> },
      { path: "/all-users", element: <AllUsers /> },
      { path: "/create-post", element: <CreatePost /> },
      { path: "/edit-post/:id", element: <EditPost /> },
      { path: "/post/:id", element: <PostDetails /> },
      { path: "/profile/:id/*", element: <Profile /> },
      { path: "/update-profile/:id", element: <UpdateProfile /> },
    ],
  },
]);

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <main className="flex h-screen">
          <RouterProvider router={router}></RouterProvider>
        </main>
        <Toaster></Toaster>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}
export default App;
