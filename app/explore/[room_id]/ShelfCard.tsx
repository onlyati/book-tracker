import Link from "next/link";
import Card from "@/app/components/Card";
import { GiCargoCrate } from "react-icons/gi";
import NeutralButton from "@/app/components/Button/NeutralButton";
import DangerButton from "@/app/components/Button/DangerButton";
import { TiDelete } from "react-icons/ti";
import WarnButton from "@/app/components/Button/WarnButton";

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

    /**
     * Unique key for the room
     */
    shelf_id: number;
};

/**
 * It renderes a card that fit for displaye room information.
 * @param props Component's properties
 * @returns Rendered card
 */
export default function ShelfCard(props: RoomCardProps) {
    return (
        <Card className="flex flex-col">
            <div className="flex gap-4 items-start text-4xl">
                <GiCargoCrate />
                <p className="flex-grow">{props.name}</p>
                <Link href={`/form/delete/shelf/${props.path}/${props.shelf_id}`}>
                    <DangerButton className="text-xl px-0 py-0">
                        <TiDelete />
                    </DangerButton>
                </Link>
            </div>
            <p className="mt-4 mb-8 flex-grow">{props.description}</p>
            <div className="flex">
                <Link href={`/form/update/shelf/${props.path}/${props.shelf_id}`} className="flex-grow">
                    <WarnButton>Update</WarnButton>
                </Link>
                <Link href={`/explore/${props.path}/${props.shelf_id}`}>
                    <NeutralButton>Visit</NeutralButton>
                </Link>
            </div>
        </Card>
    );
}
