<script setup>
import { ref, onMounted } from "vue";

import { useUsers } from "../../composables/user";
import { useCurrentUser } from "../../composables/currentUser";

import Title from "../../components/Title.vue"
import Table from "../../components/Table.vue";
import Modal from "../../components/modals/Modal.vue";
import ModalConfirmation from "../../components/modals/ModalConfirmation.vue";
import ModalPermission from "../../components/modals/ModalPermission.vue";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";

import { usersTable } from "../../utils/common";

const { $toast } = useNuxtApp();
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
const typeModal = ref(1);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

const openCreateModal = () => {
  selectedUser.value = null;
  typeModal.value = 1;

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
    typeModal.value = 2;

    form.value = {
      username: user.username,
      email: user.email,
      password: user.password,
      submodules: user?.submodules
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
    $toast.success("User updated successfully");
  } else {
    const newUser = { ...form.value };
    add(newUser);
    $toast.success("User created successfully");
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
    $toast.error(result.message);
  } else {
    $toast.success(result.message);
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
    class="w-full bg-(--input-bg-color) border-dark border-2 btn__shadow rounded-[14px] mt-2 p-4 sm:p-6 sm:mt-0 lg:p-8"
  >
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <Title text="Users Management" :size="1" />

      <button
        class="flex items-center justify-center gap-2 w-full sm:w-auto bg-[var(--bg-color-third)] text-[var(--color-text-primary)] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-[var(--bg-color-secondary)] btn__shadow transition"
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
      :typeModal="typeModal"
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
