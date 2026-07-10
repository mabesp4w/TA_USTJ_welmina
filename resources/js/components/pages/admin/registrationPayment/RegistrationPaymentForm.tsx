import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { addMonths, format } from "date-fns";
import { User, Package, Calculator, Wallet, FileText, CalendarDays, Timer } from "lucide-react";
import InputField from "@/components/ui/InputField";
import RupiahInputField from "@/components/ui/RupiahInputField";
import SelectField from "@/components/ui/SelectField";
import DatePickerField from "@/components/ui/DatePickerField";
import { store, update } from "@/routes/admin/registration-payment";
import type { MemberOption, PackageOption, EditPaymentData } from "./types";

const schema = yup.object({
    memberId: yup.number().required("Member wajib dipilih"),
    packageId: yup.number().required("Paket wajib dipilih"),
    durationMonths: yup.number().required("Durasi wajib dipilih"),
    startDate: yup.date().required("Tanggal mulai wajib diisi"),
    registrationDate: yup.date().required("Tanggal pendaftaran wajib diisi"),
    registrationFee: yup.number().required("Biaya pendaftaran wajib diisi").min(0, "Tidak boleh negatif"),
    amount: yup.number().required("Biaya membership wajib diisi").min(0, "Tidak boleh negatif"),
    adminFee: yup.number().nullable().notRequired(),
    paymentMethod: yup.string().required("Metode pembayaran wajib dipilih"),
    paymentStatus: yup.string().required("Status pembayaran wajib dipilih"),
    notes: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export default function RegistrationPaymentForm({
    onSuccess,
    onCancel,
    members,
    packages,
    payment,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    members: MemberOption[];
    packages: PackageOption[];
    payment?: EditPaymentData | null;
}) {
    const isEdit = Boolean(payment);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            memberId: undefined,
            packageId: undefined,
            durationMonths: undefined,
            startDate: new Date(),
            registrationDate: new Date(),
            registrationFee: 0,
            amount: 0,
            adminFee: 0,
            paymentMethod: "",
            paymentStatus: "unpaid",
            notes: "",
        },
    });

    useEffect(() => {
        if (payment) {
            setValue("memberId", payment.memberId);
            setValue("packageId", payment.packageId);
            setValue("startDate", new Date(payment.startDate));
            setValue("registrationDate", new Date(payment.registrationDate));
            setValue("registrationFee", payment.registrationFee);
            setValue("amount", payment.amount);
            setValue("adminFee", payment.adminFee);
            setValue("paymentMethod", payment.paymentMethod);
            setValue("paymentStatus", payment.paymentStatus);
            setValue("notes", payment.notes ?? "");
        }
    }, [payment, setValue]);

    const selectedPackageId = watch("packageId");
    const selectedDuration = watch("durationMonths");
    const selectedStartDate = watch("startDate");

    const selectedPackage = packages.find((p) => p.id === selectedPackageId);
    const selectedPrice = selectedPackage?.prices.find(
        (p) => p.durationMonths === selectedDuration,
    );

    useEffect(() => {
        if (payment && selectedPackage) {
            setValue("durationMonths", payment.durationMonths);
        }
    }, [payment, selectedPackage, setValue]);

    const endDate =
        selectedDuration && selectedStartDate
            ? addMonths(new Date(selectedStartDate), selectedDuration)
            : null;

    useEffect(() => {
        if (!isEdit && selectedPackage) {
            setValue("registrationFee", selectedPackage.registrationFee);
        }
    }, [selectedPackage, isEdit, setValue]);

    useEffect(() => {
        if (!isEdit && selectedPrice) {
            setValue("amount", selectedPrice.price);
        }
    }, [selectedPrice, isEdit, setValue]);

    const registrationFee = watch("registrationFee") || 0;
    const amount = watch("amount") || 0;
    const adminFee = watch("adminFee") || 0;
    const totalFee = registrationFee + amount + adminFee;

    const onSubmit = (data: FormData) => {
        const payload = {
            ...data,
            adminFee: data.adminFee ?? 0,
        };

        if (isEdit && payment) {
            router.put(update.url({ registrationPayment: payment.id }), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data biaya pendaftaran berhasil diperbarui!");
                    reset();
                    onCancel?.();
                    onSuccess?.();
                },
                onError: (errors) => {
                    const messages = Object.values(errors).join(", ");
                    toast.error(messages || "Gagal memperbarui data biaya pendaftaran");
                },
            });
        } else {
            router.post(store.url(), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data biaya pendaftaran berhasil disimpan!");
                    reset();
                    onCancel?.();
                    onSuccess?.();
                },
                onError: (errors) => {
                    const messages = Object.values(errors).join(", ");
                    toast.error(messages || "Gagal menyimpan data biaya pendaftaran");
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <SelectField
                        label="Member"
                        placeholder="Pilih member"
                        icon={<User size={16} />}
                        control={control}
                        name="memberId"
                        options={members.map((m) => ({
                            value: m.id,
                            label: `${m.fullName} (${m.memberCode})`,
                        }))}
                        error={errors.memberId?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <SelectField
                        label="Paket Membership"
                        placeholder="Pilih paket"
                        icon={<Package size={16} />}
                        control={control}
                        name="packageId"
                        options={packages.map((p) => ({
                            value: p.id,
                            label: `${p.packageName} (Rp ${p.registrationFee.toLocaleString("id-ID")})`,
                        }))}
                        error={errors.packageId?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <SelectField
                        key={selectedPackageId ?? "no-package"}
                        label="Durasi"
                        placeholder="Pilih durasi"
                        icon={<Timer size={16} />}
                        control={control}
                        name="durationMonths"
                        options={
                            selectedPackage
                                ? selectedPackage.prices.map((p) => ({
                                      value: p.durationMonths,
                                      label: `${p.durationMonths} Bulan (Rp ${p.price.toLocaleString("id-ID")})`,
                                  }))
                                : []
                        }
                        error={errors.durationMonths?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <DatePickerField
                        label="Tanggal Mulai"
                        placeholder="Pilih tanggal mulai"
                        icon={<CalendarDays size={16} />}
                        control={control}
                        name="startDate"
                        error={errors.startDate?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <DatePickerField
                        label="Tanggal Pendaftaran"
                        placeholder="Pilih tanggal pendaftaran"
                        icon={<CalendarDays size={16} />}
                        control={control}
                        name="registrationDate"
                        error={errors.registrationDate?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <SelectField
                        label="Metode Pembayaran"
                        placeholder="Pilih metode"
                        icon={<Wallet size={16} />}
                        control={control}
                        name="paymentMethod"
                        options={[
                            { value: "cash", label: "Tunai" },
                            { value: "transfer", label: "Transfer" },
                            { value: "debit", label: "Kartu Debit" },
                            { value: "kredit", label: "Kartu Kredit" },
                        ]}
                        error={errors.paymentMethod?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <RupiahInputField
                        label="Biaya Pendaftaran"
                        placeholder="0"
                        icon={<Calculator size={16} />}
                        control={control}
                        name="registrationFee"
                        error={errors.registrationFee?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <RupiahInputField
                        label="Biaya Membership"
                        placeholder="0"
                        icon={<Calculator size={16} />}
                        control={control}
                        name="amount"
                        error={errors.amount?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <RupiahInputField
                        label="Biaya Admin"
                        placeholder="0"
                        icon={<Calculator size={16} />}
                        control={control}
                        name="adminFee"
                        error={errors.adminFee?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <SelectField
                        label="Status Pembayaran"
                        placeholder="Pilih status"
                        icon={<Wallet size={16} />}
                        control={control}
                        name="paymentStatus"
                        options={[
                            { value: "paid", label: "Lunas" },
                            { value: "unpaid", label: "Belum Dibayar" },
                        ]}
                        error={errors.paymentStatus?.message}
                    />
                </div>

                <div className="col-span-full">
                    <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-base-content/60">
                                    Biaya Registrasi
                                </p>
                                <p className="mt-1 font-semibold">
                                    Rp {registrationFee.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-base-content/60">
                                    Biaya Membership
                                </p>
                                <p className="mt-1 font-semibold">
                                    Rp {amount.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-base-content/60">
                                    Biaya Admin
                                </p>
                                <p className="mt-1 font-semibold">
                                    Rp {adminFee.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-base-content/60">
                                    Berlaku Sampai
                                </p>
                                <p className="mt-1 font-semibold">
                                    {endDate ? format(endDate, "dd/MM/yyyy") : "-"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-base-300 pt-3">
                            <span className="text-sm text-base-content/60">Total</span>
                            <span className="text-lg font-bold text-primary">
                                Rp {totalFee.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-8">
                    <InputField
                        label="Catatan (Opsional)"
                        placeholder="Masukkan catatan"
                        icon={<FileText size={16} />}
                        registration={register("notes")}
                        error={errors.notes?.message}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="btn btn-ghost" onClick={onCancel}>
                    Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : isEdit ? (
                        "Simpan Perubahan"
                    ) : (
                        "Simpan"
                    )}
                </button>
            </div>
        </form>
    );
}
