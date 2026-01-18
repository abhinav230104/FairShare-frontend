import api from "./axios";

export const getMyRooms = () => api.get("/rooms/my");
export const createRoom = (name) => api.post("/rooms", { name });
export const joinRoom = (roomId) => api.post(`/rooms/${roomId}/join`);
export const getRoomDetails = (roomId) => api.get(`/rooms/${roomId}`);
