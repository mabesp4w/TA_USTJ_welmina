import { Eye, Pencil, Trash2, Dumbbell } from "lucide-react";
import type { CategoryItem } from "./types";

export default function CategoryListCard({
    categories,
    onDetail,
    onEdit,
    onDelete,
}: {
    categories: CategoryItem[];
    onDetail: (item: CategoryItem) => void;
    onEdit: (item: CategoryItem) => void;
    onDelete: (item: CategoryItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <h2 className="text-lg font-bold text-base-content">Daftar Kategori</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-base-content/60">
                                <th>Nama Kategori</th>
                                <th>Deskripsi</th>
                                <th>Alat Fitness</th>
                                <th>Jumlah Barang</th>
                                <th className="w-24 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-sm text-base-content/50">
                                        Belum ada kategori
                                    </td>
                                </tr>
                            ) : (
                                categories.map((item) => (
                                    <tr key={item.id} className="hover">
                                        <td>
                                            <div>
                                                <p className="text-sm font-medium">{item.categoryName}</p>
                                            </div>
                                        </td>
                                        <td className="text-sm text-base-content/70">
                                            {item.description ?? "-"}
                                        </td>
                                        <td>
                                            {item.isFitnessTools ? (
                                                <span className="badge badge-sm badge-info gap-1">
                                                    <Dumbbell size={10} />
                                                    Fitness
                                                </span>
                                            ) : (
                                                <span className="badge badge-sm badge-ghost">Umum</span>
                                            )}
                                        </td>
                                        <td className="text-sm font-medium">{item.itemCount}</td>
                                        <td>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square"
                                                    onClick={() => onDetail(item)}
                                                    title="Detail"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square"
                                                    onClick={() => onEdit(item)}
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square text-error"
                                                    onClick={() => onDelete(item)}
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
