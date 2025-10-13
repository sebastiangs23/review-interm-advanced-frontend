import type { User } from "../types/user.d.ts"

export const getUsers = async () => {
  try {

    const storedUsers = localStorage.getItem("users");
    let response: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const storedCurrentUser = localStorage.getItem("currentUser");
    let responseCurrentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : null;
    const data = response?.filter((user: any) => {
      
      return user.id != responseCurrentUser?.id;
    });
    console.log('data', data)
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editUser = (id: number, updatedUser: User) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const index = users.findIndex((user: User) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    localStorage.setItem("users", JSON.stringify(users));
  }
};

export const addUser = (user: User) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const deleteUser = (id: number) => {
  if (!confirm("Are you sure you want to delete this user?")) return;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const updatedUsers = users.filter((user: User) => user.id !== id);
  localStorage.setItem("users", JSON.stringify(updatedUsers));
};