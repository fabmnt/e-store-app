'use client';

import {
  LogOutIcon,
  PackageIcon,
  PackageOpenIcon,
  StoreIcon,
  TagIcon,
} from 'lucide-react';
import type { Route } from 'next';
import { useParams, usePathname, useRouter } from 'next/navigation';
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
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';

const sidebarItems = [
  {
    label: 'My Store',
    href: 'my-store',
    icon: StoreIcon,
  },
  {
    label: 'Products',
    href: 'products',
    icon: PackageIcon,
  },
  {
    label: 'Categories',
    href: 'categories',
    icon: PackageOpenIcon,
  },
  {
    label: 'Tags',
    href: 'tags',
    icon: TagIcon,
  },
];

export function AppSidebar() {
  const { storeId } = useParams();
  const pathname = usePathname().replace(`/d/${storeId}`, '').replace('/', '');
  const router = useRouter();
  const isActive = (href: string) => pathname === href;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    onClick={() =>
                      router.push(`/d/${storeId}/${item.href}` as Route)
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => authClient.signOut({})}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
