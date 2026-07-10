import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Package, Calculator, DollarSign, FileText, Plus, Trash2, ToggleLeft } from "lucide-react";
import InputField from "@/components/ui/InputField";
import RupiahInputField from "@/components/ui/RupiahInputField";
import { store, update } from "@/routes/admin/gym-fee";
import type { DetailResponse } from "./types";

const priceSchema = yup.object({
    id: yup.number().nullable().notRequired(),
    durationMonths: yup
        .number()
        .typeError("Wajib angka")
        .required("Durasi wajib diisi")
        .min(1, "Minimal 1 bulan"),
    price: yup
        .number()
        .typeError("Wajib angka")
        .required("Harga wajib diisi")
        .min(0, "Tidak boleh negatif"),
});

const schema = yup.object({
    packageName: yup.string().required("Nama paket wajib diisi").max(50),
    registrationFee: yup
        .number()
        .typeError("Wajib angka")
        .required("Biaya pendaftaran wajib diisi")
        .min(0, "Tidak boleh negatif"),
    description: yup.string().nullable().notRequired(),
    isActive: yup.boolean().required(),
    prices: yup
        .array()
        .of(priceSchema)
        .required()
        .min(1, "Minimal satu durasi harga"),
});

type FormData = yup.InferType<typeof schema>;

export default function GymFeeForm({
    onSuccess,
    onCancel,
    gymFee,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    gymFee?: DetailResponse | null;
}) {
    const isEdit = Boolean(gymFee);

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
            packageName: "",
            registrationFee: 0,
            description: "",
            isActive: true,
            prices: [{ durationMonths: 1, price: 0 }],
        },
    });

    const prices = watch("prices") || [];

    useEffect(() => {
        if (gymFee) {
            setValue("packageName", gymFee.packageName);
            setValue("registrationFee", gymFee.registrationFee);
            setValue("description", gymFee.description ?? "");
            setValue("isActive", gymFee.isActive);
            setValue(
                "prices",
                gymFee.prices.length > 0
                    ? gymFee.prices.map((p) => ({
                          id: p.id,
                          durationMonths: p.durationMonths,
                          price: p.price,
                      }))
                    : [{ durationMonths: 1, price: 0 }],
            );
        }
    }, [gymFee, setValue]);

    const addPriceRow = () => {
        const usedDurations = prices.map((p) => p.durationMonths);
        let next = 1;
        while (usedDurations.includes(next)) {
            next++;
        }
        setValue("prices", [
            ...prices,
            { id: undefined, durationMonths: next, price: 0 } as any,
        ]);
    };

    const removePriceRow = (index: number) => {
        if (prices.length <= 1) return;
        const updated = prices.filter((_, i) => i !== index);
        setValue("prices", updated);
    };

    const onSubmit = async (data: FormData) => {
        const payload = {
            packageName: data.packageName,
            registrationFee: data.registrationFee,
            description: data.description || "",
            isActive: data.isActive,
            prices: data.prices.map((p) => ({
                id: (p as any).id || undefined,
                durationMonths: p.durationMonths,
                price: p.price,
            })),
        };

        if (isEdit && gymFee) {
            router.put(update.url({ gymFee: gymFee.id }), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data paket gym berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui data paket gym");
                },
            });
        } else {
            router.post(store.url(), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data paket gym berhasil disimpan!");
                    onSuccess?.();
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menyimpan data paket gym");
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <InputField
                        label="Nama Paket"
                        placeholder="Contoh: Reguler, Premium"
                        icon={<Package size={16} />}
                        registration={register("packageName")}
                        error={errors.packageName?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <RupiahInputField
                        label="Biaya Pendaftaran"
                        placeholder="0"
                        icon={<Calculator size={16} />}
                        control={control}
                        name="registrationFee"
                        error={errors.registrationFee?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="form-control w-full">
                        <div className="label pb-2">
                            <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                                Status
                            </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-100 p-3">
                            <ToggleLeft size={18} className="text-base-content/50" />
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    {...register("isActive")}
                                />
                                <span className="text-sm font-medium">
                                    {watch("isActive") ? "Aktif" : "Nonaktif"}
                                </span>
                            </label>
                        </div>
                    </label>
                </div>

                <div className="md:col-span-8">
                    <InputField
                        label="Deskripsi (Opsional)"
                        placeholder="Deskripsi paket"
                        icon={<FileText size={16} />}
                        registration={register("description")}
                        error={errors.description?.message}
                    />
                </div>

                <div className="md:col-span-8">
                    <label className="form-control w-full">
                        <div className="label pb-2">
                            <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                                Harga per Durasi
                            </span>
                        </div>
                    </label>

                    {errors.prices?.root && (
                        <p className="mb-2 text-xs text-error">{errors.prices.root.message}</p>
                    )}

                    <div className="space-y-2">
                        {prices.map((_, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200/30 p-3"
                            >
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-base-content/70">
                                        Durasi (Bulan)
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered mt-1 w-full"
                                        placeholder="1"
                                        {...register(`prices.${index}.durationMonths`, {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {errors.prices?.[index]?.durationMonths && (
                                        <p className="mt-1 text-xs text-error">
                                            {errors.prices[index]?.durationMonths?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <RupiahInputField
                                        label="Harga"
                                        placeholder="0"
                                        icon={<DollarSign size={16} />}
                                        control={control}
                                        name={`prices.${index}.price`}
                                        error={errors.prices?.[index]?.price?.message}
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-ghost btn-square btn-sm mt-6 text-error"
                                    disabled={prices.length <= 1}
                                    onClick={() => removePriceRow(index)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {errors.prices?.message && (
                        <p className="mt-1 text-xs text-error">{errors.prices.message}</p>
                    )}

                    <button
                        type="button"
                        className="btn btn-ghost btn-sm mt-3 gap-2"
                        onClick={addPriceRow}
                    >
                        <Plus size={16} />
                        Tambah Durasi
                    </button>
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
