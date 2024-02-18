import { ApiCaller } from "@/lib/Api";
import { create } from "zustand";

type UserDataProp = {
  isSignedIn: boolean;
  userId: string;
  username: string;
  email: string;
  signIn: (data: any) => void;
  signOut: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthHook = create<UserDataProp>((set) => ({
  isSignedIn: false,
  userId: "",
  username: "",
  email: "",

  signIn: (data: any) => {
    set({
      isSignedIn: true,
      userId: data.userId,
      username: data.username,
      email: data.email,
    });
  },

  signOut: () => {
    set({ isSignedIn: false, userId: "", username: "", email: "" });
    localStorage.setItem("authToken", "");
  },

  checkAuth: async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const { data, status } = await ApiCaller(
        "api/check-login",
        "GET",
        {},
        {
          authorization: String(token),
        }
      );

      if (status === 200) {
        const userData = await ApiCaller(`api/user/${data.userId}`, "GET", {});
        if (userData.status === 200) {
          const { username, email } = userData.data.user;
          set({ isSignedIn: true, userId: data.userId, username, email });
        }
      } else {
        // If check-login API returns other than 200, user is not authenticated
        set({ isSignedIn: false, userId: "", username: "", email: "" });
      }
    } else {
      // No token found, user is not authenticated
      set({ isSignedIn: false, userId: "", username: "", email: "" });
    }
  },
}));
