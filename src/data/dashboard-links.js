import { ACCOUNT_TYPE } from "../utils/constants";

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/supplier",
    type: ACCOUNT_TYPE.SUPPLIER,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "Orders",
    path: "/dashboard/orders",
    type: ACCOUNT_TYPE.SUPPLIER,
    icon: "VscPackage",
  },
  {
    id: 4,
    name: "My Listings",
    path: "/dashboard/my-listings",
    type: ACCOUNT_TYPE.SUPPLIER,
    icon: "VscVm",
  },
  {
    id: 5,
    name: "Add Product",
    path: "/dashboard/add-product",
    type: ACCOUNT_TYPE.SUPPLIER,
    icon: "VscAdd",
  },
  {
    id: 6,
    name: "My Orders",
    path: "/dashboard/my-orders",
    type: ACCOUNT_TYPE.VISITOR,
    icon: "VscMortarBoard",
  },
  {
    id: 7,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.VISITOR,
    icon: "VscArchive",
  },
];
