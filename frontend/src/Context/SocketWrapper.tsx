import { createContext, useContext } from "react";
import io from "socket.io-client";

const socketUri = import.meta.env.VITE_SOCKET_URL;
const server = io(String(socketUri));

const SocketContext = createContext({});

export const useSocketContext = () => {
  const { socket } = useContext<any>(SocketContext);
  return socket;
};

export const ScoketPorvider = ({ children }: { children: React.ReactNode }) => {
  const socket = server;
  return (
    <>
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    </>
  );
};
