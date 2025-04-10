import React from "react";
import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import ProjectsDataTable from "@/features/admin/projects/components/ProjectsDataTable";

export default async function PaymentPage() {
  const session = await getServerSession(nextAuthOptions);
  if (!session) return redirect("/login");

  return (
    <AdminPanelXSpacer>
      <ProjectsDataTable />
    </AdminPanelXSpacer>
  );
}
