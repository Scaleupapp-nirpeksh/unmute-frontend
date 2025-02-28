import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (token) => {
  socket = io(process.env.REACT_APP_SOCKET_URL, {
    auth: { token }
  });
  return socket;
};

export const getSocket = () => socket;