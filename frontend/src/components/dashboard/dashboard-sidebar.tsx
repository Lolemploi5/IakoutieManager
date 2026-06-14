"use client";

import { BarChart3, Bell, Cog, LayoutDashboard, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Statistiques", icon: BarChart3, active: false },
  { title: "Notifications", icon: Bell, active: false },
  { title: "Sécurité", icon: ShieldCheck, active: false },
  { title: "Paramètres", icon: Cog, active: false },
];

type DashboardSidebarProps = {
  username: string | null;
  avatarUrl: string | null;
};

export function DashboardSidebar({ username, avatarUrl }: DashboardSidebarProps) {
  const initial = username?.slice(0, 2).toUpperCase() ?? "IM";

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-card/80 text-card-foreground backdrop-blur">
      <SidebarHeader>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
              <LayoutDashboard className="size-4" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">Iakoutie Manager</p>
              <p className="text-xs text-white/55">Dashboard privé</p>
            </div>
          </div>
          <SidebarTrigger className="text-white/70" />
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/10" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.active}
                    className="text-white/80 data-[active=true]:bg-white/10 data-[active=true]:text-white"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-white/10" />

      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <Avatar className="size-10 border border-white/10">
            <AvatarImage src={avatarUrl ?? undefined} alt={username ?? "Utilisateur"} />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{username ?? "Utilisateur"}</p>
            <p className="text-xs text-white/55">Session Discord validée</p>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/15">
            Live
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}