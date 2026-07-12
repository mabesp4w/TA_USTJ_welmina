import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import CategoryLayout from "@/components/layouts/admin/CategoryLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/category/StatCard";
import CategoryListCard from "@/components/pages/admin/category/CategoryListCard";
import CategoryForm from "@/components/pages/admin/category/CategoryForm";
import CategoryDetail from "@/components/pages/admin/category/CategoryDetail";
import Pagination from "@/components/ui/Pagination";
import { show, destroy } from "@/routes/admin/category";
import type { CategoryItem, DetailResponse, Stats } from "@/components/pages/admin/category/types";
import type { PaginatedData } from "@/types";

function CategoryPage({
    categories,
    stats,
}: {
    categories: PaginatedData<CategoryItem>;
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
            const res = await fetch(show.url({ category:cat.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail kategori");
        }

        setDetailLoading(false);
    };

    const openEdit = async (cat: CategoryItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ category:cat.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data kategori");
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

        router.delete(destroy.url({ category:selectedCategory.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Kategori berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedCategory(null);
            },
            onError: () => {
                toast.error("Gagal menghapus kategori");
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
        { title: "Total Kategori", value: String(stats.total), subtitle: "Seluruh kategori" },
        { title: "Memiliki Barang", value: String(stats.withItems), subtitle: "Kategori terisi" },
        { title: "Kosong", value: String(stats.empty), subtitle: "Belum ada barang" },
    ];

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" data-aos="flip-up">
                                {statCards.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <CategoryListCard
                                categories={categories.data}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={categories.links}
                                from={categories.from}
                                to={categories.to}
                                total={categories.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="category-modal" title="Tambah Kategori" size="3xl">
                <CategoryForm onCancel={closeForm} onSuccess={closeForm} />
            </Modal>

            <Modal id="edit-modal" title="Edit Kategori" size="3xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <CategoryForm
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            category={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Kategori" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <CategoryDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus kategori{" "}
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

CategoryPage.layout = (page: React.ReactNode) => <CategoryLayout>{page}</CategoryLayout>;

export default CategoryPage;
