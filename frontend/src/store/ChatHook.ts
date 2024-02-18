import { ApiCaller } from "@/lib/Api";
import { create } from "zustand";

type currRoomProps = {
  roomId: string;
  users: [];
  messages: [];
  roomImg?: string;

  setCurrRoom: (data: any) => Promise<void>;

  setRoomToNull: () => void;
};

export const useRoomHook = create<currRoomProps>((set) => ({
  roomId: "",
  users: [],

  messages: [],

  setCurrRoom: async (roomId1: any) => {
    const { data, status } = await ApiCaller(`api/room/${roomId1}`, "GET", {});

    if (status == 200) {
      // @ts-expect-error to remove
      const { users, messages, roomImg } = data.room;
      // @ts-expect-error to remove
      set((state) => ({
        roomId: roomId1,
        users: users,
        messages: messages,
        roomImg: data?.room?.roomImg ? data?.room?.roomImg : "dsflkddfdflksdfj",
      }));
    }
  },
  setRoomToNull: () => {
    set({ roomId: "", users: [], messages: [], roomImg: "" });
  },
}));
