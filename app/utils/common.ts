import DashboardSource from "../pages/dashboard/index.vue?raw";
import UserSource from "../pages/dashboard/users.vue?raw";
import ApiCallsSource from "../pages/dashboard/api-calls.vue?raw";
import StoreManagmentSource from "../pages/dashboard/store-management.vue?raw";
import AmazonWebServicesSource from "../pages/dashboard/amazon-web-services.vue?raw";
import MyComponentsSource from "../pages/dashboard/my-components.vue?raw";
import WebSocket from "../pages/dashboard/web-socket.vue?raw";
import { LinkIcon } from "@heroicons/vue/24/outline";

export const usersTable: string[] = [
  "Username",
  "Email",
  "Password",
  "Permissions",
];

import {
  ChartBarSquareIcon,
  UsersIcon,
  CloudIcon,
  Squares2X2Icon,
  CircleStackIcon,
  CubeIcon,
} from "@heroicons/vue/24/outline";

export const subModules = [
  {
    name: "Dashboard",
    route: "",
    to: "/dashboard/",
    icon: ChartBarSquareIcon,
    source: DashboardSource
  },
  {
    name: "Users",
    route: "users",
    to: "/dashboard/users",
    icon: UsersIcon,
    source: UserSource,
  },
  {
    name: "Api Calls",
    route: "api-calls",
    to: "/dashboard/api-calls",
    icon: CloudIcon,
    source: ApiCallsSource,
  },
  {
    name: "Web Socket",
    route: "web-socket",
    to: "/dashboard/web-socket",
    icon: LinkIcon,
    source: WebSocket,
  },
  {
    name: "Store Management",
    route: "store-management",
    to: "/dashboard/store-management",
    icon: CircleStackIcon,
    source: AmazonWebServicesSource,
  },
  {
    name: "Amazon Web Services",
    route: "amazon-web-services",
    to: "/dashboard/amazon-web-services",
    icon: CubeIcon,
    source: MyComponentsSource,
  },
  {
    name: "My components",
    route: "my-components",
    to: "/dashboard/my-components",
    icon: Squares2X2Icon,
    source: StoreManagmentSource,
  },
];
