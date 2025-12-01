import type { User } from "../types/user.d.ts"

export const logIn = (username: any, password: any) => {
  try{
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find((user) => user.username === username && user.password === password);

    if(!user){
      alert("Invalid username or password");
      return;
    }else {
      localStorage.setItem("currentUser", JSON.stringify(user));
      return {
        status: "success",
        message: "Welcome!"
      }
    }
  }catch(error: any){
    alert("Something went wrong");
  }
}

export const getUsers = async () => {
  try {

    const storedUsers = localStorage.getItem("users");
    let response: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const storedCurrentUser = localStorage.getItem("currentUser");
    let responseCurrentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : null;
    const data = response?.filter((user: any) => {
      
      return user.email != responseCurrentUser?.email;
    });
    
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editUser = (email: string, updatedUser: User) => {
  // const users = JSON.parse(localStorage.getItem("users") || "[]");
  // const index = users.findIndex((user: User) => user.username === id);
  // if (index !== -1) {
  //   users[index] = { ...users[index], ...updatedUser };
  //   localStorage.setItem("users", JSON.stringify(users));
  // }
};

export const addUser = (user: User) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const deleteUser = (email: string) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "[]");
  if (currentUser.email === email) alert("You cannot delete yourself");

  if (!confirm("Are you sure you want to delete this user?")) return;
 
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const filteredUsers = users.filter((user: User) => user.email !== email);
  localStorage.setItem("users", JSON.stringify(filteredUsers));

  return {
    status: 200,
    message: "User deleted successfully"
  }
};

export const logOut = () => {
  try {
    localStorage.removeItem("currentUser");
  }catch(error){
    console.log(error);
    alert("Something went wrong");
  }
}