import PengelolaLayout from "@/components/layouts/pengelola/PengelolaLayout";
import Page from "../admin/Dashboard";

export default function PengelolaDashboard(props: any) {
    return <Page {...props} />;
}

PengelolaDashboard.layout = (page: React.ReactNode) => <PengelolaLayout>{page}</PengelolaLayout>;
