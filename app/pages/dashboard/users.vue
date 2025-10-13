<script setup>
import { ref, onMounted } from "vue";
import { getUsers, editUser, deleteUser } from "../../utils/utils.ts";

definePageMeta({
  layout: "modules",
});

const users = ref([]);
const showModal = ref(false);
const editingUser = ref(null);
const form = ref({ name: "", email: "", password: "" });

const openCreateModal = () => {
  editingUser.value = null;
  form.value = { id: "", email: "", password: "" };
  showModal.value = true;
};

const openEditModal = (user) => {
  editingUser.value = user;
  form.value = { name: user.name, email: user.email, password: "" };
  showModal.value = true;
};

const saveUser = () => {
  if (editingUser.value) {
    // Update existing user
    editUser(editingUser.value.id, form.value);
  } else {
    const newUser = { ...form.value, id: Date.now() }; // Use timestamp as an ID
    addUser(newUser);
  }

  fetchUsers();
  closeModal();
};

const addUser = (user) => {
  const usersData = JSON.parse(localStorage.getItem("users") || "[]");
  usersData.push(user);
  localStorage.setItem("users", JSON.stringify(usersData));
};

const deleteUserFn = (id) => {
  deleteUser(id);
  fetchUsers();
};

const closeModal = () => {
  showModal.value = false;
  form.value = { name: "", email: "", password: "" };
};

const fetchUsers = () => {
  getUsers().then((data) => {
    users.value = data;
  });
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <section class="users">
    <header class="users__header">
      <h1 class="users__title">Users Management</h1>
      <button class="users__add-btn" @click="openCreateModal">
        + Add User
      </button>
    </header>

    <!-- TABLE -->
    <table class="users__table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Password</th>
          <th>Permissions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user?.id }}</td>
          <td>{{ user?.email }}</td>
          <td>
            <button
              class="users__btn users__btn--edit"
              @click="openEditModal(user)"
            >
              Edit
            </button>
            <button
              class="users__btn users__btn--delete"
              @click="deleteUser(user?.id)"
            >
              Delete
            </button>
          </td>
          <td> 
            <button class="users__btn users__btn--permissions" >
              View Permissions
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL -->
    <div v-if="showModal" class="modal">
      <div class="modal__content">
        <h2>{{ editingUser ? "Edit User" : "Create User" }}</h2>

        <form @submit.prevent="saveUser">
          <input
            v-model="form.name"
            placeholder="Name"
            required
            class="modal__input"
          />
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
            class="modal__input"
          />
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            :required="!editingUser"
            class="modal__input"
          />

          <div class="modal__actions">
            <button type="submit" class="modal__btn modal__btn--save">
              Save
            </button>
            <button
              type="button"
              class="modal__btn modal__btn--cancel"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.users {
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.users__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.users__title {
  font-size: 1.5rem;
  background: linear-gradient(90deg, #59c080, #4fadbe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.users__add-btn {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  color: white;
  border: none;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
}
.users__table {
  width: 100%;
  border-collapse: collapse;
}
.users__table th,
.users__table td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}
.users__btn {
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  cursor: pointer;
  font-weight: 600;
}
.users__btn--edit {
  background-color: #4fadbe;
  color: white;
  margin-right: 0.3rem;
}
.users__btn--delete {
  background-color: #ef4444;
  color: white;
}
.users__btn--permissions {
  background-color: #3c4fa4;
  color: white;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal__content {
  background: white;
  padding: 2rem;
  border-radius: 0.8rem;
  width: 400px;
}
.modal__input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.3rem;
}
.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.modal__btn--save {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
}
.modal__btn--cancel {
  background: #ddd;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
}
</style>
