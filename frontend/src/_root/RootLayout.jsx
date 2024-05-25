import { Outlet, Navigate } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";

import { useAuthContext } from "@/context/AuthContext";

function RootLayout() {
  const { isAuthenticated } = useAuthContext();

  return !isAuthenticated ? (
    <Navigate to={"/login"} />
  ) : (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
}

export default RootLayout;
