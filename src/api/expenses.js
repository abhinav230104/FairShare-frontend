import api from "./axios";

export const getExpenses = async (roomId) => {
  const res = await api.get(`/rooms/expense/${roomId}/getExpense`);
  return res.data;
};

export const addExpense = async (roomId, expenseData) => {
  const res = await api.post(`/rooms/expense/${roomId}/addExpense`, expenseData);
  return res.data;
};

export const deleteExpense = async (roomId, expenseId) => {
  const res = await api.delete(
    `/rooms/expense/${roomId}/deleteExpense/${expenseId}`
  );
  return res.data;
};

export const getBalances = async (roomId) => {
  const res = await api.get(`/rooms/expense/${roomId}/getBalance`);
  return res.data;
};

export const getSettlements = async (roomId) => {
  const res = await api.get(`/rooms/expense/${roomId}/getSettlement`);
  return res.data;
};

