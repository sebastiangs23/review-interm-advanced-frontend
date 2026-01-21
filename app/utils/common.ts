import ColorPaletteSource from "../components/ColorPalette.vue?raw";
import StoreManagmentSource from "../pages/dashboard/store-management.vue?raw";

export const usersTable: string[] = ["Username", "Email", "Password", "Permissions"];

export const subModules = [
    {
        name: "Users",
        route: "users",
    },
    {
        name: "Settings",
        route: "settings",
    },
    {
        name: "Store Management",
        route: "store-management",
        source: StoreManagmentSource,
    }
];