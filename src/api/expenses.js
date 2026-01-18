import api from "./axios";

export const getRoomExpenses = (roomId) =>
  api.get(`/rooms/${roomId}/expenses`);

export const addExpense = (roomId, expenseData) =>
  api.post(`/rooms/${roomId}/expenses`, expenseData);

export const deleteExpense = (roomId, expenseId) =>
  api.delete(`/rooms/${roomId}/expenses/${expenseId}`);

export const getRoomBalances = (roomId) =>
  api.get(`/rooms/${roomId}/balances`);

export const getRoomSettlements = (roomId) =>
  api.get(`/rooms/${roomId}/settlements`);
