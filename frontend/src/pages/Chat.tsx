import ChatBox from "@/components/ChatBox";
import SideBar from "@/components/SideBar";
import { useAuthHook } from "@/store/AuthHook";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  // @ts-expect-error to remove
  const { userId, isSignedIn, checkAuth } = useAuthHook((state) => state);
  const navigator = useNavigate();
  const isSmallScreen = useMediaQuery({ maxWidth: 450 });
  useEffect(() => {
    checkAuth().then(() => {
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
