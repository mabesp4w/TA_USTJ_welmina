import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import GymFeeLayout from "@/components/layouts/admin/GymFeeLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/gymFee/StatCard";
import GymFeeListCard from "@/components/pages/admin/gymFee/GymFeeListCard";
import GymFeeForm from "@/components/pages/admin/gymFee/GymFeeForm";
import GymFeeDetail from "@/components/pages/admin/gymFee/GymFeeDetail";
import { show, destroy } from "@/routes/admin/gym-fee";
import type { PackageItem, DetailResponse, Stats } from "@/components/pages/admin/gymFee/types";

function GymFeePage({ packages, stats }: { packages: PackageItem[]; stats: Stats }) {
    const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
    const [editData, setEditData] = useState<DetailResponse | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (pkg: PackageItem) => {
        setSelectedPackage(pkg);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ gymFee: pkg.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail paket");
        }

        setDetailLoading(false);
    };

    const openEdit = async (pkg: PackageItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ gymFee: pkg.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data paket");
        }

        setEditLoading(false);
    };

    const confirmDelete = (pkg: PackageItem) => {
        setSelectedPackage(pkg);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedPackage) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ gymFee: selectedPackage.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data paket gym berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedPackage(null);
            },
            onError: () => {
                toast.error("Gagal menghapus data paket gym");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("gym-fee-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        { title: "Total Paket", value: String(stats.total), subtitle: "Seluruh paket" },
        { title: "Aktif", value: String(stats.active), subtitle: "Paket aktif" },
        { title: "Nonaktif", value: String(stats.inactive), subtitle: "Paket nonaktif" },
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

                            <GymFeeListCard
                                packages={packages}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="gym-fee-modal" title="Tambah Paket Gym" size="4xl">
                <GymFeeForm onCancel={closeForm} onSuccess={closeForm} />
            </Modal>

            <Modal id="edit-modal" title="Edit Paket Gym" size="4xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <GymFeeForm
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            gymFee={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Paket Gym" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <GymFeeDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus paket{" "}
                    <span className="font-semibold text-base-content">{selectedPackage?.packageName}</span>?
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

GymFeePage.layout = (page: React.ReactNode) => <GymFeeLayout>{page}</GymFeeLayout>;

export default GymFeePage;
