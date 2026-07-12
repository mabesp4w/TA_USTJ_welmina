import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { User, AtSign, Key, Shield, Mail } from "lucide-react";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import SelectField from "@/components/ui/SelectField";
import { store, update } from "@/routes/admin/user";
import type { DetailResponse } from "./types";

const schema = yup.object({
    fullName: yup.string().required("Nama lengkap wajib diisi").max(100),
    username: yup.string().required("Username wajib diisi").max(50),
    email: yup.string().nullable().notRequired().email("Format email tidak valid").max(100),
    password: yup.string().nullable().notRequired().min(5, "Minimal 5 karakter"),
    role: yup.string().required("Role wajib dipilih"),
    isActive: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

const roleOptions = [
    { value: "pengelola", label: "Pengelola" },
    { value: "pimpinan", label: "Pimpinan" },
];

export default function UserForm({
    onSuccess,
    onCancel,
    user,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    user?: DetailResponse | null;
}) {
    const isEdit = Boolean(user);

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            role: "pengelola",
            isActive: true,
        },
    });

    const isActive = watch("isActive");

    useEffect(() => {
        if (user) {
            setValue("fullName", user.fullName);
            setValue("username", user.username);
            setValue("email", user.email ?? "");
            setValue("password", "");
            setValue("role", user.role);
            setValue("isActive", user.isActive);
        }
    }, [user, setValue]);

    const onSubmit = (data: FormData) => {
        const payload: Record<string, unknown> = {
            fullName: data.fullName,
            username: data.username,
            email: data.email || null,
            password: data.password || null,
            role: data.role,
            isActive: data.isActive,
        };

        if (isEdit && !payload.password) {
            delete payload.password;
        }

        if (isEdit && user) {
            router.put(update.url({ user: user.id }), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Pengguna berhasil diperbarui!");
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("Gagal memperbarui pengguna");
                },
            });
        } else {
            router.post(store.url(), payload as any, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Pengguna berhasil disimpan!");
                    onSuccess?.();
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menyimpan pengguna");
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <div className="md:col-span-4">
                    <InputField
                        label="Nama Lengkap"
                        placeholder="Contoh: John Doe"
                        icon={<User size={16} />}
                        registration={register("fullName")}
                        error={errors.fullName?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <InputField
                        label="Username"
                        placeholder="johndoe"
                        icon={<AtSign size={16} />}
                        registration={register("username")}
                        error={errors.username?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <InputField
                        label="Email (Opsional)"
                        placeholder="john@example.com"
                        icon={<Mail size={16} />}
                        type="email"
                        registration={register("email")}
                        error={errors.email?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <PasswordField
                        label={isEdit ? "Password Baru (Kosongkan jika tidak diubah)" : "Password"}
                        placeholder="Minimal 5 karakter"
                        icon={<Key size={16} />}
                        registration={register("password")}
                        error={errors.password?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <SelectField
                        label="Role"
                        placeholder="Pilih role"
                        icon={<Shield size={16} />}
                        control={control}
                        name="role"
                        options={roleOptions}
                        error={errors.role?.message}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text font-semibold text-base-content/80">Status</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-100/50 px-4 py-3">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                {...register("isActive")}
                            />
                            <span className="text-sm font-medium">
                                {isActive ? "Aktif" : "Non Aktif"}
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
