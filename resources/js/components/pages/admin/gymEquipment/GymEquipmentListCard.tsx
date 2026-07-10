import { Eye, Pencil, Trash2, ImageOff } from "lucide-react";
import type { CategoryItem } from "./types";

export default function GymEquipmentListCard({
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
                <h2 className="text-lg font-bold text-base-content">Daftar peralatan Peralatan</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-sm text-base-content/50">
                            Belum ada peralatan peralatan
                        </div>
                    ) : (
                        categories.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-box border border-base-300 bg-base-200/40 overflow-hidden"
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.categoryName}
                                        className="h-36 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-36 items-center justify-center bg-base-300/30">
                                        <ImageOff size={32} className="text-base-content/30" />
                                    </div>
                                )}

                                <div className="p-3">
                                    <p className="text-sm font-bold text-base-content">
                                        {item.categoryName}
                                    </p>
                                    {item.description && (
                                        <p className="mt-1 text-xs text-base-content/60 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-base-content/50">
                                        {item.itemCount} barang
                                    </p>

                                    <div className="mt-3 flex items-center justify-end gap-1 border-t border-base-300 pt-2">
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs btn-square"
                                            onClick={() => onDetail(item)}
                                            title="Detail"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs btn-square"
                                            onClick={() => onEdit(item)}
                                            title="Edit"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs btn-square text-error"
                                            onClick={() => onDelete(item)}
                                            title="Hapus"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
