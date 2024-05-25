import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";

import { LoginValidation } from "@/lib/validation";
import { login as loginRequest } from "@/lib/http";

import { useAuthContext } from "@/context/AuthContext";
import { Logo } from "@/assets";

function LoginForm() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setAuthUser, setIsAuthenticated } = useAuthContext();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: loginRequest,
    onError: (error) => {
      toast({
        title: error.info?.message || "Login failed. Please try again later",
      });
    },
    onSuccess: (data) => {
      localStorage.setItem("snapgram_user_data", JSON.stringify(data.user));
      setAuthUser(data.user);
      setIsAuthenticated(true);
    },
  });

  function handleLogin(user) {
    login(user);
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src={Logo} alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Log in to continue
        </p>

        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <div className="flex-center gap-2">
                <Loader /> Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account yet?
            <Link
              to="/signup"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default LoginForm;
