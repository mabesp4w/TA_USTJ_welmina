import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Layers, FileText, ImageUp, X } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { store, update } from "@/routes/admin/gym-equipment";
import type { DetailResponse } from "./types";

const schema = yup.object({
    categoryName: yup.string().required("Nama peralatan wajib diisi").max(100),
    description: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export default function GymEquipmentForm({
    onSuccess,
    onCancel,
    category,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    category?: DetailResponse | null;
}) {
    const isEdit = Boolean(category);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryName: "",
            description: "",
        },
    });

    useEffect(() => {
        if (category) {
            setValue("categoryName", category.categoryName);
            setValue("description", category.description ?? "");
            setImagePreview(category.image);
        }
    }, [category, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        formData.append("categoryName", data.categoryName);
        formData.append("description", data.description || "");

        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (isEdit && category) {
            formData.append("_method", "PUT");
            router.post(update.url({ gymEquipment: category.id }), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("peralatan peralatan berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui peralatan peralatan");
                },
            });
        } else {
            router.post(store.url(), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("peralatan peralatan berhasil disimpan!");
                    onSuccess?.();
                    reset();
                    removeImage();
                },
                onError: () => {
                    toast.error("Gagal menyimpan peralatan peralatan");
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <InputField
                        label="Nama peralatan"
                        placeholder="Contoh: Alat Kardio, Beban Bebas"
                        icon={<Layers size={16} />}
                        registration={register("categoryName")}
                        error={errors.categoryName?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <InputField
                        label="Deskripsi (Opsional)"
                        placeholder="Deskripsi peralatan"
                        icon={<FileText size={16} />}
                        registration={register("description")}
                        error={errors.description?.message}
                    />
                </div>

                <div className="md:col-span-8">
                    <label className="form-control w-full">
                        <div className="label pb-2">
                            <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                                Gambar (Opsional)
                            </span>
                        </div>

                        {imagePreview ? (
                            <div className="relative w-full overflow-hidden rounded-lg border border-base-300">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-48 w-full object-cover"
                                />
                                <button
                                    type="button"
                                    className="btn btn-circle btn-ghost btn-xs absolute right-2 top-2 bg-base-100/80 backdrop-blur-sm"
                                    onClick={removeImage}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-base-300 bg-base-200/30 py-8 transition-colors hover:bg-base-200/50">
                                <ImageUp size={32} className="text-base-content/40" />
                                <span className="text-sm font-medium text-base-content/60">
                                    Klik untuk upload gambar
                                </span>
                                <span className="text-xs text-base-content/40">
                                    JPEG, PNG, WEBP (max 2MB)
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
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
