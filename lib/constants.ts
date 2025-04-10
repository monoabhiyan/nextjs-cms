import {IconDashboard, IconListDetails} from "@tabler/icons-react";

export const VALIDATION_ERROR_MESSAGE = "An error occurred validating your input.";
export const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong while executing the operation.";

export const adminSideBarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconListDetails,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconListDetails,
    },
    {
      title: "Projects",
      url: "/admin/projects",
      icon: IconListDetails,
    }
  ],
};
