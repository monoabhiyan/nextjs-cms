import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import type {Metadata} from "next";

import {AppSidebar} from "@/components/app-sidebar"
import {SiteHeader} from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import {nextAuthOptions} from "@/lib/nextAuth";
import AdminPanelContainer from "@/app/(admin-panel)/admin/AdminPanelContainer";
import {Children} from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel - admin cms",
};
export default async function AdminLayout({children}: Children) {
  const session = await getServerSession(nextAuthOptions)

  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset"/>
      <SidebarInset>
        <SiteHeader/>
        <AdminPanelContainer>
          {children}
        </AdminPanelContainer>
      </SidebarInset>
    </SidebarProvider>
  )
}

