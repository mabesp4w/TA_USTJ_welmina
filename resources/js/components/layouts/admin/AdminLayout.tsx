import { useState } from "react";
import { usePage } from '@inertiajs/react';
import SidebarFitnessCenter from "./sidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({
    children,
    actions,
}: {
    children: React.ReactNode;
    actions?: React.ReactNode;
}) {
    const { component } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const title = component?.replace(/^admin\//, '') || 'Dashboard';

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <SidebarFitnessCenter open={sidebarOpen} onClose={closeSidebar} />

            <main className="flex flex-1 flex-col overflow-auto">
                <AdminHeader title={title} onToggleSidebar={() => setSidebarOpen((v) => !v)}>
                    {actions}
                </AdminHeader>
                {children}
            </main>
        </div>
    );
}
