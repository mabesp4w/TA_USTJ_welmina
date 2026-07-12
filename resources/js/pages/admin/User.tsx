import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import UserLayout from "@/components/layouts/admin/UserLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/user/StatCard";
import UserListCard from "@/components/pages/admin/user/UserListCard";
import UserForm from "@/components/pages/admin/user/UserForm";
import UserDetail from "@/components/pages/admin/user/UserDetail";
import Pagination from "@/components/ui/Pagination";
import { show, destroy } from "@/routes/admin/user";
import { user as userRoute } from "@/routes/admin";
import type { UserItem, DetailResponse, Stats } from "@/components/pages/admin/user/types";
import type { PaginatedData } from "@/types";

function UserPage({
    users,
    stats,
}: {
    users: PaginatedData<UserItem>;
    stats: Stats;
}) {
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
    const [editData, setEditData] = useState<DetailResponse | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (item: UserItem) => {
        setSelectedUser(item);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ user: item.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail pengguna");
        }

        setDetailLoading(false);
    };

    const openEdit = async (item: UserItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ user: item.id }));
            const data: DetailResponse = await res.json();
            setEditData(data);
        } catch {
            toast.error("Gagal memuat data pengguna");
        }

        setEditLoading(false);
    };

    const confirmDelete = (item: UserItem) => {
        setSelectedUser(item);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedUser) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ user: selectedUser.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Pengguna berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedUser(null);
            },
            onError: () => {
                toast.error("Gagal menghapus pengguna");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("user-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const roleNames: Record<string, string> = {
        administrator: "Administrator",
        pengelola: "Pengelola",
        pimpinan: "Pimpinan",
    };

    const statCards = [
        { title: "Total Pengguna", value: String(stats.total), subtitle: "Seluruh pengguna" },
        { title: "Aktif", value: String(stats.active), subtitle: "Pengguna aktif" },
        { title: "Role Terbanyak", value: Object.keys(stats.roles)[0] ? (roleNames[Object.keys(stats.roles)[0]] ?? Object.keys(stats.roles)[0]) : "-", subtitle: "Role paling banyak" },
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

                            <UserListCard
                                users={users.data}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={users.links}
                                from={users.from}
                                to={users.to}
                                total={users.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="user-modal" title="Tambah Pengguna" size="3xl">
                <UserForm onCancel={closeForm} onSuccess={closeForm} />
            </Modal>

            <Modal id="edit-modal" title="Edit Pengguna" size="3xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <UserForm
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            user={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Pengguna" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <UserDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus pengguna{" "}
                    <span className="font-semibold text-base-content">{selectedUser?.fullName}</span>?
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

UserPage.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;

export default UserPage;
