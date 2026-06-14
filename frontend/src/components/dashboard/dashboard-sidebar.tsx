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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-3" isActive>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Iakoutie Manager</span>
                <span className="truncate text-xs text-muted-foreground">Dashboard privé</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.active}
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

      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Avatar className="size-9">
            <AvatarImage src={avatarUrl ?? undefined} alt={username ?? "Utilisateur"} />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{username ?? "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground">Session Discord validée</p>
          </div>
          <Badge variant="secondary">
            Live
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}