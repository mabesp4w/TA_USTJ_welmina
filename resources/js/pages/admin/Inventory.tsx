import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import InventoryLayout from "@/components/layouts/admin/InventoryLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/inventory/StatCard";
import InventoryListCard from "@/components/pages/admin/inventory/InventoryListCard";
import InventoryForm from "@/components/pages/admin/inventory/InventoryForm";
import InventoryDetail from "@/components/pages/admin/inventory/InventoryDetail";
import Pagination from "@/components/ui/Pagination";
import InventoryFilter from "@/components/pages/admin/inventory/InventoryFilter";
import { show, destroy } from "@/routes/admin/inventory";
import type { InventoryItem, DetailResponse, Stats, CategoryOption, SupplierOption } from "@/components/pages/admin/inventory/types";
import type { PaginatedData } from "@/types";

function InventoryPage({
    items,
    stats,
    categories,
    suppliers,
}: {
    items: PaginatedData<InventoryItem>;
    stats: Stats;
    categories: CategoryOption[];
    suppliers: SupplierOption[];
}) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [editData, setEditData] = useState<DetailResponse | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (item: InventoryItem) => {
        setSelectedItem(item);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ inventory: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail barang");
        }

        setDetailLoading(false);
    };

    const openEdit = async (item: InventoryItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ inventory: item.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data barang");
        }

        setEditLoading(false);
    };

    const confirmDelete = (item: InventoryItem) => {
        setSelectedItem(item);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ inventory: selectedItem.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data inventaris berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedItem(null);
            },
            onError: () => {
                toast.error("Gagal menghapus data inventaris");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("inventory-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        { title: "Total Barang", value: String(stats.total), subtitle: "Seluruh barang" },
        { title: "Baik", value: String(stats.baik), subtitle: "Kondisi baik" },
        { title: "Perlu Perawatan", value: String(stats.perluPerawatan), subtitle: "Perlu perawatan" },
        { title: "Rusak", value: String(stats.rusak), subtitle: "Kondisi rusak" },
    ];

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-aos="fade-up">
                                {statCards.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <InventoryFilter categories={categories} suppliers={suppliers} />

                            <InventoryListCard
                                items={items.data}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={items.links}
                                from={items.from}
                                to={items.to}
                                total={items.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="inventory-modal" title="Tambah Barang Inventaris" size="4xl">
                <InventoryForm
                    categories={categories}
                    suppliers={suppliers}
                    onCancel={closeForm}
                    onSuccess={closeForm}
                />
            </Modal>

            <Modal id="edit-modal" title="Edit Barang Inventaris" size="4xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <InventoryForm
                            categories={categories}
                            suppliers={suppliers}
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            inventory={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Barang" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <InventoryDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus barang{" "}
                    <span className="font-semibold text-base-content">{selectedItem?.itemName}</span>?
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

InventoryPage.layout = (page: React.ReactNode) => <InventoryLayout>{page}</InventoryLayout>;

export default InventoryPage;
