import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Building2, Phone, Mail, MapPin, FileText } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { store, update } from "@/routes/admin/supplier";
import type { DetailResponse } from "./types";

const schema = yup.object({
    supplierName: yup.string().required("Nama pemasok wajib diisi").max(100),
    phone: yup.string().nullable().notRequired().max(20),
    email: yup.string().nullable().notRequired().email("Format email tidak valid").max(100),
    address: yup.string().nullable().notRequired(),
    notes: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export default function SupplierForm({
    onSuccess,
    onCancel,
    supplier,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    supplier?: DetailResponse | null;
}) {
    const isEdit = Boolean(supplier);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            supplierName: "",
            phone: "",
            email: "",
            address: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (supplier) {
            setValue("supplierName", supplier.supplierName);
            setValue("phone", supplier.phone ?? "");
            setValue("email", supplier.email ?? "");
            setValue("address", supplier.address ?? "");
            setValue("notes", supplier.notes ?? "");
        }
    }, [supplier, setValue]);

    const onSubmit = (data: FormData) => {
        const payload = {
            supplierName: data.supplierName,
            phone: data.phone || null,
            email: data.email || null,
            address: data.address || null,
            notes: data.notes || null,
        };

        if (isEdit && supplier) {
            router.put(update.url({ supplier: supplier.id }), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data pemasok berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui data pemasok");
                },
            });
        } else {
            router.post(store.url(), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data pemasok berhasil disimpan!");
                    onSuccess?.();
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menyimpan data pemasok");
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <InputField
                        label="Nama Pemasok"
                        placeholder="Contoh: PT. Sehat Sejahtera"
                        icon={<Building2 size={16} />}
                        registration={register("supplierName")}
                        error={errors.supplierName?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <InputField
                        label="Telepon"
                        placeholder="0812-xxxx-xxxx"
                        icon={<Phone size={16} />}
                        registration={register("phone")}
                        error={errors.phone?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <InputField
                        label="Email"
                        placeholder="supplier@example.com"
                        icon={<Mail size={16} />}
                        type="email"
                        registration={register("email")}
                        error={errors.email?.message}
                    />
                </div>

                <div className="md:col-span-8">
                    <label className="form-control w-full">
                        <div className="label pb-2">
                            <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                                Alamat
                            </span>
                        </div>
                        <div className="input input-bordered flex w-full items-start gap-2 p-2">
                            <span className="mt-1 shrink-0 text-base-content/50">
                                <MapPin size={16} />
                            </span>
                            <textarea
                                className="textarea textarea-ghost w-full p-0 text-sm"
                                placeholder="Jl. Merdeka No. 123, Jakarta"
                                rows={2}
                                {...register("address")}
                            />
                        </div>
                        {errors.address && (
                            <p className="mt-1 text-xs text-error">{errors.address.message}</p>
                        )}
                    </label>
                </div>

                <div className="md:col-span-8">
                    <InputField
                        label="Catatan (Opsional)"
                        placeholder="Catatan tentang pemasok"
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
