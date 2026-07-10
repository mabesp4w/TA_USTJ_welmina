import { useState } from "react";
import { usePage } from '@inertiajs/react';
import PengelolaSidebar from "./PengelolaSidebar";
import PengelolaHeader from "./PengelolaHeader";

export default function PengelolaLayout({
    children,
    actions,
}: {
    children: React.ReactNode;
    actions?: React.ReactNode;
}) {
    const { component } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const title = component?.replace(/^pengelola\//, '') || 'Dashboard';

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <PengelolaSidebar open={sidebarOpen} onClose={closeSidebar} />

            <main className="flex flex-1 flex-col overflow-auto">
                <PengelolaHeader title={title} onToggleSidebar={() => setSidebarOpen((v) => !v)}>
                    {actions}
                </PengelolaHeader>
                {children}
            </main>
        </div>
    );
}
