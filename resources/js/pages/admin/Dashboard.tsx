import AdminLayout from "@/components/layouts/admin/AdminLayout";
import StatCard from "@/components/pages/admin/dashboard/StatCard";
import SimpleListCard from "@/components/pages/admin/dashboard/SimpleListCard";
import MaintenanceCard from "@/components/pages/admin/dashboard/MaintenanceCard";
import type { ListItem } from "@/components/pages/admin/dashboard/types";

type StatCardData = {
    title: string;
    value: string;
    subtitle: string;
};

type RecentItem = {
    itemName: string;
    categoryName: string;
    itemCondition: string;
    locationName: string | null;
    updated: string;
};

type QuickSummary = {
    aktif: number;
    barangBaru: number;
    sedangDiservis: number;
    perluDiganti: number;
};

const conditionBadge: Record<string, string> = {
    baik: "badge-success",
    perlu_perawatan: "badge-warning",
    rusak: "badge-error",
};

const conditionLabel: Record<string, string> = {
    baik: "Baik",
    perlu_perawatan: "Perlu Perawatan",
    rusak: "Rusak",
};

function DashboardPage({
    stats,
    categories,
    activities,
    maintenance,
    quickSummary,
    recentItems,
}: {
    stats: StatCardData[];
    categories: ListItem[];
    activities: ListItem[];
    maintenance: ListItem[];
    quickSummary: QuickSummary;
    recentItems: RecentItem[];
}) {
    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                <div className="card">
                    <div className="card-body gap-6 p-4 md:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-aos="fade-down">
                            {stats.map((card) => (
                                <StatCard
                                    key={card.title}
                                    title={card.title}
                                    value={card.value}
                                    subtitle={card.subtitle}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" data-aos="fade-up" data-aos-delay="150">
                            <SimpleListCard
                                title="Distribusi Kategori"
                                items={categories}
                                bulletClass="bg-success"
                            />

                            <SimpleListCard
                                title="Aktivitas Terbaru"
                                items={activities}
                                bulletClass="bg-info"
                            />

                            <MaintenanceCard
                                title="Perawatan Rutin"
                                items={maintenance}
                            />

                            <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                                <div className="card-body p-4">
                                    <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-base-content/70">
                                        Ringkasan Cepat
                                    </h2>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-box border border-base-200 p-4">
                                            <p className="text-xs uppercase tracking-wide text-base-content/60">
                                                Inventaris Aktif
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">{quickSummary.aktif}</p>
                                        </div>

                                        <div className="rounded-box border border-base-200 p-4">
                                            <p className="text-xs uppercase tracking-wide text-base-content/60">
                                                Barang Baru
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">{quickSummary.barangBaru}</p>
                                        </div>

                                        <div className="rounded-box border border-base-200 p-4">
                                            <p className="text-xs uppercase tracking-wide text-base-content/60">
                                                Sedang Diservis
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">{quickSummary.sedangDiservis}</p>
                                        </div>

                                        <div className="rounded-box border border-base-200 p-4">
                                            <p className="text-xs uppercase tracking-wide text-base-content/60">
                                                Perlu Diganti
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">{quickSummary.perluDiganti}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100/70 backdrop-blur-sm" data-aos="fade-up" data-aos-delay="300">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nama Barang</th>
                                        <th>Kategori</th>
                                        <th>Kondisi</th>
                                        <th>Lokasi</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-sm text-base-content/50">
                                                Belum ada data inventaris
                                            </td>
                                        </tr>
                                    ) : (
                                        recentItems.map((item) => (
                                            <tr key={item.itemName}>
                                                <td className="text-sm font-medium">{item.itemName}</td>
                                                <td className="text-sm text-base-content/70">{item.categoryName}</td>
                                                <td>
                                                    <span className={`badge badge-sm ${conditionBadge[item.itemCondition]}`}>
                                                        {conditionLabel[item.itemCondition]}
                                                    </span>
                                                </td>
                                                <td className="text-sm text-base-content/70">{item.locationName ?? "-"}</td>
                                                <td className="text-sm text-base-content/50">{item.updated}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

DashboardPage.layout = (page: React.ReactNode) => (
    <AdminLayout>
        {page}
    </AdminLayout>
);

export default DashboardPage;
