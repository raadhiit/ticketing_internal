import { FlashMessage } from '@/Components/FlashMessage';
import { AppSidebar } from '@/Components/sidebar/AppSidebar';
import ThemeToggle from '@/Components/ThemeToggle';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { props } = usePage<PageProps>();
    const { flash } = props;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {flash?.success && (
                    <FlashMessage type="success" message={flash.success} />
                )}
                {flash?.error && (
                    <FlashMessage type="error" message={flash.error} />
                )}
                {flash?.info && (
                    <FlashMessage type="info" message={flash.info} />
                )}
                <div className="min-h-screen bg-background text-foreground">
                    {header && (
                        <header className="sticky top-0 z-20 border-b border-border bg-card">
                            <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
                                {/* Kiri: trigger + title */}
                                <div className="flex flex-1 items-center gap-2">
                                    <SidebarTrigger className="md:hidden" />
                                    <div className="truncate text-sm font-semibold leading-tight sm:text-base">
                                        {header}
                                    </div>
                                </div>

                                {/* Kanan: toggle theme / dll */}
                                <div className="flex items-center gap-2">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </header>
                    )}

                    <main className="sm:rounded-lg">{children}</main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
