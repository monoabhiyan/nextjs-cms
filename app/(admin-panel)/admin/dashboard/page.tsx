import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";

export default async function Page() {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <AdminPanelXSpacer>
      <div>Hello world</div>
    </AdminPanelXSpacer>
  );
}
