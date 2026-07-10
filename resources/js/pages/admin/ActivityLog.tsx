import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import ActivityLogLayout from "@/components/layouts/admin/ActivityLogLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/activityLog/StatCard";
import ActivityLogListCard from "@/components/pages/admin/activityLog/ActivityLogListCard";
import ActivityLogDetail from "@/components/pages/admin/activityLog/ActivityLogDetail";
import { show, destroy } from "@/routes/admin/activity-log";
import type { ActivityLogItem, DetailResponse, Stats } from "@/components/pages/admin/activityLog/types";

function ActivityLogPage({
    logs,
    stats,
}: {
    logs: ActivityLogItem[];
    stats: Stats;
}) {
    const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (item: ActivityLogItem) => {
        setSelectedLog(item);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ activityLog: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail aktivitas");
        }

        setDetailLoading(false);
    };

    const confirmDelete = (item: ActivityLogItem) => {
        setSelectedLog(item);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedLog) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ activityLog: selectedLog.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Log berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedLog(null);
            },
            onError: () => {
                toast.error("Gagal menghapus log");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const typeNames: Record<string, string> = {
        tambah: "Tambah",
        servis: "Servis",
        pinjam: "Pinjam",
        kembali: "Kembali",
        rusak: "Rusak",
        pengadaan: "Pengadaan",
        pembayaran: "Pembayaran",
        pendaftaran: "Pendaftaran",
        lainnya: "Lainnya",
    };

    const statCards = [
        { title: "Total Aktivitas", value: String(stats.total), subtitle: "Seluruh aktivitas" },
        { title: "Hari Ini", value: String(stats.today), subtitle: "Aktivitas hari ini" },
        { title: "Tipe Terbanyak", value: Object.keys(stats.types)[0] ? (typeNames[Object.keys(stats.types)[0]] ?? Object.keys(stats.types)[0]) : "-", subtitle: "Aktivitas paling sering" },
    ];

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {statCards.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <ActivityLogListCard
                                logs={logs}
                                onDetail={openDetail}
                                onDelete={confirmDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="detail-modal" title="Detail Aktivitas" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <ActivityLogDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus log aktivitas{" "}
                    <span className="font-semibold text-base-content">"{selectedLog?.activityName}"</span>?
                    Data yang sudah dihapus tidak dapat dikembalikan.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => document.getElementById("delete-modal")?.close()}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        className="btn btn-error"
                        disabled={deleteLoading}
                        onClick={handleDelete}
                    >
                        {deleteLoading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            "Hapus"
                        )}
                    </button>
                </div>
            </Modal>
        </>
    );
}

ActivityLogPage.layout = (page: React.ReactNode) => <ActivityLogLayout>{page}</ActivityLogLayout>;

export default ActivityLogPage;
