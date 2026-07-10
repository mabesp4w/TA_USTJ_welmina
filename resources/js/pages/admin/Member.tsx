import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import MemberLayout from "@/components/layouts/MemberLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/member/StatCard";
import MemberListCard from "@/components/pages/admin/member/MemberListCard";
import MemberForm from "@/components/pages/admin/member/MemberForm";
import MemberDetail from "@/components/pages/admin/member/MemberDetail";
import { show, destroy } from "@/routes/admin/member";
import type { Stat, MemberItem, PackageOption } from "@/components/pages/admin/member/types";

type DetailResponse = {
    member: {
        id: number;
        memberCode: string;
        fullName: string;
        identityNo: string | null;
        phone: string | null;
        birthDate: string | null;
        gender: string | null;
        email: string | null;
        address: string | null;
        memberStatus: string;
        joinedAt: string;
        createdBy: string | null;
    };
    membership: {
        packageName: string;
        durationMonths: number;
        startDate: string;
        endDate: string;
        status: string;
    } | null;
};

type EditMemberData = {
    id: number;
    fullName: string;
    identityNo: string | null;
    phone: string | null;
    birthDate: string | null;
    gender: string | null;
    email: string | null;
    address: string | null;
    memberStatus: string;
};

function MemberPage({ stats, members, packages }: { stats: Stat[]; members: MemberItem[]; packages: PackageOption[] }) {
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
    const [editData, setEditData] = useState<EditMemberData | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const filteredMembers = statusFilter
        ? members.filter((m) => m.status === statusFilter)
        : members;

    const handleFilterChange = (filter: string | null) => {
        setStatusFilter(filter);
    };

    const openDetail = async (member: MemberItem) => {
        setSelectedMember(member);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ member: member.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail member");
        }

        setDetailLoading(false);
    };

    const openEdit = async (member: MemberItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ member: member.id }));
            const data: DetailResponse = await res.json();
            setEditData(data.member);
        } catch {
            toast.error("Gagal memuat data member");
        }

        setEditLoading(false);
    };

    const confirmDelete = (member: MemberItem) => {
        setSelectedMember(member);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedMember) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ member: selectedMember.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data member berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedMember(null);
            },
            onError: () => {
                toast.error("Gagal menghapus data member");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("member-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    return (
        <>
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {stats.map((item) => (
                                    <StatCard key={item.title} {...item} />
                                ))}
                            </div>

                            <MemberListCard
                                members={filteredMembers}
                                activeFilter={statusFilter}
                                onFilterChange={handleFilterChange}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="member-modal" title="Input Data Member Baru" size="3xl">
                <MemberForm packages={packages} onCancel={closeForm} onSuccess={closeForm} />
            </Modal>

            <Modal id="edit-modal" title="Edit Data Member" size="3xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <MemberForm
                            packages={packages}
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            member={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Member" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <MemberDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus member{" "}
                    <span className="font-semibold text-base-content">{selectedMember?.name}</span>?
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

MemberPage.layout = (page: React.ReactNode) => <MemberLayout>{page}</MemberLayout>;

export default MemberPage;
