import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
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
    SidebarRail,
} from '@/Components/ui/sidebar';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, User2 } from 'lucide-react';
import ApplicationLogo from '../ApplicationLogo';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../ui/collapsible';
import { sidebarSections } from './SidebarItems';

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    // === PENTING: ambil permissions dari Inertia props ===
    const permissions = new Set<string>(user?.permissions ?? []);

    const hasPermission = (required?: string[]) => {
        if (!required || required.length === 0) return true; // no restriction
        if (permissions.size === 0) return false;
        return required.some((perm) => permissions.has(perm));
    };

    const isItemActive = (routeName: string) => {
        if (!routeName) return false;

        return route().current(routeName) || route().current(routeName + '.*');
    };

    // Sekalian pre-filter section di awal biar kode JSX lebih bersih
    const visibleSections = sidebarSections
        .map((section) => ({
            ...section,
            items: section.items.filter((item) =>
                hasPermission(item.requiresPermission),
            ),
        }))
        .filter((section) => section.items.length > 0);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b py-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="gap-2 px-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                <ApplicationLogo className="h-4 w-4" />
                            </div>
                            <div className="grid flex-1 overflow-hidden text-left leading-tight">
                                <span className="truncate text-sm font-semibold">
                                    Ticketing
                                </span>
                                <span className="truncate text-[11px] text-muted-foreground">
                                    RSHM
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {visibleSections.map((section) =>
                    section.collapsible ? (
                        <Collapsible
                            key={section.label}
                            defaultOpen={section.defaultOpen ?? true}
                            className="group/collapsible"
                        >
                            <SidebarGroup>
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger>
                                        {section.label}
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>

                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {section.items.map((item) => (
                                                <SidebarMenuItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={isItemActive(
                                                            item.routeName,
                                                        )}
                                                    >
                                                        <Link
                                                            href={
                                                                item.routeName
                                                                    ? route(
                                                                          item.routeName,
                                                                      )
                                                                    : '#'
                                                            }
                                                        >
                                                            <item.icon className="h-4 w-4" />
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    ) : (
                        <SidebarGroup key={section.label}>
                            <SidebarGroupLabel>
                                {section.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {section.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isItemActive(
                                                    item.routeName,
                                                )}
                                            >
                                                <Link
                                                    href={
                                                        item.routeName
                                                            ? route(
                                                                  item.routeName,
                                                              )
                                                            : '#'
                                                    }
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ),
                )}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton>
                                <User2 /> {user.name}
                                <ChevronUp className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className="w-[--radix-popper-anchor-width] bg-card"
                        >
                            <DropdownMenuItem
                                asChild
                                className="hover:dark:bg-neutral-700"
                            >
                                <Link href={route('profile.edit')}>
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                className="hover:dark:bg-neutral-700"
                            >
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    className="w-full"
                                >
                                    Log Out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
