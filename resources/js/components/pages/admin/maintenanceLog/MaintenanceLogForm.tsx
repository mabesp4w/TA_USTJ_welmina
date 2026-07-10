import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Package, Wrench, CalendarDays, Calculator, User, FileText } from "lucide-react";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import DatePickerField from "@/components/ui/DatePickerField";
import RupiahInputField from "@/components/ui/RupiahInputField";
import { store, update } from "@/routes/admin/maintenance-logs";
import type { DetailResponse, InventoryItemOption } from "./types";

const schema = yup.object({
    inventoryItemId: yup.number().typeError("Wajib pilih").required("Barang wajib dipilih"),
    maintenanceType: yup.string().required("Jenis perawatan wajib dipilih"),
    maintenanceDate: yup.date().typeError("Wajib tanggal").required("Tanggal perawatan wajib diisi"),
    cost: yup.number().typeError("Wajib angka").required("Biaya wajib diisi").min(0, "Tidak boleh negatif"),
    resultCondition: yup.string().required("Hasil kondisi wajib dipilih"),
    performedBy: yup.string().required("Pelaksana wajib diisi").max(100),
    notes: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export default function MaintenanceLogForm({
    onSuccess,
    onCancel,
    maintenanceLog,
    inventoryItems,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    maintenanceLog?: DetailResponse | null;
    inventoryItems: InventoryItemOption[];
}) {
    const isEdit = Boolean(maintenanceLog);

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
            inventoryItemId: undefined,
            maintenanceType: "",
            maintenanceDate: new Date(),
            cost: 0,
            resultCondition: "",
            performedBy: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (maintenanceLog) {
            setValue("inventoryItemId", maintenanceLog.inventoryItemId);
            setValue("maintenanceType", maintenanceLog.maintenanceType);
            setValue("maintenanceDate", new Date(maintenanceLog.maintenanceDate));
            setValue("cost", maintenanceLog.cost);
            setValue("resultCondition", maintenanceLog.resultCondition);
            setValue("performedBy", maintenanceLog.performedBy);
            setValue("notes", maintenanceLog.notes ?? "");
        }
    }, [maintenanceLog, setValue]);

    const onSubmit = (data: FormData) => {
        const payload = {
            inventoryItemId: data.inventoryItemId,
            maintenanceType: data.maintenanceType,
            maintenanceDate: format(data.maintenanceDate, "yyyy-MM-dd"),
            cost: data.cost,
            resultCondition: data.resultCondition,
            performedBy: data.performedBy,
            notes: data.notes || null,
        };

        if (isEdit && maintenanceLog) {
            router.put(update.url({ maintenanceLog: maintenanceLog.id }), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data perawatan berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui data perawatan");
                },
            });
        } else {
            router.post(store.url(), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data perawatan berhasil disimpan!");
                    onSuccess?.();
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menyimpan data perawatan");
                },
            });
        }
    };

    const typeOptions = [
        { value: "perbaikan", label: "Perbaikan" },
        { value: "perawatan", label: "Perawatan" },
        { value: "pemeriksaan", label: "Pemeriksaan" },
    ];

    const conditionOptions = [
        { value: "baik", label: "Baik" },
        { value: "perlu_perawatan", label: "Perlu Perawatan" },
        { value: "rusak", label: "Rusak" },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <SelectField
                        label="Barang Inventaris"
                        placeholder="Pilih barang"
                        icon={<Package size={16} />}
                        control={control}
                        name="inventoryItemId"
                        options={inventoryItems.map((i) => ({ value: i.id, label: i.itemName }))}
                        error={errors.inventoryItemId?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <SelectField
                        label="Jenis Perawatan"
                        placeholder="Pilih jenis"
                        icon={<Wrench size={16} />}
                        control={control}
                        name="maintenanceType"
                        options={typeOptions}
                        error={errors.maintenanceType?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <DatePickerField
                        label="Tanggal Perawatan"
                        placeholder="Pilih tanggal"
                        icon={<CalendarDays size={16} />}
                        control={control}
                        name="maintenanceDate"
                        error={errors.maintenanceDate?.message}
                    />
                </div>

                <div className="md:col-span-3">
                    <RupiahInputField
                        label="Biaya"
                        placeholder="0"
                        icon={<Calculator size={16} />}
                        control={control}
                        name="cost"
                        error={errors.cost?.message}
                    />
                </div>

                <div className="md:col-span-3">
                    <SelectField
                        label="Hasil Kondisi"
                        placeholder="Pilih kondisi"
                        icon={<Wrench size={16} />}
                        control={control}
                        name="resultCondition"
                        options={conditionOptions}
                        error={errors.resultCondition?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <InputField
                        label="Pelaksana"
                        placeholder="Nama teknisi"
                        icon={<User size={16} />}
                        registration={register("performedBy")}
                        error={errors.performedBy?.message}
                    />
                </div>

                <div className="md:col-span-8">
                    <InputField
                        label="Catatan (Opsional)"
                        placeholder="Catatan perawatan"
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
