"use server";

import User from "../api/userApi";

export async function createUser(data) {
  return await User.create(data);
}

export async function getUserByToken(token) {
  return await User.findByToken(token);
}

export async function getAllUser() {
  return await User.findAll();
}

export async function loginUser(data) {
  return await User.login(data);
}

export async function updateUserInfo(id, data) {
  return await User.updateUserInfo(id, data);
}

export async function updateUserPassword(id, data) {
  return await User.updatePassword(id, data);
}

export async function deleteUser(id) {
  return await User.delete(id);
}