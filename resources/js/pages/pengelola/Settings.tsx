import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router, usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import { AtSign, Key, Lock } from "lucide-react";
import PengelolaLayout from "@/components/layouts/pengelola/PengelolaLayout";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import { update } from "@/routes/pengelola/settings";

const schema = yup.object({
    current_password: yup.string().required("Password lama wajib diisi"),
    username: yup.string().required("Username wajib diisi").max(50),
    password: yup.string().nullable().notRequired().transform((v) => (v === "" ? null : v)).min(5, "Minimal 5 karakter"),
    password_confirmation: yup
        .string()
        .nullable()
        .notRequired()
        .oneOf([yup.ref("password"), null, ""], "Konfirmasi password tidak cocok"),
});

type FormData = yup.InferType<typeof schema>;

function SettingsPage() {
    const { user } = usePage<{
        user: { id: number; fullName: string; username: string; email: string | null; role: string };
    }>().props;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            current_password: "",
            username: user.username,
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = (data: FormData) => {
        const payload: Record<string, unknown> = {
            current_password: data.current_password,
            username: data.username,
        };

        if (data.password) {
            payload.password = data.password;
            payload.password_confirmation = data.password_confirmation;
        }

        router.put(update.url(), payload as any, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Pengaturan berhasil diperbarui!");
                reset({ current_password: "", username: data.username, password: "", password_confirmation: "" });
            },
            onError: (errs) => {
                const msg = Object.values(errs)[0];
                toast.error(typeof msg === "string" ? msg : "Gagal memperbarui pengaturan");
            },
        });
    };

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-xl">
                <div className="card border border-base-300 bg-base-100/70 shadow-sm backdrop-blur-sm" data-aos="zoom-in" data-aos-duration="500">
                    <div className="card-body">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-base-content">Informasi Akun</h2>
                            <p className="text-sm text-base-content/60">
                                {user.fullName} &middot; <span className="badge badge-sm">{user.role}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <PasswordField
                                label="Password Lama"
                                placeholder="Masukkan password lama"
                                icon={<Lock size={16} />}
                                registration={register("current_password")}
                                error={errors.current_password?.message}
                            />

                            <div className="divider my-2" />

                            <InputField
                                label="Username"
                                placeholder="Masukkan username"
                                icon={<AtSign size={16} />}
                                registration={register("username")}
                                error={errors.username?.message}
                            />

                            <PasswordField
                                label="Password Baru (Kosongkan jika tidak diubah)"
                                placeholder="Minimal 5 karakter"
                                icon={<Key size={16} />}
                                registration={register("password")}
                                error={errors.password?.message}
                            />

                            <PasswordField
                                label="Konfirmasi Password Baru"
                                placeholder="Ulangi password baru"
                                icon={<Key size={16} />}
                                registration={register("password_confirmation")}
                                error={errors.password_confirmation?.message}
                            />

                            <div className="flex justify-end pt-2">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <span className="loading loading-spinner loading-sm" />
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

SettingsPage.layout = (page: React.ReactNode) => (
    <PengelolaLayout title="Pengaturan">{page}</PengelolaLayout>
);

export default SettingsPage;
