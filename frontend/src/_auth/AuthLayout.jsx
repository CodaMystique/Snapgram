import { Outlet, Navigate } from "react-router-dom";

import { useAuthContext } from "@/context/AuthContext";
import { SideImg } from "@/assets";

function AuthLayout() {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src={SideImg}
            alt="side-img"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
}

export default AuthLayout;
