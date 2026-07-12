import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import ProcurementLayout from "@/components/layouts/admin/ProcurementLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/procurement/StatCard";
import ProcurementListCard from "@/components/pages/admin/procurement/ProcurementListCard";
import ProcurementForm from "@/components/pages/admin/procurement/ProcurementForm";
import ProcurementDetail from "@/components/pages/admin/procurement/ProcurementDetail";
import Pagination from "@/components/ui/Pagination";
import { show, destroy } from "@/routes/admin/procurement";
import type { ProcurementItem, DetailResponse, Stats, ItemOption, SupplierOption } from "@/components/pages/admin/procurement/types";
import type { PaginatedData } from "@/types";

function ProcurementPage({
    procurements,
    stats,
    items,
    suppliers,
}: {
    procurements: PaginatedData<ProcurementItem>;
    stats: Stats;
    items: ItemOption[];
    suppliers: SupplierOption[];
}) {
    const [selectedProcurement, setSelectedProcurement] = useState<ProcurementItem | null>(null);
    const [editData, setEditData] = useState<DetailResponse | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (item: ProcurementItem) => {
        setSelectedProcurement(item);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ procurement: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail pengadaan");
        }

        setDetailLoading(false);
    };

    const openEdit = async (item: ProcurementItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ procurement: item.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data pengadaan");
        }

        setEditLoading(false);
    };

    const confirmDelete = (item: ProcurementItem) => {
        setSelectedProcurement(item);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedProcurement) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ procurement: selectedProcurement.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data pengadaan berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedProcurement(null);
            },
            onError: () => {
                toast.error("Gagal menghapus data pengadaan");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("procurement-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        { title: "Total Pengadaan", value: String(stats.total), subtitle: "Seluruh transaksi" },
        { title: "Total Barang", value: String(stats.totalQuantity), subtitle: "Jumlah barang" },
        { title: "Total Pengeluaran", value: `Rp ${stats.totalSpending.toLocaleString("id-ID")}`, subtitle: "Seluruh pengeluaran" },
    ];

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" data-aos="fade-left">
                                {statCards.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <ProcurementListCard
                                procurements={procurements.data}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={procurements.links}
                                from={procurements.from}
                                to={procurements.to}
                                total={procurements.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="procurement-modal" title="Tambah Pengadaan" size="3xl">
                <ProcurementForm
                    onCancel={closeForm}
                    onSuccess={closeForm}
                    items={items}
                    suppliers={suppliers}
                />
            </Modal>

            <Modal id="edit-modal" title="Edit Pengadaan" size="3xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <ProcurementForm
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            procurement={editData}
                            items={items}
                            suppliers={suppliers}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Pengadaan" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <ProcurementDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus pengadaan{" "}
                    <span className="font-semibold text-base-content">{selectedProcurement?.procurementCode}</span>?
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

ProcurementPage.layout = (page: React.ReactNode) => <ProcurementLayout>{page}</ProcurementLayout>;

export default ProcurementPage;
