import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { useRoomHook } from "@/store/ChatHook";
import { useAuthHook } from "@/store/AuthHook";
import { useSocketContext } from "@/Context/SocketWrapper";
import { MinidenticonImg } from "./RoomIcon";
import SheetForMobile from "./SheetForMobile";
import { useMediaQuery } from "react-responsive";

const ChatBox = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currUserMsg, setcurrUserMsg] = useState<string>();
  const { roomId, setCurrRoom, messages, roomImg } = useRoomHook(
    (state) => state
  );
  const isSmallScreen = useMediaQuery({ maxWidth: 450 });
  const { userId } = useAuthHook((state) => state);
  const socket = useSocketContext();

  const handleSendMsg = () => {
    const tempObj = {
      roomId: roomId,
      userId: userId,
      message: currUserMsg,
    };

    socket.emit("room-message", tempObj);
    setcurrUserMsg("");
    setCurrRoom(roomId);
  };

  useEffect(() => {
    // setCurrRoom("room1");

    socket.emit("addToRoom", roomId);

    socket.on("room-msg", (data: any) => {
      console.log(data.roomId);
      setCurrRoom(data?.roomId);
    });
  }, [roomId, messages]);

  useEffect(() => {
    // Scroll to the bottom of the messages whenever a new message appears
    if (messagesEndRef.current) {
      const { clientHeight, scrollHeight } = messagesEndRef.current;
      messagesEndRef.current.scrollTop = scrollHeight - clientHeight;
      console.log(clientHeight, scrollHeight);
    }
  }, [messages]);

  return (
    <div className="flex border flex-col sm:w-[74%] w-full  h-full p-0 rounded-md">
      {roomId === "" ? (
        <div className="flex flex-col justify-center items-center mt-20 gap-y-2">
          <div className=" text-[21px] font-bold">
            Please Select the room to chat
          </div>
          {isSmallScreen ? <SheetForMobile /> : null}
        </div>
      ) : (
        <>
          {/* group name */}
          <div className="flex h-9 justify-between rounded-full sm:w-full w-full items-center my-3">
            <div className="flex items-center gap-x-2 ml-3">
              <div className="flex w-9 h-9 justify-center items-center border p-1 rounded-full">
                {roomImg ? (
                  <MinidenticonImg
                    username={roomImg}
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
              <div className=" text-[20px] font-bold">{roomId}</div>
            </div>
            {isSmallScreen ? (
              <div className="flex justify-end">
                <SheetForMobile />
              </div>
            ) : null}
          </div>

          <hr />
          <div className="flex flex-col justify-between h-[90vh]">
            {/* group chat */}
            <div
              ref={messagesEndRef}
              className="flex h-[95%] w-full overflow-y-auto"
            >
              <Messages currUser={userId} props={messages} />
            </div>

            {/* chat box */}
            <div className="flex h-[8 %] p-2 w-full gap-1">
              <div className="w-full">
                {/* <Textarea
              rows={2}
              cols={2}
              placeholder="type your message here"
              className=" h-10"
            /> */}
                <Input
                  type="text"
                  placeholder="type your message here"
                  value={currUserMsg}
                  onChange={(e) => {
                    setcurrUserMsg(e.target.value);
                  }}
                />
              </div>
              <div>
                <Button type="button" variant="default" onClick={handleSendMsg}>
                  <SendHorizontalIcon />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

type messageUIProps = {
  userName?: string;
  userId?: string;
  currUser?: boolean;
  message: string;
};

const MessageUI = ({ userName, userId, currUser, message }: messageUIProps) => {
  console.log(userId);
  return (
    <div className="my-1">
      {currUser ? (
        <div className=" flex dark:bg-transparent px-3 bg-white border rounded-xl p-2">
          {message}
        </div>
      ) : (
        <div className=" flex flex-col text-white justify-start bg-blue-500 border rounded-xl p-2">
          <div className=" text-[10px]  text-gray-300">{userName}</div>
          <div>{message}</div>
        </div>
      )}
    </div>
  );
};

const Messages = ({ props, currUser }: { props: any; currUser: string }) => {
  return (
    <div className="flex flex-col w-full h-full">
      {props?.length !== 0 ? (
        props?.map((message: any) => {
          console.log(currUser);

          const temp: messageUIProps = {
            userName: message.userName,
            userId: message.userId,
            message: message.message,
            currUser: message.userId === currUser ? true : false,
          };
          return (
            <>
              {currUser === message.userId ? (
                <div className="flex justify-end mx-1">
                  <MessageUI {...temp} />
                </div>
              ) : (
                <div className="flex justify-start mx-1">
                  <MessageUI {...temp} />
                </div>
              )}
            </>
          );
        })
      ) : (
        <div className="flex justify-center mt-20">No messages yet</div>
      )}
    </div>
  );
};

export default ChatBox;
