import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Eye, Pencil, Trash2, ImageOff } from "lucide-react";
import GymEquipmentLayout from "@/components/layouts/admin/GymEquipmentLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/inventory/StatCard";
import InventoryForm from "@/components/pages/admin/inventory/InventoryForm";
import InventoryDetail from "@/components/pages/admin/inventory/InventoryDetail";
import InventoryFilter from "@/components/pages/admin/inventory/InventoryFilter";
import Pagination from "@/components/ui/Pagination";
import { show, destroy, store as gymStore, update as gymUpdate } from "@/routes/admin/gym-equipment";
import type { InventoryItem, DetailResponse, Stats, CategoryOption, SupplierOption } from "@/components/pages/admin/inventory/types";
import type { PaginatedData } from "@/types";

function GymEquipmentPage({
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

    const openDetail = async (item: InventoryItem) => {
        setSelectedItem(item);
        setDetailLoading(true);
        setDetailData(null);
        document.getElementById("detail-modal")?.showModal();
        try {
            const res = await fetch(show.url({ gymEquipment: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail peralatan");
        }
        setDetailLoading(false);
    };

    const openEdit = async (item: InventoryItem) => {
        setEditData(null);
        setEditLoading(true);
        document.getElementById("edit-modal")?.showModal();
        try {
            const res = await fetch(show.url({ gymEquipment: item.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data peralatan");
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
        router.delete(destroy.url({ gymEquipment: selectedItem.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Peralatan berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedItem(null);
            },
            onError: () => toast.error("Gagal menghapus peralatan"),
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => document.getElementById("inventory-modal")?.close();
    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        { title: "Total Peralatan", value: String(stats.total), subtitle: "Seluruh peralatan fitness" },
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

                            <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                                <div className="card-body p-4 md:p-5">
                                    <h2 className="text-lg font-bold text-base-content">Daftar Peralatan Fitness</h2>
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {items.data.length === 0 ? (
                                            <div className="col-span-full py-12 text-center text-sm text-base-content/50">
                                                Belum ada peralatan fitness
                                            </div>
                                        ) : (
                                            items.data.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="rounded-box border border-base-300 bg-base-200/40 overflow-hidden"
                                                >
                                                    {item.imagePath ? (
                                                        <img
                                                            src={item.imagePath}
                                                            alt={item.itemName}
                                                            className="h-36 w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-36 items-center justify-center bg-base-300/30">
                                                            <ImageOff size={32} className="text-base-content/30" />
                                                        </div>
                                                    )}

                                                    <div className="p-3">
                                                        <p className="text-sm font-bold text-base-content">{item.itemName}</p>
                                                        <p className="text-xs text-base-content/50 font-mono">{item.itemCode}</p>

                                                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                                            <span className={`badge badge-sm ${conditionBadge[item.itemCondition]}`}>
                                                                {conditionLabel[item.itemCondition]}
                                                            </span>
                                                            <span className={`badge badge-sm ${item.itemStatus === "aktif" ? "badge-success" : "badge-error"}`}>
                                                                {item.itemStatus === "aktif" ? "Aktif" : "Nonaktif"}
                                                            </span>
                                                        </div>

                                                        <div className="mt-2 flex items-center gap-2 text-xs text-base-content/60">
                                                            <span>{item.categoryName}</span>
                                                            <span>·</span>
                                                            <span className="font-semibold">Stok: {item.stock}</span>
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-end gap-1 border-t border-base-300 pt-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-xs btn-square"
                                                                onClick={() => openDetail(item)}
                                                                title="Detail"
                                                            >
                                                                <Eye size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-xs btn-square"
                                                                onClick={() => openEdit(item)}
                                                                title="Edit"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-xs btn-square text-error"
                                                                onClick={() => confirmDelete(item)}
                                                                title="Hapus"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

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

            <Modal id="inventory-modal" title="Tambah Peralatan Fitness" size="4xl">
                <InventoryForm
                    categories={categories}
                    suppliers={suppliers}
                    onCancel={closeForm}
                    onSuccess={closeForm}
                    storeUrl={gymStore.url()}
                    updateUrl={(id) => gymUpdate.url({ gymEquipment: id })}
                />
            </Modal>

            <Modal id="edit-modal" title="Edit Peralatan Fitness" size="4xl">
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
                            storeUrl={gymStore.url()}
                            updateUrl={(id) => gymUpdate.url({ gymEquipment: id })}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Peralatan" size="3xl">
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
                    Apakah Anda yakin ingin menghapus peralatan{" "}
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

GymEquipmentPage.layout = (page: React.ReactNode) => <GymEquipmentLayout>{page}</GymEquipmentLayout>;

export default GymEquipmentPage;
