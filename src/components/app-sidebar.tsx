'use client';

import { HomeIcon, PackageIcon, TagIcon } from 'lucide-react';
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

const sidebarItems = [
  {
    label: 'Home',
    href: '',
    icon: HomeIcon,
  },
  {
    label: 'Products',
    href: 'products',
    icon: PackageIcon,
  },
  {
    label: 'Categories',
    href: 'categories',
    icon: TagIcon,
  },
];

export function AppSidebar() {
  const { storeSlug } = useParams();
  const pathname = usePathname().replace(`/${storeSlug}`, '').replace('/', '');
  const router = useRouter();
  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    onClick={() =>
                      router.push(`/${storeSlug}/${item.href}` as Route)
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
      <SidebarFooter />
    </Sidebar>
  );
}
