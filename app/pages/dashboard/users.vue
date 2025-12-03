<script setup>
import { ref, onMounted } from "vue";

import Modal from "../../components/Modal.vue";

import { useUsers } from "../../composables/user"
import { useCurrentUser } from "../../composables/currentUser";

const { users, load, add, edit, erase } = useUsers();

definePageMeta({
  layout: "modules",
});

// const users = ref([]);
const showModal = ref(false);
const showModalPermissions = ref(false);
const editingUser = ref(null);
const form = ref({ username: "", email: "", password: "" });

const openCreateModal = () => {
  editingUser.value = null;
  form.value = { username: "", email: "", password: "" };
  showModal.value = true;
};

const openEditModal = (user) => {
  editingUser.value = user;
  form.value = { username: user.username, email: user.email, password: "" };
  showModal.value = true;
};

const saveUser = () => {
  if (editingUser.value) {
    edit(editingUser.value.email, form.value);
  } else {
    const newUser = { ...form.value };
    add(newUser);
  }

  load();
  closeModal();
};

const changePermisionsModal = () => {
  showModalPermissions.value = !showModalPermissions.value;
};

const closeModal = () => {
  showModal.value = false;
  form.value = { username: "", email: "", password: "" };
};

onMounted(() => {
  useCurrentUser();
  load();
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

    <!-- TABLE (COMPONENTIZE THIS)-->
    <table class="users__table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Password</th>
          <th>Permissions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.username">
          <td>{{ user?.username }}</td>
          <td>{{ user?.email }}</td>
          <td>
            <button
              class="modal__btn modal__btn--edit"
              @click="openEditModal(user)"
            >
              Edit
            </button>
            <button
              class="modal__btn modal__btn--cancel"
              @click="erase(user?.email)"
            >
              Delete
            </button>
          </td>
          <td>
            <button
              class="modal__btn modal__btn--permissions"
              @click="changePermisionsModal(user?.username)"
            >
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
            v-model="form.username"
            placeholder="Username"
            required
            class="modal__input"
          />
          <input
            v-model="form.email"
            :disabled="editingUser"
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

    <Modal
      :show="showModalPermissions"
      title="Edit Permissions"
      content="Here you can edit user permissions."
      @close="changePermisionsModal()"
    />
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
.modal__btn {
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  cursor: pointer;
  font-weight: 600;
}
.modal__btn--edit {
  background-color: var(--edit-color);
  color: white;
  margin-right: 0.3rem;
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
.users__add-btn {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  color: white;
  border: none;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
}
.modal__btn--save {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
}

</style>
