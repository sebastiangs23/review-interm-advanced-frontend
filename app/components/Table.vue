<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/outline";

defineProps({
  headers: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["selectUser", "delete"]);
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-black/30">
    <table class="w-full border-collapse text-sm">
      <!-- HEADER -->
      <thead class="bg-[var(--bg-color-third)] text-gray-300">
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            class="px-4 py-3 text-left font-semibold"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <!-- BODY -->
      <tbody class="divide-y divide-black/30">
        <tr
          v-for="user in users"
          :key="user.username"
          class="hover:bg-black/30 transition-colors"
        >
          <!-- USERNAME -->
          <td class="px-4 py-3 text-white font-medium">
            {{ user.username }}
          </td>

          <!-- EMAIL -->
          <td class="px-4 py-3 text-gray-300">
            {{ user.email }}
          </td>

          <!-- ACTIONS -->
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <!-- EDIT -->
              <button
                class="p-2 rounded-lg bg-[var(--color-base)]/20 hover:bg-[var(--edit-color)]/40 transition"
                @click="emit('selectUser', user, 'edit')"
                title="Edit user"
              >
                <PencilSquareIcon class="w-5 h-5 text-[var(--color-base)]" />
              </button>

              <!-- DELETE -->
              <button
                class="p-2 rounded-lg bg-[var(--delete-color)]/20 hover:bg-[var(--delete-color)]/40 transition"
                @click="emit('delete', user)"
                title="Delete user"
              >
                <TrashIcon class="w-5 h-5 text-[var(--delete-color)]" />
              </button>
            </div>
          </td>

          <!-- PERMISSIONS -->
          <td class="px-4 py-3">
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--permissions-color)]/20 hover:bg-[var(--permissions-color)]/40 transition text-sm"
              @click="emit('selectUser', user, 'permissions')"
              title="View permissions"
            >
              <ShieldCheckIcon
                class="w-5 h-5 text-[var(--permissions-color)]"
              />
              <span class="text-white">View</span>
            </button>
          </td>
        </tr>

        <!-- EMPTY STATE -->
        <tr v-if="!users.length">
          <td :colspan="headers.length" class="text-center py-10 text-gray-400">
            No users found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
