import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import RegistrationPaymentLayout from "@/components/layouts/admin/RegistrationPaymentLayout";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/pages/admin/registrationPayment/StatCard";
import RegistrationPaymentListCard from "@/components/pages/admin/registrationPayment/RegistrationPaymentListCard";
import RegistrationPaymentForm from "@/components/pages/admin/registrationPayment/RegistrationPaymentForm";
import RegistrationPaymentDetail from "@/components/pages/admin/registrationPayment/RegistrationPaymentDetail";
import Pagination from "@/components/ui/Pagination";
import FilterBar from "@/components/ui/FilterBar";
import { show, destroy } from "@/routes/admin/registration-payment";
import type { PaymentItem, MemberOption, PackageOption, DetailResponse, EditPaymentData } from "@/components/pages/admin/registrationPayment/types";
import type { PaginatedData } from "@/types";

function RegistrationPaymentPage({
    payments,
    stats,
    members,
    packages,
}: {
    payments: PaginatedData<PaymentItem>;
    stats: { revenue: number; newThisMonth: number; topPackageName: string; topPackageCount: number };
    members: MemberOption[];
    packages: PackageOption[];
}) {
    const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
    const [editData, setEditData] = useState<EditPaymentData | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [detailData, setDetailData] = useState<DetailResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDetail = async (payment: PaymentItem) => {
        setSelectedPayment(payment);
        setDetailLoading(true);
        setDetailData(null);

        document.getElementById("detail-modal")?.showModal();

        try {
            const res = await fetch(show.url({ registrationPayment: payment.id }));
            const data: DetailResponse = await res.json();
            setDetailData(data);
        } catch {
            toast.error("Gagal memuat detail pembayaran");
        }

        setDetailLoading(false);
    };

    const openEdit = async (payment: PaymentItem) => {
        setEditData(null);
        setEditLoading(true);

        document.getElementById("edit-modal")?.showModal();

        try {
            const res = await fetch(show.url({ registrationPayment: payment.id }));
            const data: DetailResponse = await res.json();
            setEditData({
                id: data.id,
                memberId: data.memberId,
                packageId: data.packageId,
                durationMonths: data.durationMonths,
                startDate: data.startDate,
                registrationDate: data.registrationDate,
                registrationFee: data.registrationFee,
                amount: data.amount,
                adminFee: data.adminFee,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                notes: data.notes,
            });
        } catch {
            toast.error("Gagal memuat data pembayaran");
        }

        setEditLoading(false);
    };

    const confirmDelete = (payment: PaymentItem) => {
        setSelectedPayment(payment);
        document.getElementById("delete-modal")?.showModal();
    };

    const handleDelete = () => {
        if (!selectedPayment) return;

        setDeleteLoading(true);

        router.delete(destroy.url({ registrationPayment: selectedPayment.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data biaya pendaftaran berhasil dihapus!");
                document.getElementById("delete-modal")?.close();
                setSelectedPayment(null);
            },
            onError: () => {
                toast.error("Gagal menghapus data biaya pendaftaran");
            },
            onFinish: () => setDeleteLoading(false),
        });
    };

    const closeForm = () => {
        document.getElementById("payment-modal")?.close();
    };

    const closeEditForm = () => {
        setEditData(null);
        document.getElementById("edit-modal")?.close();
    };

    const statCards = [
        {
            title: "Pendapatan Pendaftaran",
            value: `Rp ${stats.revenue.toLocaleString("id-ID")}`,
            subtitle: "Total pembayaran lunas",
        },
        {
            title: "Pendaftaran Baru",
            value: String(stats.newThisMonth),
            subtitle: "Bulan ini",
        },
        {
            title: "Paket Terpopuler",
            value: stats.topPackageName,
            subtitle: `${stats.topPackageCount} pendaftaran`,
        },
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

                            <FilterBar
                                filters={[
                                    {
                                        name: "package",
                                        label: "Paket",
                                        col: 4,
                                        options: packages.map((p) => ({
                                            value: String(p.id),
                                            label: p.packageName,
                                        })),
                                    },
                                    {
                                        name: "status",
                                        label: "Status",
                                        col: 4,
                                        options: [
                                            { value: "paid", label: "Lunas" },
                                            { value: "unpaid", label: "Belum Dibayar" },
                                        ],
                                    },
                                ]}
                            />

                            <RegistrationPaymentListCard
                                payments={payments.data}
                                onDetail={openDetail}
                                onEdit={openEdit}
                                onDelete={confirmDelete}
                            />

                            <Pagination
                                links={payments.links}
                                from={payments.from}
                                to={payments.to}
                                total={payments.total}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal id="payment-modal" title="Tambah Biaya Pendaftaran" size="4xl">
                <RegistrationPaymentForm
                    members={members}
                    packages={packages}
                    onCancel={closeForm}
                    onSuccess={closeForm}
                />
            </Modal>

            <Modal id="edit-modal" title="Edit Biaya Pendaftaran" size="4xl">
                {editLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    editData && (
                        <RegistrationPaymentForm
                            members={members}
                            packages={packages}
                            onCancel={closeEditForm}
                            onSuccess={closeEditForm}
                            payment={editData}
                        />
                    )
                )}
            </Modal>

            <Modal id="detail-modal" title="Detail Biaya Pendaftaran" size="3xl">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <RegistrationPaymentDetail data={detailData} />
                )}
            </Modal>

            <Modal id="delete-modal" title="Konfirmasi Hapus" size="sm">
                <p className="text-sm leading-relaxed text-base-content/70">
                    Apakah Anda yakin ingin menghapus biaya pendaftaran member{" "}
                    <span className="font-semibold text-base-content">{selectedPayment?.memberName}</span>?
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

RegistrationPaymentPage.layout = (page: React.ReactNode) => <RegistrationPaymentLayout>{page}</RegistrationPaymentLayout>;

export default RegistrationPaymentPage;
