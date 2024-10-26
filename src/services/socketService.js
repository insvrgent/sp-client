import { io } from 'socket.io-client';

let socket;

export const connectSocket = (shopId, userId) => {
  socket = io('http://localhost:5000');

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    
    // Emit login event with shopId and userId
    socket.emit('login', { shopId, userId });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
};

export const getSocket = () => {
  return socket;
};
