import PengelolaSupplierLayout from "@/components/layouts/pengelola/PengelolaSupplierLayout";
import Page from "../admin/Supplier";

export default function PengelolaSupplier(props: any) {
    return <Page {...props} />;
}

PengelolaSupplier.layout = (page: React.ReactNode) => <PengelolaSupplierLayout>{page}</PengelolaSupplierLayout>;
