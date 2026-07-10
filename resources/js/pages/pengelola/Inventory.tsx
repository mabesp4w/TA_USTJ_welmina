import PengelolaInventoryLayout from "@/components/layouts/pengelola/PengelolaInventoryLayout";
import Page from "../admin/Inventory";

export default function PengelolaInventory(props: any) {
    return <Page {...props} />;
}

PengelolaInventory.layout = (page: React.ReactNode) => <PengelolaInventoryLayout>{page}</PengelolaInventoryLayout>;
