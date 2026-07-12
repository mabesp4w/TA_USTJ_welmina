import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import NotificationLayout from "@/components/layouts/admin/NotificationLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/notification/StatCard";
import NotificationListCard from "@/components/pages/admin/notification/NotificationListCard";
import NotificationDetail from "@/components/pages/admin/notification/NotificationDetail";
import Pagination from "@/components/ui/Pagination";
import { show, destroy } from "@/routes/admin/notification";
import type { NotificationItem, DetailResponse, Stats } from "@/components/pages/admin/notification/types";
import type { PaginatedData } from "@/types";

function NotificationPage({
    notifications,
    stats,
}: {
    notifications: PaginatedData<NotificationItem>;
    stats: Stats;
}) {
    const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (item: NotificationItem) => {
        setSelectedNotification(item);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ notification: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail notifikasi");
        }

        setDetailLoading(false);
    };

    const confirmDelete = (item: NotificationItem) => {
        setSelectedNotification(item);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedNotification) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ notification: selectedNotification.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Notifikasi berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedNotification(null);
            },
            onError: () => {
                toast.error("Gagal menghapus notifikasi");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const statCards = [
        { title: "Total Notifikasi", value: String(stats.total), subtitle: "Seluruh notifikasi" },
        { title: "Belum Dibaca", value: String(stats.unread), subtitle: "Notifikasi baru" },
        { title: "Hari Ini", value: String(stats.recentToday), subtitle: "Notifikasi hari ini" },
    ];

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" data-aos="fade-up">
                                {statCards.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <NotificationListCard
                                notifications={notifications.data}
                                onDetail={openDetail}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={notifications.links}
                                from={notifications.from}
                                to={notifications.to}
                                total={notifications.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="detail-modal" title="Detail Notifikasi" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <NotificationDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus notifikasi{" "}
                    <span className="font-semibold text-base-content">"{selectedNotification?.title}"</span>?
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

NotificationPage.layout = (page: React.ReactNode) => <NotificationLayout>{page}</NotificationLayout>;

export default NotificationPage;
