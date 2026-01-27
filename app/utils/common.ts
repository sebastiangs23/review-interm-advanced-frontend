import UserSource from "../pages/dashboard/users.vue?raw";
import ApiCallsSource from "../pages/dashboard/api-calls.vue?raw";
import StoreManagmentSource from "../pages/dashboard/store-management.vue?raw";
import AmazonWebServicesSource from "../pages/dashboard/amazon-web-services.vue?raw";
import MyComponentsSource from "../pages/dashboard/my-components.vue?raw";

export const usersTable: string[] = [
  "Username",
  "Email",
  "Password",
  "Permissions",
];

export const subModules = [
  {
    name: "Users",
    route: "users",
    to: "/dashboard/users",
    source: UserSource,
  },
  {
    name: "Api Calls",
    route: "api-calls",
    to: "/dashboard/api-calls",
    source: ApiCallsSource,
  },
  {
    name: "My components",
    route: "my-components",
    to: "/dashboard/my-components",
    source: MyComponentsSource,
  },
  {
    name: "Store Management",
    route: "store-management",
    to: "/dashboard/store-management",
    source: StoreManagmentSource,
  },
  {
    name: "Amazon Web Services",
    route: "amazon-web-services",
    to: "/dashboard/amazon-web-services",
    source: AmazonWebServicesSource,
  },
];
