"use client"

import * as React from "react"
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

// Modified data structure
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
      url: "/admin/employee",
      icon: Users,
    },
    {
      title: "Checkclock",
      url: "/admin/checkclock", 
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="p-4 text-xl font-bold">
          {data.title}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
