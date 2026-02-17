import type { User, submodulesPermission } from "../types/user.d.ts";
import { subModules } from "../utils/common.js";

export const logIn = (email: any, password: any) => {
  try {
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    } else {
      localStorage.setItem("currentUser", JSON.stringify(user));
      return {
        status: "success",
        message: "Welcome!",
      };
    }
  } catch (error: any) {
    alert("Something went wrong");
  }
};

export const getUsers = async () => {
  try {
    const storedUsers = localStorage.getItem("users");
    let response: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const storedCurrentUser = localStorage.getItem("currentUser");
    let responseCurrentUser = storedCurrentUser
      ? JSON.parse(storedCurrentUser)
      : null;
    const data = response?.filter((user: any) => {
      return user.email != responseCurrentUser?.email;
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editUser = (email: string, updatedUser: User) => {
  const users = JSON.parse(localStorage.getItem("users") || "");
  const userIndex = users.findIndex((user: User) => user.email === email);

  if (userIndex === -1) {
    return {
      status: 404,
      message: "User not found",
    };
  }

  users[userIndex] = updatedUser;

  localStorage.setItem("users", JSON.stringify(users));
};

export const addUser = (user: User) => {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some((u: User) => u.email === user.email)) {
      return {
        status: 400,
        message: "User with this email already exists",
      };
    }

    const subModulesPermissions: submodulesPermission[] = [];
    subModules.map((module) => {
      subModulesPermissions.push({
        submodule: module.name,
        access: true,
        icon: module.name,
      });
    });

    user.submodules = subModulesPermissions;
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    return {
      status: 200,
      message: "User added successfully",
    };
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = (email: string) => {
  try {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );

    if (currentUser?.email === email) {
      return {
        status: 400,
        message: "You cannot delete yourself",
      };
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const filteredUsers = users.filter((user: User) => user.email !== email);

    localStorage.setItem("users", JSON.stringify(filteredUsers));

    return {
      status: 200,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      status: 400,
      message: error || "An error occurred while deleting the user",
    };
  }
};

export const logOut = () => {
  try {
    localStorage.removeItem("currentUser");
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};
