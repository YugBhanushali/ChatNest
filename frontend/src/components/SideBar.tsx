import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";
import { generateSlug } from "random-word-slugs";
import { LogOut } from "lucide-react";
import { useAuthHook } from "@/store/AuthHook";
import { useEffect } from "react";
import { ApiCaller, Apiurl } from "@/lib/Api";
import { useRoomHook } from "@/store/ChatHook";
import JoinRoomModal from "./JoinRoomModal";
import { useNavigate } from "react-router-dom";
import { MinidenticonImg } from "./RoomIcon";
import { useRoomsHook } from "@/store/RoomsHook";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { ModeToggle } from "./ModeToggle";

const groupName: Array<string> = [];
for (let index = 0; index < 20; index++) {
  groupName.push(generateSlug());
}

const SideBar = () => {
  const { userId, checkAuth, username, signOut } = useAuthHook(
    (state) => state
  );
  const { roomId, setCurrRoom, setRoomToNull } = useRoomHook((state) => state);
  const { rooms, setUserRooms } = useRoomsHook((state) => state);
  const navigator = useNavigate();

  const handleDelete = async () => {
    const res = await fetch(
      `${Apiurl}/api/room/remove-user/${roomId}/${userId}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    if (data) {
      null;
    }
    setRoomToNull();
  };

  const handleLogOut = async () => {
    const { data, status } = await ApiCaller(
      `logout?userId=${userId}`,
      "GET",
      {}
    );
    console.log(data);
    signOut();
    navigator("/");
    if (status === 200) {
      null;
    }
  };

  useEffect(() => {
    checkAuth().then(() => {
      // groups(room)
      setUserRooms(userId);
    });
  }, [userId]);

  useEffect(() => {
    setUserRooms(userId);
  }, [rooms]);

  return (
    <div className="flex border flex-col sm:w-[25%] w-full h-full rounded-md sm:border-r-0 sm:rounded-tr-none sm:rounded-br-none justify-between">
      <div className="flex justify-between w-full items-center">
        <div className="flex text-[21px] font-bold ml-4 mt-1 py-3">
          👋 Hi {username}
        </div>
        <div className="mr-2">
          <ModeToggle />
        </div>
      </div>
      <hr />
      <div className="flex flex-col p-2">
        <div className="flex flex-col mt-0 h-[75vh] overflow-y-auto">
          {rooms?.length !== 0 ? (
            rooms?.map((group: any) => {
              return (
                <div
                  key={group.roomId}
                  className={`flex justify-between items-center gap-x-2 my-1 cursor-pointer ${group.roomId == roomId ? `bg-secondary` : ``} hover:bg-secondary p-2 rounded-md`}
                  onClick={() => setCurrRoom(group?.roomId)}
                >
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex justify-center items-center h-8 w-8 rounded-full border p-1">
                      {/* <img
                          src="https://github.com/shadcn.png"
                          className=" rounded-full"
                        /> */}
                      {group?.roomImg ? (
                        <MinidenticonImg
                          username={group.roomImg}
                          saturation={90}
                          width="150"
                          height="150"
                        />
                      ) : (
                        <MinidenticonImg
                          username="dsflkddfdflksdfj"
                          saturation={90}
                          width="150"
                          height="150"
                        />
                      )}
                    </div>
                    <div className=" text-bold text-[20px]">
                      {group?.roomId}
                    </div>
                  </div>

                  {group.roomId == roomId ? (
                    <div className="flex justify-end">
                      <div
                        className="flex border hover:bg-destructive rounded-md justify-end p-2"
                        onClick={handleDelete}
                      >
                        <IoMdRemoveCircleOutline size={13} />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="flex w-full px-5 justify-center items-center mt-20 text-center">
              <div className="text-[15px] font-bold">
                No rooms found. Please join the room to start chat
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <Separator />
      </div>
      <div className="flex flex-col w-full gap-y-1 p-2">
        <JoinRoomModal />
        <Button
          variant={"default"}
          className="flex gap-x-2 w-full"
          onClick={handleLogOut}
        >
          <LogOut />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
