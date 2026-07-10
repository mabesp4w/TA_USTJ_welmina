import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { subYears } from "date-fns";
import { store, update } from "@/routes/admin/member";
import {
    CalendarDays,
    CreditCard,
    Mail,
    MapPin,
    Phone,
    User,
    Users,
} from "lucide-react";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import DatePickerField from "@/components/ui/DatePickerField";

const schema = yup.object({
    fullName: yup.string().required("Nama lengkap wajib diisi"),
    identityNo: yup
        .string()
        .matches(/^\d{16}$/, "NIK harus 16 digit angka")
        .required("No. KTP / Identitas wajib diisi"),
    phone: yup
        .string()
        .matches(/^0\d{9,12}$/, "Format nomor telepon tidak valid")
        .required("No. Telepon wajib diisi"),
    birthDate: yup
        .date()
        .nullable()
        .typeError("Format tanggal tidak valid")
        .required("Tanggal lahir wajib diisi"),
    gender: yup.string().required("Jenis kelamin wajib dipilih"),
    email: yup.string().email("Format email tidak valid").nullable().notRequired().transform((v) => v || null),
    address: yup.string().required("Alamat wajib diisi"),
});

type MemberFormData = yup.InferType<typeof schema>;

type EditMember = {
    id: number;
    fullName: string;
    identityNo: string | null;
    phone: string | null;
    birthDate: string | null;
    gender: string | null;
    email: string | null;
    address: string | null;
    memberStatus: string;
};

export default function MemberForm({
    onSuccess,
    onCancel,
    member,
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
    member?: EditMember | null;
}) {
    const isEdit = Boolean(member);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<MemberFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: "",
            identityNo: "",
            phone: "",
            birthDate: null,
            gender: "",
            email: "",
            address: "",
        },
    });

    useEffect(() => {
        if (member) {
            setValue("fullName", member.fullName);
            setValue("identityNo", member.identityNo ?? "");
            setValue("phone", member.phone ?? "");
            setValue("birthDate", member.birthDate ? new Date(member.birthDate) : null);
            setValue("gender", member.gender ?? "");
            setValue("email", member.email ?? "");
            setValue("address", member.address ?? "");
        }
    }, [member, setValue]);

    const onSubmit = (data: MemberFormData) => {
        if (isEdit && member) {
            router.put(update.url({ member: member.id }), data, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data member berhasil diperbarui!");
                    reset();
                    onCancel?.();
                    onSuccess?.();
                },
                onError: (errors) => {
                    const messages = Object.values(errors).join(", ");
                    toast.error(messages || "Gagal memperbarui data member");
                },
            });
        } else {
            router.post(store.url(), data, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data member berhasil disimpan!");
                    reset();
                    onCancel?.();
                    onSuccess?.();
                },
                onError: (errors) => {
                    const messages = Object.values(errors).join(", ");
                    toast.error(messages || "Gagal menyimpan data member");
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
                        placeholder="Masukkan nama lengkap"
                        icon={<User size={16} />}
                        registration={register("fullName")}
                        error={errors.fullName?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <InputField
                        label="No. KTP / Identitas"
                        placeholder="16 digit NIK"
                        icon={<CreditCard size={16} />}
                        registration={register("identityNo")}
                        error={errors.identityNo?.message}
                    />
                </div>

                <div className="md:col-span-4">
                    <InputField
                        label="No. Telepon"
                        placeholder="08xxxxxxxxxx"
                        icon={<Phone size={16} />}
                        registration={register("phone")}
                        error={errors.phone?.message}
                    />
                </div>
                <div className="md:col-span-4">
                    <DatePickerField
                        label="Tanggal Lahir"
                        placeholder="Pilih tanggal lahir"
                        icon={<CalendarDays size={16} />}
                        control={control}
                        name="birthDate"
                        error={errors.birthDate?.message}
                        maxDate={subYears(new Date(), 6)}
                    />
                </div>
                <div className="md:col-span-4">
                    <SelectField
                        label="Jenis Kelamin"
                        placeholder="Pilih jenis kelamin"
                        icon={<Users size={16} />}
                        control={control}
                        name="gender"
                        options={[
                            { value: "L", label: "Laki-laki" },
                            { value: "P", label: "Perempuan" },
                        ]}
                        error={errors.gender?.message}
                    />
                </div>
                <div className="md:col-span-4">
                    <InputField
                        label="Email (Opsional)"
                        placeholder="nama@email.com"
                        icon={<Mail size={16} />}
                        registration={register("email")}
                        error={errors.email?.message}
                    />
                </div>
                <div className="md:col-span-8">
                    <InputField
                        label="Alamat"
                        placeholder="Masukkan alamat lengkap"
                        icon={<MapPin size={16} />}
                        registration={register("address")}
                        error={errors.address?.message}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                        reset();
                        onCancel?.();
                    }}
                >
                    Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : isEdit ? (
                        "Perbarui"
                    ) : (
                        "Simpan"
                    )}
                </button>
            </div>
        </form>
    );
}
