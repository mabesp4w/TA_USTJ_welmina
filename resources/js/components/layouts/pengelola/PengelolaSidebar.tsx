import { Link, usePage } from '@inertiajs/react';
import { inventory, gymEquipment, maintenanceLogs, supplier, report } from '@/routes/admin';
import { X } from "lucide-react";
import {
    LayoutDashboard,
    Package,
    Dumbbell,
    Wrench,
    Building2,
    ClipboardList,
    DollarSign,
    CalendarDays,
} from "lucide-react";

const menuSections = [
    {
        title: "IVENTARIS",
        items: [
            { label: "Data Inventaris", icon: Package, href: inventory.url() },
            { label: "Peralatan Gym", icon: Dumbbell, href: gymEquipment.url() },
            { label: "Perawatan Barang", icon: Wrench, href: maintenanceLogs.url() },
            { label: "Pemasok", icon: Building2, href: supplier.url() },
        ],
    },
    {
        title: "CETAK LAPORAN",
        items: [
            { label: "Laporan Barang", icon: ClipboardList, href: report.barang.url() },
            { label: "Laporan Keuangan", icon: DollarSign, href: report.keuangan.url() },
            { label: "Laporan Harian", icon: CalendarDays, href: report.harian.url() },
        ],
    },
];

export default function PengelolaSidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
    const { url } = usePage();

    const isActive = (href: string) => {
        if (url === href) return true;
        if (!url.startsWith(href)) return false;
        const nextChar = url[href.length];
        if (nextChar === '?' || nextChar === undefined) return true;
        if (nextChar === '/') {
            const rest = url.slice(href.length + 1);
            const nextSegment = rest.split('/')[0];
            return nextSegment !== undefined && /^\d+$/.test(nextSegment);
        }
        return false;
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
                        Panel Pengelola
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
                            <span className="text-xs font-bold">PG</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold leading-none">Pengelola</p>
                        <p className="text-xs text-base-content/60 mt-1">Pengelola</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
