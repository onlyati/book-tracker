import Link from "next/link";
import Card from "../components/Card";
import { LuWarehouse } from "react-icons/lu";
import NeutralButton from "../components/Button/NeutralButton";
import DangerButton from "../components/Button/DangerButton";
import { TiDelete } from "react-icons/ti";
import WarnButton from "../components/Button/WarnButton";

/**
 * Properties for RoomCard
 */
type RoomCardProps = {
    /**
     * Name of the room
     */
    name: string;

    /**
     * URI path for the room
     */
    path: string;

    /**
     * Description of the room
     */
    description?: string | null;
};

/**
 * It renderes a card that fit for displaye room information.
 * @param props Component's properties
 * @returns Rendered card
 */
export default function RoomCard(props: RoomCardProps) {
    return (
        <Card className="flex flex-col">
            <div className="flex gap-4 items-start text-4xl">
                <LuWarehouse />
                <p className="flex-grow">{props.name}</p>
                <Link href={`/form/delete/room/${props.path}`}>
                    <DangerButton className="text-xl px-0 py-0">
                        <TiDelete />
                    </DangerButton>
                </Link>
            </div>
            <p className="mt-4 mb-8 flex-grow">{props.description}</p>
            <div className="flex">
                <Link href={`/form/update/room/${props.path}`} className="flex-grow">
                    <WarnButton>Update</WarnButton>
                </Link>
                <Link href={`/explore/${props.path}`}>
                    <NeutralButton>Visit room</NeutralButton>
                </Link>
            </div>
        </Card>
    );
}
