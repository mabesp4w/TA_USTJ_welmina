import { Link, usePage } from '@inertiajs/react';
import { dashboard, member } from '@/routes/admin';
import { X } from "lucide-react";
import {
    LayoutDashboard,
    Users,
    UserPlus,
    CreditCard,
    Dumbbell,
    Package,
    ShoppingCart,
    History,
    Settings,
    Bell,
    FileText,
    ShieldUser,
} from "lucide-react";

const menuSections = [
    {
        title: "UTAMA",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, href: dashboard.url() },
        ],
    },
    {
        title: "MEMBER",
        items: [
            { label: "Data Member", icon: Users, href: member.url() },
            { label: "Biaya Pendaftaran", icon: UserPlus, href: '#' },
            { label: "Biaya Gym", icon: CreditCard, href: '#' },
        ],
    },
    {
        title: "IVENTARIS",
        items: [
            { label: "Data Iventaris", icon: Package, href: '#' },
            { label: "Peralatan Gym", icon: Dumbbell, href: '#' },
        ],
    },
    {
        title: "TRANSAKSI",
        items: [
            { label: "Pengadaan Barang", icon: ShoppingCart, href: '#' },
            { label: "Riwayat Aktivitas", icon: History, href: '#' },
        ],
    },
    {
        title: "SISTEM",
        items: [
            { label: "Notifikasi", icon: Bell, href: '#' },
            { label: "Pengguna", icon: ShieldUser, href: '#' },
            { label: "Laporan", icon: FileText, href: '#' },
            { label: "Pengaturan", icon: Settings, href: '#' },
        ],
    },
];

export default function SidebarFitnessCenter({ open, onClose }: { open?: boolean; onClose?: () => void }) {
    const { url } = usePage();

    const isActive = (href: string) => {
        if (href === '#') return false;
        return url.startsWith(href);
    };

    return (
        <aside
            className={[
                "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-base-200/95 backdrop-blur-md border-r border-base-300 transition-transform duration-200 lg:static lg:translate-x-0",
                open ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
                <div>
                    <h1 className="text-sm font-bold leading-tight uppercase">
                        FITNESS CENTER
                    </h1>
                    <h2 className="text-sm font-bold leading-tight uppercase">
                        VICCA SERA POLIMAK
                    </h2>
                    <p className="text-[11px] text-base-content/60 font-semibold mt-1 uppercase">
                        Sistem Inventaris
                    </p>
                </div>
                <button className="btn btn-ghost btn-square lg:hidden" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 px-3 py-3 overflow-y-auto">
                {menuSections.map((section) => (
                    <div key={section.title} className="mb-4">
                        <p className="px-3 mb-2 text-[11px] font-bold tracking-wide text-base-content/50">
                            {section.title}
                        </p>

                        <ul className="menu gap-1 w-full">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className={[
                                                "flex items-center gap-3 rounded-lg text-sm font-medium",
                                                active
                                                    ? "bg-primary text-primary-content"
                                                    : "hover:bg-base-300 text-base-content",
                                            ].join(" ")}
                                            onClick={onClose}
                                        >
                                            <Icon size={18} strokeWidth={2} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-base-300">
                <div className="flex items-center gap-3 rounded-xl bg-base-100/60 backdrop-blur-sm px-3 py-2 shadow-sm">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-9">
                            <span className="text-xs font-bold">AD</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold leading-none">Administrator</p>
                        <p className="text-xs text-base-content/60 mt-1">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
