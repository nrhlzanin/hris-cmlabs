'use client'
import { useSidebar } from "@/components/ui/sidebar"
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
<<<<<<< HEAD
      title: "Employee Database",
      url: "/admin/employee",
=======
      title: "Employee Database", 
      url: "/admin/employee/employee-database",
>>>>>>> 1478f052b23f1b926411404f81ea86e9d8d63a56
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
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props} className="lg:w-64 w-full">
      <SidebarHeader>
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
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
