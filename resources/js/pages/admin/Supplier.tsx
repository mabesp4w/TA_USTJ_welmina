import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import SupplierLayout from "@/components/layouts/admin/SupplierLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/supplier/StatCard";
import SupplierListCard from "@/components/pages/admin/supplier/SupplierListCard";
import SupplierForm from "@/components/pages/admin/supplier/SupplierForm";
import SupplierDetail from "@/components/pages/admin/supplier/SupplierDetail";
import Pagination from "@/components/ui/Pagination";
import { show, destroy } from "@/routes/admin/supplier";
import type { SupplierItem, DetailResponse, Stats } from "@/components/pages/admin/supplier/types";
import type { PaginatedData } from "@/types";

function SupplierPage({
    suppliers,
    stats,
}: {
    suppliers: PaginatedData<SupplierItem>;
    stats: Stats;
}) {
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
    const [editData, setEditData] = useState<DetailResponse | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (item: SupplierItem) => {
        setSelectedSupplier(item);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ supplier: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail pemasok");
        }

        setDetailLoading(false);
    };

    const openEdit = async (item: SupplierItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ supplier: item.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data pemasok");
        }

        setEditLoading(false);
    };

    const confirmDelete = (item: SupplierItem) => {
        setSelectedSupplier(item);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedSupplier) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ supplier: selectedSupplier.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data pemasok berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedSupplier(null);
            },
            onError: () => {
                toast.error("Gagal menghapus data pemasok");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("supplier-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        { title: "Total Pemasok", value: String(stats.total), subtitle: "Seluruh pemasok" },
        { title: "Memiliki Barang", value: String(stats.withItems), subtitle: "Pemasok terhubung" },
    ];

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" data-aos="fade-left">
                                {statCards.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <SupplierListCard
                                suppliers={suppliers.data}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={suppliers.links}
                                from={suppliers.from}
                                to={suppliers.to}
                                total={suppliers.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="supplier-modal" title="Tambah Pemasok" size="3xl">
                <SupplierForm onCancel={closeForm} onSuccess={closeForm} />
            </Modal>

            <Modal id="edit-modal" title="Edit Pemasok" size="3xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <SupplierForm
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            supplier={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Pemasok" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <SupplierDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus pemasok{" "}
                    <span className="font-semibold text-base-content">{selectedSupplier?.supplierName}</span>?
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

SupplierPage.layout = (page: React.ReactNode) => <SupplierLayout>{page}</SupplierLayout>;

export default SupplierPage;
