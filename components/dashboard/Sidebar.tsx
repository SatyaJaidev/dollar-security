"use client";

import {
  Users,
  Shield,
  Receipt,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  quotationCount?: number;
  guardNotificationCount?: number;
}

export default function Sidebar({ quotationCount = 0, guardNotificationCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    { label: "Clients", icon: Users, href: "/dashboard/admin/clients" },
    { label: "Guards", icon: Shield, href: "/dashboard/admin/guards", badge: guardNotificationCount },
    { label: "Quotation Queries", icon: Receipt, href: "/dashboard/admin/quotation-queries", badge: quotationCount },
  ];

  const isActive = (href: string) => pathname === href;

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <aside className="w-full lg:w-64 flex flex-col overflow-y-auto bg-white rounded-2xl p-3 lg:p-4 shadow-2xl border border-gray-200">
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, icon: Icon, href, badge }) => (
          <a
            key={label}
            href={href}
            className={`flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-all duration-300 ${
              isActive(href)
                ? "bg-gradient-to-r from-gray-100 to-gray-50 shadow-inner border-2 border-[#E85E30] font-bold text-black lg:transform lg:scale-[1.02]"
                : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
            }`}
            style={isActive(href) ? {
              boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.9), 0 0 10px rgba(232, 94, 48, 0.3)'
            } : {}}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive(href) ? "text-[#FEB852]" : "text-gray-500"}`} />
              <span className="font-medium text-sm lg:text-base">{label}</span>
            </div>
            {badge !== undefined && badge > 0 && (
              <span className="bg-[#FEB852] text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-black">
                {badge}
              </span>
            )}
          </a>
        ))}
        
        {/* Separator */}
        <div className="border-t border-gray-200 my-2"></div>
        
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-all duration-300 text-red-600 hover:bg-red-50 hover:shadow-sm group"
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 group-hover:text-red-600" />
          <span className="font-medium text-sm lg:text-base">Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
