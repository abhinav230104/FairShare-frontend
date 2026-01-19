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

// Update room name
export const updateRoomName = async (roomId, name) =>{
  const res= await api.patch(`/rooms/${roomId}/updateRoomName`, { name });
  return res.data;
};

export const deleteRoom = async (roomId) =>{
  const res= await api.delete(`/rooms/${roomId}/deleteRoom`);
  return res.data;
};

export const leaveRoom = async (roomId) =>{
  const res= await api.post(`/rooms/${roomId}/leaveRoom`);
  return res.data;
};


// Add member (admin)
export const addMember = async (roomId, userId) =>{
  const res= await api.post(`/rooms/${roomId}/addMember`, { userId });
  return res.data;
};

export const removeMember = async (roomId, memberDbId) => {
  const res= await api.delete(`/rooms/${roomId}/removeMember/${memberDbId}`);
  return res.data;
};

export const updateMemberRole = async (roomId, memberDbId, role) => {
  const res= await api.patch(`/rooms/${roomId}/updateRole/${memberDbId}`, { role });
  return res.data;
};
export const getRoomSettlementStatus = async (roomId) => {
  const res= api.get(`/rooms/${roomId}/roomSettlementStatus`);
  return res.data;
};
