import PengelolaGymEquipmentLayout from "@/components/layouts/pengelola/PengelolaGymEquipmentLayout";
import Page from "../admin/GymEquipment";

export default function PengelolaGymEquipment(props: any) {
    return <Page {...props} />;
}

PengelolaGymEquipment.layout = (page: React.ReactNode) => <PengelolaGymEquipmentLayout>{page}</PengelolaGymEquipmentLayout>;
