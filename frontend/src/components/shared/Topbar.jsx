import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "@/context/AuthContext";
import { Button } from "../ui/button";

import { logout as logoutRequest } from "@/lib/http";
import { Logo, Logout, ProfilePlaceholder } from "@/assets";

function Topbar() {
  const navigate = useNavigate();
  const { authUser, setAuthUser, setIsAuthenticated } = useAuthContext();

  const { mutate: logout } = useMutation({
    mutationFn: logoutRequest,
    onError: (error) => {
      toast({
        title: error.info?.message || "Sign up failed. Please try again later",
      });
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      localStorage.removeItem("snapgram_user_data");
      setAuthUser(null);
      navigate("/");
    },
  });

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src={Logo} alt="logo" width={130} height={325} />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={logout}
          >
            <img src={Logout} alt="logout" />
          </Button>
          <Link to={`/profile/${authUser._id}`} className="flex-center gap-3">
            <img
              src={authUser.imageUrl || ProfilePlaceholder}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Topbar;
