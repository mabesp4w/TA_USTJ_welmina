import { useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { activityLog, category, dashboard, gymEquipment, gymFee, inventory, maintenanceLogs, member, notification, procurement, registrationPayment, report, settings, supplier, user as userRoute } from '@/routes/admin';
import {
    dashboard as pengelolaDashboard,
    gymEquipment as pengelolaGymEquipment,
    inventory as pengelolaInventory,
    maintenanceLogs as pengelolaMaintenanceLogs,
    supplier as pengelolaSupplier,
} from '@/routes/pengelola';
import {
    barang as pengelolaReportBarang,
    keuangan as pengelolaReportKeuangan,
    harian as pengelolaReportHarian,
} from '@/routes/pengelola/report';
import {
    Bell,
    Building2,
    CalendarDays,
    ClipboardList,
    CreditCard,
    DollarSign,
    Dumbbell,
    FileText,
    History,
    Layers,
    LayoutDashboard,
    LogOut,
    Package,
    Settings,
    ShieldUser,
    ShoppingCart,
    Users,
    UserPlus,
    Wrench,
    X,
} from "lucide-react";

export type MenuItem = {
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    href: string;
};

export type MenuSection = {
    title: string;
    items: MenuItem[];
};

export const adminMenuSections: MenuSection[] = [
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
            { label: "Biaya Pendaftaran", icon: UserPlus, href: registrationPayment.url() },
            { label: "Biaya Gym", icon: CreditCard, href: gymFee.url() },
        ],
    },
    {
        title: "IVENTARIS",
        items: [
            { label: "Data Inventaris", icon: Package, href: inventory.url() },
            { label: "Peralatan Gym", icon: Dumbbell, href: gymEquipment.url() },
            { label: "Kategori", icon: Layers, href: category.url() },
            { label: "Perawatan Barang", icon: Wrench, href: maintenanceLogs.url() },
            { label: "Pemasok", icon: Building2, href: supplier.url() },
        ],
    },
    {
        title: "TRANSAKSI",
        items: [
            { label: "Pengadaan Barang", icon: ShoppingCart, href: procurement.url() },
            { label: "Riwayat Aktivitas", icon: History, href: activityLog.url() },
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
    {
        title: "SISTEM",
        items: [
            { label: "Laporan", icon: FileText, href: report.url() },
            { label: "Notifikasi", icon: Bell, href: notification.url() },
            { label: "Pengguna", icon: ShieldUser, href: userRoute.url() },
            { label: "Pengaturan", icon: Settings, href: settings.url() },
        ],
    },
];

export const pengelolaMenuSections: MenuSection[] = [
    {
        title: "UTAMA",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, href: pengelolaDashboard.url() },
        ],
    },
    {
        title: "IVENTARIS",
        items: [
            { label: "Data Inventaris", icon: Package, href: pengelolaInventory.url() },
            { label: "Peralatan Gym", icon: Dumbbell, href: pengelolaGymEquipment.url() },
            { label: "Perawatan Barang", icon: Wrench, href: pengelolaMaintenanceLogs.url() },
            { label: "Pemasok", icon: Building2, href: pengelolaSupplier.url() },
        ],
    },
    {
        title: "CETAK LAPORAN",
        items: [
            { label: "Laporan Barang", icon: ClipboardList, href: pengelolaReportBarang.url() },
            { label: "Laporan Keuangan", icon: DollarSign, href: pengelolaReportKeuangan.url() },
            { label: "Laporan Harian", icon: CalendarDays, href: pengelolaReportHarian.url() },
        ],
    },
];

export default function SidebarFitnessCenter({
    open,
    onClose,
    menuSections = adminMenuSections,
    subtitle = "Sistem Inventaris",
}: {
    open?: boolean;
    onClose?: () => void;
    menuSections?: MenuSection[];
    subtitle?: string;
}) {
    const { url, props } = usePage();
    const unreadNotifications = (props.unreadNotifications as number | undefined) ?? 0;
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const activeLink = container.querySelector<HTMLAnchorElement>('a.bg-primary');
        activeLink?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [url]);

    const isActive = (href: string) => {
        if (href === '#') return false;
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
                        {subtitle}
                    </p>
                </div>
                <button className="btn btn-ghost btn-square lg:hidden" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div ref={scrollRef} className="flex-1 px-3 py-3 overflow-y-auto">
                {menuSections.map((section) => (
                    <div key={section.title} className="mb-4">
                        <p className="px-3 mb-2 text-[11px] font-bold tracking-wide text-base-content/50">
                            {section.title}
                        </p>

                        <ul className="menu gap-1 w-full">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                const showBadge =
                                    item.href === notification.url() && unreadNotifications > 0;

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
                                            {showBadge && (
                                                <span className="badge badge-error badge-sm ml-auto text-error-content">
                                                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-base-300">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-xl bg-base-100/60 backdrop-blur-sm px-3 py-2 shadow-sm hover:bg-error/10 hover:text-error transition-colors"
                >
                    <LogOut size={18} strokeWidth={2} />
                    <span className="text-sm font-semibold">Logout</span>
                </Link>
            </div>
        </aside>
    );
}
