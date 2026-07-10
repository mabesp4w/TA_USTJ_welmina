import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Layers, FileText } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { store, update } from "@/routes/admin/category";
import type { DetailResponse } from "./types";

const schema = yup.object({
    categoryName: yup.string().required("Nama kategori wajib diisi").max(100),
    description: yup.string().nullable().notRequired(),
    isFitnessTools: yup.boolean().default(false),
});

type FormData = yup.InferType<typeof schema>;

export default function CategoryForm({
    onSuccess,
    onCancel,
    category,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    category?: DetailResponse | null;
}) {
    const isEdit = Boolean(category);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryName: "",
            description: "",
            isFitnessTools: false,
        },
    });

    const isFitnessTools = watch("isFitnessTools");

    useEffect(() => {
        if (category) {
            setValue("categoryName", category.categoryName);
            setValue("description", category.description ?? "");
            setValue("isFitnessTools", category.isFitnessTools);
        }
    }, [category, setValue]);

    const onSubmit = async (data: FormData) => {
        const payload = {
            categoryName: data.categoryName,
            description: data.description || null,
            isFitnessTools: data.isFitnessTools,
        };

        if (isEdit && category) {
            router.put(update.url({ category:category.id }), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Kategori berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui kategori");
                },
            });
        } else {
            router.post(store.url(), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Kategori berhasil disimpan!");
                    onSuccess?.();
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menyimpan kategori");
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <InputField
                        label="Nama Kategori"
                        placeholder="Contoh: Alat Kardio, Beban Bebas"
                        icon={<Layers size={16} />}
                        registration={register("categoryName")}
                        error={errors.categoryName?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <InputField
                        label="Deskripsi (Opsional)"
                        placeholder="Deskripsi kategori"
                        icon={<FileText size={16} />}
                        registration={register("description")}
                        error={errors.description?.message}
                    />
                </div>

                <div className="md:col-span-8">
                    <label className="form-control w-full">
                        <div className="label pb-2">
                            <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                                Alat Fitness
                            </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-200/30 px-4 py-3">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={isFitnessTools}
                                onChange={(e) => setValue("isFitnessTools", e.target.checked)}
                            />
                            <span className="text-sm text-base-content/70">
                                {isFitnessTools
                                    ? "Kategori ini termasuk alat fitness"
                                    : "Kategori ini bukan alat fitness"}
                            </span>
                        </div>
                    </label>
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
