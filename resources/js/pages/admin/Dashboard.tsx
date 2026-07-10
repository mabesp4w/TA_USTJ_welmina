import { Search } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import StatCard from "@/components/pages/admin/dashboard/StatCard";
import SimpleListCard from "@/components/pages/admin/dashboard/SimpleListCard";
import MaintenanceCard from "@/components/pages/admin/dashboard/MaintenanceCard";
import type { ListItem } from "@/components/pages/admin/dashboard/types";

type StatCardData = {
    title: string;
    value: string;
    subtitle: string;
};

const statCards: StatCardData[] = [
    {
        title: "Total Inventaris",
        value: "247",
        subtitle: "Item baru 12",
    },
    {
        title: "Kondisi Bagus",
        value: "80%",
        subtitle: "198/247 item baik",
    },
    {
        title: "Perlu Perawatan",
        value: "34",
        subtitle: "Perlu tindakan",
    },
    {
        title: "Rusak Tidak Layak",
        value: "15",
        subtitle: "Segera diganti",
    },
];

const categories: ListItem[] = [
    { name: "Beban Bebas" },
    { name: "Kardio" },
    { name: "Mesin Kabel" },
    { name: "Aksesoris" },
    { name: "Lainnya" },
];

const activities: ListItem[] = [
    { name: "Barbell 20kg ditambahkan", meta: "5 menit lalu" },
    { name: "Treadmill TM-03 diservis", meta: "1 jam lalu" },
    { name: "Matras Yoga dipindahkan", meta: "3 jam lalu" },
];

const maintenance: ListItem[] = [
    { name: "Treadmill TM-03", meta: "Servis terjadwal" },
    { name: "Barbell 20kg", meta: "Karat ringan" },
    { name: "Treadmill RM-03", meta: "Perlu perbaikan" },
    { name: "Rowing Machine", meta: "Dijadwalkan inspeksi" },
    { name: "Matras Yoga", meta: "Sobek ringan" },
];

function DashboardPage() {
    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                <div className="card">
                    <div className="card-body gap-6 p-4 md:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {statCards.map((card) => (
                                <StatCard
                                    key={card.title}
                                    title={card.title}
                                    value={card.value}
                                    subtitle={card.subtitle}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                                            <p className="mt-2 text-2xl font-bold">232</p>
                                        </div>

                                        <div className="rounded-box border border-base-200 p-4">
                                            <p className="text-xs uppercase tracking-wide text-base-content/60">
                                                Barang Baru
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">12</p>
                                        </div>

                                        <div className="rounded-box border border-base-200 p-4">
                                            <p className="text-xs uppercase tracking-wide text-base-content/60">
                                                Sedang Diservis
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">8</p>
                                        </div>

                                        <div className="rounded-box border border-base-200 p-4">
                                            <p className="text-xs uppercase tracking-wide text-base-content/60">
                                                Perlu Diganti
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">15</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100/70 backdrop-blur-sm">
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
                                    <tr>
                                        <td>Barbell 20kg</td>
                                        <td>Beban Bebas</td>
                                        <td>
                                            <span className="badge badge-success badge-sm">Baik</span>
                                        </td>
                                        <td>Area Beban</td>
                                        <td>5 menit lalu</td>
                                    </tr>
                                    <tr>
                                        <td>Treadmill TM-03</td>
                                        <td>Kardio</td>
                                        <td>
                                            <span className="badge badge-warning badge-sm">
                                                Perawatan
                                            </span>
                                        </td>
                                        <td>Zona Kardio</td>
                                        <td>1 jam lalu</td>
                                    </tr>
                                    <tr>
                                        <td>Matras Yoga</td>
                                        <td>Aksesoris</td>
                                        <td>
                                            <span className="badge badge-error badge-sm">Rusak</span>
                                        </td>
                                        <td>Studio</td>
                                        <td>3 jam lalu</td>
                                    </tr>
                                    <tr>
                                        <td>Rowing Machine</td>
                                        <td>Kardio</td>
                                        <td>
                                            <span className="badge badge-warning badge-sm">
                                                Cek Rutin
                                            </span>
                                        </td>
                                        <td>Zona Kardio</td>
                                        <td>Kemarin</td>
                                    </tr>
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
    <AdminLayout
        actions={
            <>
                <label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
                    <Search size={16} className="opacity-70" />
                    <input type="text" placeholder="Cari inventaris" />
                </label>

                <button className="btn btn-primary">Cari</button>
            </>
        }
    >
        {page}
    </AdminLayout>
);

export default DashboardPage;
