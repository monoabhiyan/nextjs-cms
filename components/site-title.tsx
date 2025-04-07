'use client'
import {usePathname} from "next/navigation";
import {data} from "@/components/app-sidebar";

const SiteTitle = () => {
  const pathname = usePathname();
  const siteHeader = data.navMain.find(item => item.url === pathname);

  return (
    <h1 className="text-base font-medium">{siteHeader?.title}</h1>
  );
};

export default SiteTitle;
