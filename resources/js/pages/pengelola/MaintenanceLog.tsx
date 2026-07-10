import PengelolaMaintenanceLogLayout from "@/components/layouts/pengelola/PengelolaMaintenanceLogLayout";
import Page from "../admin/MaintenanceLog";

export default function PengelolaMaintenanceLog(props: any) {
    return <Page {...props} />;
}

PengelolaMaintenanceLog.layout = (page: React.ReactNode) => <PengelolaMaintenanceLogLayout>{page}</PengelolaMaintenanceLogLayout>;
