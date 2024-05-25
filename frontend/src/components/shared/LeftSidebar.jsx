import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { logout as logoutRequest } from "@/lib/http";
import { ProfilePlaceholder, Logo, Logout } from "@/assets/";

function LeftSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { authUser, setAuthUser, setIsAuthenticated } = useAuthContext();

  const { mutate: logout } = useMutation({
    mutationFn: logoutRequest,
    onError: (error) => {
      toast({
        title: error.info?.message || "Sign up failed. Please try again later",
      });
    },
    onSuccess: () => {
      localStorage.removeItem("snapgram_user_data");
      setAuthUser(null);
      setIsAuthenticated(false);
      navigate("/");
    },
  });

  async function handleLogout(e) {
    logout();
  }

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src={Logo} alt="logo" width={170} height={36} />
        </Link>

        <Link
          to={`/profile/${authUser._id}`}
          className="flex gap-3 items-center"
        >
          <img
            src={authUser.imageUrl || ProfilePlaceholder}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{authUser.name}</p>
            <p className="small-regular text-light-3">@{authUser.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={handleLogout}
      >
        <img src={Logout} alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
}

export default LeftSidebar;
