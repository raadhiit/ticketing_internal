import {
    Home,
    User,
    Building,
    Boxes,
    Tickets,
    type LucideIcon,
} from 'lucide-react';
import { RoleName } from '@/types';

export type SidebarItem = {
    title: string;
    routeName: string;
    icon: LucideIcon;
    // role?: RoleName[];
    requiresPermission?: string[];
};

export type SidebarSection = {
    label: string;
    collapsible?: boolean;
    defaultOpen?: boolean;
    items: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
    {
        label: 'Dashboard',
        collapsible: false,
        items: [
            {
                title: 'Dashboard',
                routeName: 'dashboard',
                icon: Home,
            },
        ],
    },
    {
        label: 'Master',
        collapsible: true,
        defaultOpen: true,
        items: [
            { 
                title: 'Departments', 
                routeName: 'departments.index', 
                icon: Building,
                requiresPermission: ['departments.manage'],
            },
            {
                title: 'Systems',
                routeName: 'systems.index',
                icon: Boxes,
                requiresPermission: ['systems.manage'],
            },
        ],
    },
    {
        label: 'Transaksi',
        collapsible: true,
        defaultOpen: false,
        items: [
            { 
                title: 'Tickets', 
                routeName: 'tickets.index', 
                icon: Tickets, 
            },
        ],
    },
    {
        label: 'Settings',
        collapsible: false,
        items: [
            {
                title: 'User Management',
                routeName: 'users.index',
                icon: User,
                requiresPermission: ['users.manage'],
            },
        ],
    },
];
