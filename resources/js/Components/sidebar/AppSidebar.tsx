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
import { Link, usePage, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, User2 } from 'lucide-react';
import ApplicationLogo from '../ApplicationLogo';
import { sidebarSections } from './SidebarItems';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../ui/collapsible';
import { PageProps, RoleName } from '@/types';

export function AppSidebar() {
    // const user = usePage().props.auth.user;
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const userRoles: RoleName[] = (user.roles ?? []) as RoleName[];

    const hasRole = (allowed?: RoleName[]) => {
        if (!allowed || allowed.length === 0) return true; // no restriction
        if (!userRoles.length) return false;
        return allowed.some((role) => userRoles.includes(role));
    };

    const isItemActive = (routeName: string) => {
        if(!routeName) return false;

        return (
            route().current(routeName) ||
            route().current(routeName + '.*')
        );
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-2 border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="gap-2 px-2"
                        >
                        {/* Logo jadi kotak kecil, aman di icon mode */}
                        <div className="flex justify-center items-center rounded-lg w-8 h-8 text-sidebar-primary-foreground">
                            <ApplicationLogo className="w-4 h-4" />
                        </div>

                        {/* Teks: otomatis di-manage sama CSS sidebar saat collapsed */}
                        <div className="flex-1 grid overflow-hidden text-left leading-tight">
                            <span className="font-semibold text-sm truncate">
                                Ticketing
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                                RSHM
                            </span>
                        </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {sidebarSections.map((section) => {
                    // filter items by role
                    const visibleItems = section.items.filter((item) =>
                        hasRole(item.roles),
                    );

                    // kalau di section ini nggak ada satupun item yg boleh buat role user, skip seluruh section
                    if (visibleItems.length === 0) return null;

                    return section.collapsible ? (
                        <Collapsible
                            key={section.label}
                            defaultOpen
                            className="group/collapsible"
                        >
                            <SidebarGroup>
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger>
                                        {section.label}
                                        <ChevronDown className="ml-auto group-data-[state=open]/collapsible:rotate-180 transition-transform" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>

                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {visibleItems.map((item) => (
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
                                                                    : (item.routeName ??
                                                                      '#')
                                                            }
                                                        >
                                                            <item.icon className="w-4 h-4" />
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
                                    {visibleItems.map((item) => (
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
                                                            : (item.routeName ??
                                                              '#')
                                                    }
                                                >
                                                    <item.icon className="w-4 h-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
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
                            className="bg-card w-[--radix-popper-anchor-width]"
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
