import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import AdminPanelXSpacer from "@/app/(admin-panel)/admin/AdminPanelXSpacer";

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
