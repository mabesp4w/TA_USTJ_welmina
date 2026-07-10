import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Package, Building2, Hash, Wallet, CalendarDays, FileText } from "lucide-react";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import DatePickerField from "@/components/ui/DatePickerField";
import { store, update } from "@/routes/admin/procurement";
import type { DetailResponse, ItemOption, SupplierOption } from "./types";

const schema = yup.object({
    procurementCode: yup.string().required("Kode pengadaan wajib diisi").max(30),
    itemId: yup.number().typeError("Wajib pilih").required("Barang wajib dipilih"),
    supplierId: yup.number().typeError("Wajib pilih").required("Pemasok wajib dipilih"),
    quantity: yup.number().typeError("Wajib angka").required("Jumlah wajib diisi").min(1, "Minimal 1"),
    unitPrice: yup.number().typeError("Wajib angka").required("Harga satuan wajib diisi").min(0, "Tidak boleh negatif"),
    procurementDate: yup.date().nullable().required("Tanggal pengadaan wajib diisi"),
    notes: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export default function ProcurementForm({
    onSuccess,
    onCancel,
    procurement,
    items,
    suppliers,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    procurement?: DetailResponse | null;
    items: ItemOption[];
    suppliers: SupplierOption[];
}) {
    const isEdit = Boolean(procurement);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            procurementCode: "",
            itemId: undefined,
            supplierId: undefined,
            quantity: 0,
            unitPrice: 0,
            procurementDate: undefined,
            notes: "",
        },
    });

    useEffect(() => {
        if (procurement) {
            setValue("procurementCode", procurement.procurementCode);
            setValue("itemId", procurement.itemId);
            setValue("supplierId", procurement.supplierId);
            setValue("quantity", procurement.quantity);
            setValue("unitPrice", procurement.unitPrice);
            setValue("procurementDate", procurement.procurementDate ? new Date(procurement.procurementDate) : undefined);
            setValue("notes", procurement.notes ?? "");
        }
    }, [procurement, setValue]);

    const onSubmit = (data: FormData) => {
        const payload = {
            procurementCode: data.procurementCode,
            itemId: data.itemId,
            supplierId: data.supplierId,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            procurementDate: data.procurementDate ? format(data.procurementDate, "yyyy-MM-dd") : null,
            notes: data.notes || null,
        };

        if (isEdit && procurement) {
            router.put(update.url({ procurement: procurement.id }), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data pengadaan berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui data pengadaan");
                },
            });
        } else {
            router.post(store.url(), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data pengadaan berhasil disimpan!");
                    onSuccess?.();
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menyimpan data pengadaan");
                },
            });
        }
    };

    const unitPrice = (control._formValues?.unitPrice as number) ?? 0;
    const quantity = (control._formValues?.quantity as number) ?? 0;
    const total = (unitPrice || 0) * (quantity || 0);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <InputField
                        label="Kode Pengadaan"
                        placeholder="PRC-001"
                        icon={<FileText size={16} />}
                        registration={register("procurementCode")}
                        error={errors.procurementCode?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <InputField
                        label="Jumlah"
                        placeholder="0"
                        icon={<Hash size={16} />}
                        type="number"
                        registration={register("quantity", { valueAsNumber: true })}
                        error={errors.quantity?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <InputField
                        label="Harga Satuan"
                        placeholder="0"
                        icon={<Wallet size={16} />}
                        type="number"
                        registration={register("unitPrice", { valueAsNumber: true })}
                        error={errors.unitPrice?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <SelectField
                        label="Barang"
                        placeholder="Pilih barang"
                        icon={<Package size={16} />}
                        control={control}
                        name="itemId"
                        options={items.map((i) => ({ value: i.id, label: i.itemName }))}
                        error={errors.itemId?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <SelectField
                        label="Pemasok"
                        placeholder="Pilih pemasok"
                        icon={<Building2 size={16} />}
                        control={control}
                        name="supplierId"
                        options={suppliers.map((s) => ({ value: s.id, label: s.supplierName }))}
                        error={errors.supplierId?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <DatePickerField
                        label="Tgl. Pengadaan"
                        placeholder="Pilih tanggal"
                        icon={<CalendarDays size={16} />}
                        control={control}
                        name="procurementDate"
                        error={errors.procurementDate?.message}
                    />
                </div>

                {total > 0 && (
                    <div className="md:col-span-8">
                        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                            <p className="text-sm text-base-content/60">Total Harga</p>
                            <p className="text-xl font-bold text-primary">
                                Rp {(total).toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                )}

                <div className="md:col-span-8">
                    <InputField
                        label="Catatan (Opsional)"
                        placeholder="Catatan tambahan"
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
