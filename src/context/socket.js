import { io } from "socket.io-client";
import { useMemo, createContext } from "react";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    return io("https://webservice-nbbv.onrender.com", {
      withCredentials: true,
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
