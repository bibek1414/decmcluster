import UsersClient from "@/components/(admin)/users/users-client";

export const metadata = {
  title: "User Management | Decmcluster",
  description: "Administrative panel for managing user roles, access, and permissions.",
};

export default function UsersPage() {
  return <UsersClient />;
}
