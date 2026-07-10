import { useState } from "react";
import { usePage } from '@inertiajs/react';
import SidebarFitnessCenter, { pengelolaMenuSections } from "../admin/sidebar";
import PengelolaHeader from "./PengelolaHeader";

export default function PengelolaLayout({
    children,
    actions,
    title
}: {
    children: React.ReactNode;
    actions?: React.ReactNode;
    title?: string;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { component } = usePage();

    if (!title) {
        title = component?.replace(/^pengelola\//, '');
    }


    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <SidebarFitnessCenter
                open={sidebarOpen}
                onClose={closeSidebar}
                menuSections={pengelolaMenuSections}
                subtitle="Panel Pengelola"
            />

            <main className="flex flex-1 flex-col overflow-auto">
                <PengelolaHeader title={title} onToggleSidebar={() => setSidebarOpen((v) => !v)}>
                    {actions}
                </PengelolaHeader>
                {children}
            </main>
        </div>
    );
}
