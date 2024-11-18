import { FileText, PlusCircle, UserCog, Users } from "lucide-react";

export const navigation = [
  {
    name: "User Details",
    href: "/user-details",
    icon: Users,
    current: true,
  },
  {
    name: "Ad Overview",
    href: "/ad-overview",
    icon: FileText,
    current: false,
  },
  {
    name: "New Ad",
    href: "/new-ad",
    icon: PlusCircle,
    current: false,
  },
  {
    name: "Manage Reporter",
    href: "/manage-reporter",
    icon: UserCog,
    current: false,
  },
];
