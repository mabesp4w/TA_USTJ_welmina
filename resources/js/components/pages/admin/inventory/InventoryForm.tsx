import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Package, Barcode, Layers, Hash, MapPin, Building2, CalendarDays, FileText, Wrench, CheckCircle2, XCircle } from "lucide-react";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import DatePickerField from "@/components/ui/DatePickerField";
import { store, update } from "@/routes/admin/inventory";
import type { DetailResponse, CategoryOption, SupplierOption } from "./types";

const schema = yup.object({
    itemCode: yup.string().required("Kode barang wajib diisi").max(30),
    itemName: yup.string().required("Nama barang wajib diisi").max(100),
    categoryId: yup.number().typeError("Wajib pilih").required("Kategori wajib dipilih"),
    stock: yup.number().typeError("Wajib angka").required("Stok wajib diisi").min(0, "Tidak boleh negatif"),
    itemCondition: yup.string().required("Kondisi wajib dipilih"),
    itemStatus: yup.string().required("Status wajib dipilih"),
    locationName: yup.string().nullable().notRequired().max(100),
    supplierId: yup.number().nullable().notRequired(),
    lastServiceDate: yup.date().nullable().notRequired(),
    notes: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export default function InventoryForm({
    onSuccess,
    onCancel,
    inventory,
    categories,
    suppliers,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    inventory?: DetailResponse | null;
    categories: CategoryOption[];
    suppliers: SupplierOption[];
}) {
    const isEdit = Boolean(inventory);

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
            itemCode: "",
            itemName: "",
            categoryId: undefined,
            stock: 0,
            itemCondition: "baik",
            itemStatus: "aktif",
            locationName: "",
            supplierId: undefined,
            lastServiceDate: undefined,
            notes: "",
        },
    });

    useEffect(() => {
        if (inventory) {
            setValue("itemCode", inventory.itemCode);
            setValue("itemName", inventory.itemName);
            setValue("categoryId", inventory.categoryId);
            setValue("stock", inventory.stock);
            setValue("itemCondition", inventory.itemCondition);
            setValue("itemStatus", inventory.itemStatus);
            setValue("locationName", inventory.locationName ?? "");
            setValue("supplierId", inventory.supplierId ?? undefined);
            setValue("lastServiceDate", inventory.lastServiceDate ? new Date(inventory.lastServiceDate) : undefined);
            setValue("notes", inventory.notes ?? "");
        }
    }, [inventory, setValue]);

    const onSubmit = async (data: FormData) => {
        const payload = {
            itemCode: data.itemCode,
            itemName: data.itemName,
            categoryId: data.categoryId,
            stock: data.stock,
            itemCondition: data.itemCondition,
            itemStatus: data.itemStatus,
            locationName: data.locationName || null,
            supplierId: data.supplierId || null,
            lastServiceDate: data.lastServiceDate ? format(data.lastServiceDate, "yyyy-MM-dd") : null,
            notes: data.notes || null,
        };

        if (isEdit && inventory) {
            router.put(update.url({ inventory: inventory.id }), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data inventaris berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui data inventaris");
                },
            });
        } else {
            router.post(store.url(), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data inventaris berhasil disimpan!");
                    onSuccess?.();
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menyimpan data inventaris");
                },
            });
        }
    };

    const conditionOptions = [
        { value: "baik", label: "Baik" },
        { value: "perlu_perawatan", label: "Perlu Perawatan" },
        { value: "rusak", label: "Rusak" },
    ];

    const statusOptions = [
        { value: "aktif", label: "Aktif" },
        { value: "tidak_aktif", label: "Tidak Aktif" },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <InputField
                        label="Nama Barang"
                        placeholder="Contoh: Treadmill Elektrik"
                        icon={<Package size={16} />}
                        registration={register("itemName")}
                        error={errors.itemName?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <InputField
                        label="Kode Barang"
                        placeholder="BRG-001"
                        icon={<Barcode size={16} />}
                        registration={register("itemCode")}
                        error={errors.itemCode?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <InputField
                        label="Stok"
                        placeholder="0"
                        icon={<Hash size={16} />}
                        type="number"
                        registration={register("stock", { valueAsNumber: true })}
                        error={errors.stock?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <SelectField
                        label="Kategori"
                        placeholder="Pilih kategori"
                        icon={<Layers size={16} />}
                        control={control}
                        name="categoryId"
                        options={categories.map((c) => ({ value: c.id, label: c.categoryName }))}
                        error={errors.categoryId?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <SelectField
                        label="Kondisi"
                        placeholder="Pilih kondisi"
                        icon={<Wrench size={16} />}
                        control={control}
                        name="itemCondition"
                        options={conditionOptions}
                        error={errors.itemCondition?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <SelectField
                        label="Status"
                        placeholder="Pilih status"
                        icon={watch("itemStatus") === "aktif" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        control={control}
                        name="itemStatus"
                        options={statusOptions}
                        error={errors.itemStatus?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <InputField
                        label="Lokasi"
                        placeholder="Contoh: Gedung A Lt. 2"
                        icon={<MapPin size={16} />}
                        registration={register("locationName")}
                        error={errors.locationName?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <SelectField
                        label="Supplier"
                        placeholder="Pilih supplier"
                        icon={<Building2 size={16} />}
                        control={control}
                        name="supplierId"
                        options={suppliers.map((s) => ({ value: s.id, label: s.supplierName }))}
                        error={errors.supplierId?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <DatePickerField
                        label="Tgl. Service Terakhir"
                        placeholder="Pilih tanggal"
                        icon={<CalendarDays size={16} />}
                        control={control}
                        name="lastServiceDate"
                        error={errors.lastServiceDate?.message}
                    />
                </div>

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
