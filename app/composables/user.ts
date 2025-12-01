import { ref } from "vue";
import { getUsers, addUser, editUser, deleteUser } from "../utils/utils.ts";

const users = ref([]);

export function useUsers(){
    const load = async () => {
        users.value = await getUsers() || [];
    };

    const add = async (users: any) => {
        addUser(users);
        await load();
    };

    const edit = async (email: string, data: any) => {
        editUser(email, data);
        await load();
    };

    const erase = async (email: string) => {
        deleteUser(email);
        await load();
    }

    return { users, add, edit, erase, load }
}