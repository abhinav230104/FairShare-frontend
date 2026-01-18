import api from "./axios";

export const getMyRooms = async () => {
    const res=await api.get("/rooms/my");
    return res.data;
}
export const createRoom =(name) => api.post("/rooms/create", { name });
export const joinRoom = (roomId) => api.post("/rooms/join",{roomId});

export const getRoomDetails = async (roomId) => {
    const res= await api.get(`/rooms/${roomId}`);
    return res.data;
}

