import { Head, useForm } from '@inertiajs/react';
import { login } from '@/routes';

import React, { useState, type FormEventHandler } from "react";
import {
    Dumbbell,
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

export default function Welcome({ stats }: { stats: { total: number; baik: number; perluTindakan: number } }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(login.url(), {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen">
                <div className="hero min-h-screen px-4 py-8">
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">
                        <div className="relative hidden lg:flex flex-col justify-between text-gray-300 p-10" data-aos="fade-right" data-aos-duration="800">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 left-10 w-24 h-24 rounded-full border border-primary-content"></div>
                                <div className="absolute bottom-16 right-16 w-32 h-32 rounded-full border border-primary-content"></div>
                                <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full border border-primary-content"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="btn btn-circle btn-secondary btn-sm pointer-events-none">
                                        <Dumbbell size={18} />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold uppercase leading-tight">
                                            Fitness Center
                                        </h1>
                                        <p className="text-sm opacity-80">Vicca Sera Polimak</p>
                                    </div>
                                </div>

                                <div className="max-w-md">
                                    <div className="badge badge-secondary badge-outline mb-4 gap-2">
                                        <Sparkles size={14} />
                                        Sistem Inventaris Modern
                                    </div>

                                    <h2 className="text-4xl font-bold leading-tight mb-4">
                                        Kelola inventaris gym dengan lebih cepat dan rapi.
                                    </h2>

                                    <p className="text-base opacity-90 leading-relaxed">
                                        Masuk ke dashboard untuk memantau data member, inventaris,
                                        transaksi, notifikasi, dan laporan dalam satu sistem yang
                                        terstruktur.
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4" data-aos="fade-up" data-aos-delay="400">
                                <div className="bg-primary-content/10 backdrop-blur rounded-2xl p-4 border border-primary-content/10">
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-sm opacity-80">Total Inventaris</p>
                                </div>

                                <div className="bg-primary-content/10 backdrop-blur rounded-2xl p-4 border border-primary-content/10">
                                    <p className="text-2xl font-bold">{stats.baik}</p>
                                    <p className="text-sm opacity-80">Kondisi Baik</p>
                                </div>

                                <div className="bg-primary-content/10 backdrop-blur rounded-2xl p-4 border border-primary-content/10">
                                    <p className="text-2xl font-bold">{stats.perluTindakan}</p>
                                    <p className="text-sm opacity-80">Perlu Tindakan</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-base-100" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200">
                            <div className="w-full max-w-md">
                                <div className="text-center lg:text-left mb-8">
                                    <div className="lg:hidden flex justify-center mb-4">
                                        <div className="btn btn-circle btn-primary pointer-events-none">
                                            <Dumbbell size={20} />
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-bold text-base-content">
                                        Selamat Datang
                                    </h3>
                                    <p className="text-base-content/70 mt-2">
                                        Silakan login untuk masuk ke sistem inventaris fitness center.
                                    </p>
                                </div>

                                <div className="card bg-base-100 border border-base-300 shadow-xl">
                                    <div className="card-body">
                                        <form onSubmit={submit} className="space-y-5">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Username</span>
                                                </label>
                                                <label className="input input-bordered flex items-center gap-3 w-full">
                                                    <User size={18} className="text-base-content/50" />
                                                    <input
                                                        type="text"
                                                        className="grow"
                                                        placeholder="Masukkan username"
                                                        value={data.username}
                                                        onChange={(e) => setData('username', e.target.value)}
                                                    />
                                                </label>
                                                {errors.username && (
                                                    <span className="text-error text-sm mt-1">{errors.username}</span>
                                                )}
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Password</span>
                                                </label>
                                                <label className="input input-bordered flex items-center gap-3 w-full">
                                                    <Lock size={18} className="text-base-content/50" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className="grow"
                                                        placeholder="Masukkan password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-xs"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff size={16} />
                                                        ) : (
                                                            <Eye size={16} />
                                                        )}
                                                    </button>
                                                </label>
                                                {errors.password && (
                                                    <span className="text-error text-sm mt-1">{errors.password}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <label className="label cursor-pointer gap-2 justify-start">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-primary checkbox-sm"
                                                        checked={data.remember}
                                                        onChange={(e) => setData('remember', e.target.checked)}
                                                    />
                                                    <span className="label-text">Ingat saya</span>
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-full gap-2"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <span className="loading loading-spinner loading-sm" />
                                                ) : (
                                                    <>
                                                        Masuk
                                                        <ArrowRight size={18} />
                                                    </>
                                                )}
                                            </button>

                                            <div className="divider text-xs text-base-content/50">
                                                Aman & Terenkripsi
                                            </div>

                                            <div className="flex items-start gap-3 rounded-2xl bg-base-200 p-4">
                                                <ShieldCheck
                                                    size={20}
                                                    className="text-success shrink-0 mt-0.5"
                                                />
                                                <div>
                                                    <p className="font-semibold text-sm text-base-content">
                                                        Login aman untuk administrator
                                                    </p>
                                                    <p className="text-sm text-base-content/70">
                                                        Pastikan username dan password sesuai dengan akun yang
                                                        terdaftar di sistem.
                                                    </p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <p className="text-center text-sm text-base-content/60 mt-6">
                                    © 2026 Fitness Center Vicca Sera Polimak. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
