'use client'
import * as React from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  TimerOff,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { CompactTimeWidget } from "@/components/TimeWidget"

const data = {
  title: "HRIS",
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Employee Database", 
      url: "/admin/employee/employee-database",
      icon: Users,
    },
    {
      title: "Checkclock",
      url: "/admin/checklock", 
      icon: Clock,
    },
    {
      title: "Overtime",
      url: "/admin/overtime",
      icon: TimerOff,
    },
    {
      title: "Letters",
      url: "/admin/letters",
      icon: FileText,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="lg:w-64 w-full"><SidebarHeader>
        <div className="p-4 flex items-center justify-center">
          <Image
            src="/img/logo/Logo HRIS-1.png"
            alt="HRIS Logo"
            width={40}
            height={40}
            className="transition-all duration-300 object-contain w-auto h-auto"
            priority
          />
        </div>
        {/* Jakarta Time Widget */}
        <div className="px-4 pb-2">
          <CompactTimeWidget className="justify-center text-xs" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
