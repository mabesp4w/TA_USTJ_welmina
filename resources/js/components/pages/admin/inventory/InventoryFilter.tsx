import FilterBar from "@/components/ui/FilterBar";
import type { CategoryOption, SupplierOption } from "./types";

/**
 * Inventory list filters. Column spans (1-8) per select are configured here
 * via the `col` prop — adjust these to change the filter layout.
 */
export default function InventoryFilter({
    categories,
    suppliers,
}: {
    categories: CategoryOption[];
    suppliers: SupplierOption[];
}) {
    return (
        <FilterBar
            filters={[
                {
                    name: "category",
                    label: "Kategori",
                    col: 2,
                    options: categories.map((c) => ({
                        value: String(c.id),
                        label: c.categoryName,
                    })),
                },
                {
                    name: "supplier",
                    label: "Pemasok",
                    col: 2,
                    options: suppliers.map((s) => ({
                        value: String(s.id),
                        label: s.supplierName,
                    })),
                },
                {
                    name: "condition",
                    label: "Kondisi",
                    col: 2,
                    options: [
                        { value: "baik", label: "Baik" },
                        { value: "perlu_perawatan", label: "Perlu Perawatan" },
                        { value: "rusak", label: "Rusak" },
                    ],
                },
                {
                    name: "status",
                    label: "Status",
                    col: 2,
                    options: [
                        { value: "aktif", label: "Aktif" },
                        { value: "tidak_aktif", label: "Tidak Aktif" },
                    ],
                },
            ]}
        />
    );
}
