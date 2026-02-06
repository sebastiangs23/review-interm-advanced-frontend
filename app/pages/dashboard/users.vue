<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";

import { useUsers } from "../../composables/user";
import { useCurrentUser } from "../../composables/currentUser";

import Table from "../../components/Table.vue";
import Modal from "../../components/modals/Modal.vue";
import ModalConfirmation from "../../components/modals/ModalConfirmation.vue";
import ModalPermission from "../../components/modals/ModalPermission.vue";

import { usersTable } from "../../utils/common";

import { PlusCircleIcon } from "@heroicons/vue/24/outline";

const toast = useToast();
const { users, load, add, edit, erase } = useUsers();

definePageMeta({
  layout: "modules",
});

const form = ref({ username: "", email: "", password: "" });
const modalInputs = ref({
  title: "",
  description: "",
  buttonText: "",
});
const showModal = ref(false);
const showModalPermissions = ref(false);
const selectedUser = ref(null);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

const openCreateModal = () => {
  selectedUser.value = null;

  form.value = { username: "", email: "", password: "" };

  modalInputs.value = {
    title: "Create User",
    description: "Fill in the details to create a new user.",
    buttonText: "Create",
  };

  showModal.value = true;
};

//Open any of the modals (edit or permissions) based on the action passed as parameter
const openModal = (user, action) => {
  if (action === "edit") {
    selectedUser.value = user;

    form.value = {
      username: user.username,
      email: user.email,
      password: "",
    };

    modalInputs.value = {
      title: "Edit User",
      description: `Editing user: ${user.username}`,
      buttonText: "Save changes",
    };

    showModal.value = true;
  } else if (action === "permissions") {
    selectedUser.value = user;

    showModalPermissions.value = !showModalPermissions.value;
  }
};

const saveUser = () => {
  if (selectedUser.value) {
    edit(selectedUser.value.email, form.value);
    toast.success("User updated successfully");
  } else {
    const newUser = { ...form.value };
    add(newUser);
    toast.success("User created successfully");
  }

  load();
  closeModal();
};

const askDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  
  const result = await erase(userToDelete.value?.email);
  
  if (result?.status !== 200) {
    toast.error(result.message);
  } else {
    toast.success(result.message);
    load();
  }

  showDeleteModal.value = false;
  userToDelete.value = null;
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
  <section
    class="bg-(--input-bg-color) border-dark btn__shadow border-2 p-6 rounded-[14px]"
  >
    <header class="flex items-center justify-between mb-6">
      <h1
        class="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]"
      >
        Users Management
      </h1>

      <button
        class="flex items-center gap-2 bg-[var(--bg-color-third)] text-[var(--color-text-primary)] px-5 py-3 rounded-xl hover:bg-[var(--bg-color-secondary)] btn__shadow transition"
        @click="openCreateModal"
      >
        <PlusCircleIcon class="w-5 h-5" />
        Add User
      </button>
    </header>

    <Table
      :headers="usersTable"
      :users="users"
      @selectUser="openModal"
      @delete="askDelete"
    />

    <Modal
      :show="showModal"
      :title="modalInputs.title"
      :content="modalInputs.description"
      :button-text="modalInputs.buttonText"
      :form="form"
      @close="closeModal"
      @confirm="saveUser"
    />
    <ModalPermission
      :show="showModalPermissions"
      :user="selectedUser"
      @close="showModalPermissions = false"
      @save="handleSavePermissions"
    />

    <ModalConfirmation
      :show="showDeleteModal"
      title="Delete user"
      description="Are you sure you want to delete this user? This action cannot be undone."
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </section>
</template>

<style scoped>
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
.modal__btn--save {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
}
</style>
