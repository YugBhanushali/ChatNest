import ChatBox from "@/components/ChatBox";
import SideBar from "@/components/SideBar";
import { useAuthHook } from "@/store/AuthHook";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  // @ts-ignore testing
  const { userId, isSignedIn, checkAuth } = useAuthHook((state) => state);
  const navigator = useNavigate();
  const isSmallScreen = useMediaQuery({ maxWidth: 450 });
  useEffect(() => {
    checkAuth().then((data: any) => {
      console.log(data);

      if (!isSignedIn) {
        navigator("/auth");
      } else {
        navigator("/chat");
      }
    });
  }, [userId]);

  return (
    <div className="flex p-2 w-full h-[100vh]">
      {/* sidebar */}
      {!isSmallScreen ? <SideBar /> : null}

      {/* chat box */}
      <ChatBox />
    </div>
  );
};

export default Chat;
