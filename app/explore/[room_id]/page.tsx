import Link from "next/link";
import OkButton from "../../components/Button/OkButton";
import { MdAddCircleOutline } from "react-icons/md";
import { GetShelves, ShelfResult } from "@/lib/shelf";
import ShelfCard from "./ShelfCard";
import { GetRoom, RoomResult } from "@/lib/room";

export const dynamic = 'force-dynamic'

export default async function Page({
    params,
}: {
    params: Promise<{ room_id: string }>;
}) {
    const p = await params;
    const shelves: ShelfResult = await GetShelves(decodeURI(p.room_id));
    const list = shelves.shelves ?? [];

    const room: RoomResult = await GetRoom(decodeURI(p.room_id));

    return (
        <>
            <div className="flex flex-col md:flex-row items-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl flex-grow">Rooms &gt; {room.room?.name}</h1>
                <Link
                    href={"/form/add/shelf/" + decodeURI(p.room_id)}
                    className="w-full md:w-auto mt-6 md:mt-0"
                >
                    <OkButton className="w-full md:w-auto drop-shadow-xl flex items-center gap-2 text-xl">
                        <MdAddCircleOutline />
                        Add Shelf
                    </OkButton>
                </Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {list.map((shelf) => {
                    return (
                        <ShelfCard
                            name={shelf.name}
                            path={decodeURI(p.room_id)}
                            description={shelf.description}
                            shelf_id={shelf.id}
                            key={shelf.id}
                        />
                    );
                })}
            </div>
        </>
    );
}
