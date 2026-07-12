import PimpinanLayout from "@/components/layouts/pimpinan/PimpinanLayout";
import Page from "../admin/Dashboard";

export default function PimpinanDashboard(props: any) {
    return <Page {...props} />;
}

PimpinanDashboard.layout = (page: React.ReactNode) => <PimpinanLayout>{page}</PimpinanLayout>;
