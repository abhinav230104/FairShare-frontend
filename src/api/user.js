import api from "./axios";

export const getUserById = async (user_id) => {
  const res = await api.get(`/${user_id}/getUserById`);
  return res.data;
};


