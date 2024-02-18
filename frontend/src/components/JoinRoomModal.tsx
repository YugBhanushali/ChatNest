import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PiChatCircle } from "react-icons/pi";
import { Input } from "./ui/input";
import { useSocketContext } from "@/Context/SocketWrapper";
import { useAuthHook } from "@/store/AuthHook";
import { useEffect, useState } from "react";
import { useRoomsHook } from "@/store/RoomsHook";

const JoinRoomModal = () => {
  const [roomId, setroomId] = useState<string>();
  const socket = useSocketContext();
  const { userId } = useAuthHook((state) => state);
  const { setUserRooms } = useRoomsHook();

  const handleJoinRoom = () => {
    if (userId !== "") {
      socket.emit("joinRoom", {
        userId: userId,
        roomId: roomId,
      });
    }
    // getAllRooms();
    setUserRooms(userId);
  };

  useEffect(() => {
    socket.on("joined", (data: any) => {
      console.log(data, "--- room");
    });
    return () => {
      socket.off();
    };
  }, []);
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} className="flex gap-x-1 w-full">
          <PiChatCircle size={18} />
          <span>Join Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col justify-center">
          <div>
            <DialogTitle>Join Room</DialogTitle>
            <DialogDescription>
              Enter the code to join the room
            </DialogDescription>
          </div>
          <div className="flex flex-col mt-4 gap-2">
            <Input
              className="flex mt-3"
              type="text"
              onChange={(e) => setroomId(e.target.value)}
            />
            <DialogClose>
              <Button
                className="flex w-full"
                variant={"default"}
                onClick={handleJoinRoom}
              >
                Join Room
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomModal;
