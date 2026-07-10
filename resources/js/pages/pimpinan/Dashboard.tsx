export default function PimpinanDashboard() {
    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-4 md:p-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">
                            Fitness Center
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-base-content md:text-3xl">
                            Dashboard Pimpinan
                        </h1>
                        <p className="mt-2 text-sm text-base-content/60">
                            Lihat laporan dan ringkasan inventaris alat fitness.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
