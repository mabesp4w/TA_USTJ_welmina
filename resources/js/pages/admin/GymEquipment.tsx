import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import GymEquipmentLayout from "@/components/layouts/admin/GymEquipmentLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/gymEquipment/StatCard";
import GymEquipmentListCard from "@/components/pages/admin/gymEquipment/GymEquipmentListCard";
import GymEquipmentForm from "@/components/pages/admin/gymEquipment/GymEquipmentForm";
import GymEquipmentDetail from "@/components/pages/admin/gymEquipment/GymEquipmentDetail";
import { show, destroy } from "@/routes/admin/gym-equipment";
import type { CategoryItem, DetailResponse, Stats } from "@/components/pages/admin/gymEquipment/types";

function GymEquipmentPage({
    categories,
    stats,
}: {
    categories: CategoryItem[];
    stats: Stats;
}) {
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
    const [editData, setEditData] = useState<DetailResponse | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (cat: CategoryItem) => {
        setSelectedCategory(cat);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ gymEquipment: cat.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail peralatan");
        }

        setDetailLoading(false);
    };

    const openEdit = async (cat: CategoryItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ gymEquipment: cat.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data peralatan");
        }

        setEditLoading(false);
    };

    const confirmDelete = (cat: CategoryItem) => {
        setSelectedCategory(cat);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedCategory) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ gymEquipment: selectedCategory.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("peralatan peralatan berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedCategory(null);
            },
            onError: () => {
                toast.error("Gagal menghapus peralatan peralatan");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("category-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        { title: "Total peralatan", value: String(stats.total), subtitle: "Seluruh peralatan" },
        { title: "Memiliki Barang", value: String(stats.withItems), subtitle: "peralatan terisi" },
        { title: "Kosong", value: String(stats.empty), subtitle: "Belum ada barang" },
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

                            <GymEquipmentListCard
                                categories={categories}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="category-modal" title="Tambah peralatan Peralatan" size="3xl">
                <GymEquipmentForm onCancel={closeForm} onSuccess={closeForm} />
            </Modal>

            <Modal id="edit-modal" title="Edit peralatan Peralatan" size="3xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <GymEquipmentForm
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            category={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail peralatan" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <GymEquipmentDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus peralatan{" "}
                    <span className="font-semibold text-base-content">{selectedCategory?.categoryName}</span>?
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
