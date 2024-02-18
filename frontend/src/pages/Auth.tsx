import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useAuthHook } from "@/store/AuthHook";
import { TailSpin } from "react-loader-spinner";
import { ApiCaller } from "@/lib/Api";
import Navbar from "@/components/Navbar";

const nanoid = customAlphabet("1234567890qwertyuiopasdfghjklzxcvbnm", 10);

const Auth = () => {
  const test = useAuthHook((state) => state);
  const [isLoading, setisLoading] = useState(false);
  const [signIn, setsignIn] = useState<boolean>(true);
  const [userData, setuserData] = useState<{
    password: "";
    email: "";
    username: "";
  }>();
  const navigator = useNavigate();

  const handleAuth = async () => {
    setisLoading(true);
    if (signIn) {
      const userObj = {
        email: String(userData?.email),
        password: String(userData?.password),
      };
      const { data, status } = await ApiCaller("login", "POST", userObj);
      console.log(data);
      if (status == 200) {
        console.log(data);
        test.signIn({
          userId: data.user.userId,
          username: data.user.username,
          email: data.user.email,
        });
        navigator("/chat");
        localStorage.setItem("authToken", data?.token);
        localStorage.setItem("authStatus", "true");
        setisLoading(false);
      }
      console.log(data);
    } else {
      // @ts-ignore testing
      const { data, status } = await ApiCaller("signup", "POST", {
        userId: nanoid(),
        username: String(userData?.username),
        email: String(userData?.email),
        password: String(userData?.password),
      });
      if (status == 200) {
        navigator("/chat");
      }
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigator("/chat");
      test.checkAuth().then(() => {
        if (test.isSignedIn) {
          navigator("/chat");
        }
      });
    } else {
      null;
    }
  }, [test]);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Navbar />
      <div className="flex justify-center items-center mt-[150px]">
        <Card className="w-[380px] p-4">
          <CardHeader className="flex justify-center items-center">
            <CardTitle>Welcome to ChatApp</CardTitle>
            <CardDescription>
              {signIn
                ? "Log In with userId and password"
                : "Please write information to create account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <form className="flex justify-start items-center">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email</Label>
                  <Input
                    id="name"
                    type="email"
                    placeholder="example.com"
                    onChange={(e) => {
                      setuserData((prev: any) => {
                        return { ...prev, email: e.target.value };
                      });
                    }}
                  />
                </div>
                {signIn ? null : (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">User name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="yug123"
                      onChange={(e) => {
                        setuserData((prev: any) => {
                          return { ...prev, username: e.target.value };
                        });
                      }}
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Password</Label>
                  <Input
                    id="password"
                    placeholder="12345678"
                    type="password"
                    onChange={(e) => {
                      setuserData((prev: any) => {
                        return { ...prev, password: e.target.value };
                      });
                    }}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col justify-center items-center w-full">
            <div className="w-full">
              <Button
                variant="default"
                type="button"
                onClick={() => handleAuth()}
                className="w-full"
              >
                {isLoading ? (
                  <TailSpin height={18} width={18} color="white" />
                ) : signIn ? (
                  "Log In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
            <div className=" text-sm mt-1">
              {signIn ? (
                <>
                  Don't have an Acccount?
                  <span
                    onClick={() => setsignIn(false)}
                    className=" text-blue-600 cursor-pointer"
                  >
                    Create account
                  </span>
                </>
              ) : (
                <>
                  Already have an account.
                  <span
                    onClick={() => setsignIn(true)}
                    className=" text-blue-600 cursor-pointer"
                  >
                    Log In
                  </span>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
