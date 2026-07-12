import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import MaintenanceLogLayout from "@/components/layouts/admin/MaintenanceLogLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/maintenanceLog/StatCard";
import MaintenanceLogListCard from "@/components/pages/admin/maintenanceLog/MaintenanceLogListCard";
import MaintenanceLogForm from "@/components/pages/admin/maintenanceLog/MaintenanceLogForm";
import MaintenanceLogDetail from "@/components/pages/admin/maintenanceLog/MaintenanceLogDetail";
import Pagination from "@/components/ui/Pagination";
import { show, destroy } from "@/routes/admin/maintenance-logs";
import type { MaintenanceLogItem, DetailResponse, Stats, InventoryItemOption } from "@/components/pages/admin/maintenanceLog/types";
import type { PaginatedData } from "@/types";

function MaintenanceLogPage({
    logs,
    stats,
    inventoryItems,
}: {
    logs: PaginatedData<MaintenanceLogItem>;
    stats: Stats;
    inventoryItems: InventoryItemOption[];
}) {
    const [selectedLog, setSelectedLog] = useState<MaintenanceLogItem | null>(null);
    const [editData, setEditData] = useState<DetailResponse | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (item: MaintenanceLogItem) => {
        setSelectedLog(item);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ maintenanceLog: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail perawatan");
        }

        setDetailLoading(false);
    };

    const openEdit = async (item: MaintenanceLogItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ maintenanceLog: item.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data perawatan");
        }

        setEditLoading(false);
    };

    const confirmDelete = (item: MaintenanceLogItem) => {
        setSelectedLog(item);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedLog) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ maintenanceLog: selectedLog.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data perawatan berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedLog(null);
            },
            onError: () => {
                toast.error("Gagal menghapus data perawatan");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("maintenance-log-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        { title: "Total Perawatan", value: String(stats.total), subtitle: "Seluruh riwayat perawatan" },
        { title: "Total Biaya", value: `Rp ${stats.totalCost.toLocaleString("id-ID")}`, subtitle: "Total biaya perawatan" },
        { title: "Perbaikan", value: String(stats.perbaikan), subtitle: "Jenis perbaikan" },
        { title: "Perawatan", value: String(stats.perawatan), subtitle: "Jenis perawatan rutin" },
    ];

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-aos="fade-up" data-aos-delay="100">
                                {statCards.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <MaintenanceLogListCard
                                logs={logs.data}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={logs.links}
                                from={logs.from}
                                to={logs.to}
                                total={logs.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="maintenance-log-modal" title="Tambah Perawatan" size="4xl">
                <MaintenanceLogForm
                    inventoryItems={inventoryItems}
                    onCancel={closeForm}
                    onSuccess={closeForm}
                />
            </Modal>

            <Modal id="edit-modal" title="Edit Perawatan" size="4xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <MaintenanceLogForm
                            inventoryItems={inventoryItems}
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            maintenanceLog={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Perawatan" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <MaintenanceLogDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus data perawatan untuk{" "}
                    <span className="font-semibold text-base-content">{selectedLog?.itemName}</span>?
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

MaintenanceLogPage.layout = (page: React.ReactNode) => <MaintenanceLogLayout>{page}</MaintenanceLogLayout>;

export default MaintenanceLogPage;
