import { ApiCaller } from "@/lib/Api";
import { create } from "zustand";

type roomsProp = {
  rooms: [];

  setUserRooms: (userId: string) => Promise<void>;
};

export const useRoomsHook = create<roomsProp>((set) => ({
  rooms: [],
  setUserRooms: async (userId: string) => {
    const { data, status } = await ApiCaller(
      "user/rooms",
      "POST",
      { userId: userId },
      { "Content-Type": "application/json" }
    );
    if (status === 200) {
      set({ rooms: data.rooms });
    }
  },
}));
