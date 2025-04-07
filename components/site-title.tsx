"use client";
import { usePathname } from "next/navigation";
import { adminSideBarData } from "@/lib/constants";

const SiteTitle = () => {
  const pathname = usePathname();
  const siteHeader = adminSideBarData.navMain.find(
    (item) => item.url === pathname,
  );

  return <h1 className="text-base font-medium">{siteHeader?.title}</h1>;
};

export default SiteTitle;
