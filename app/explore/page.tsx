import { PrismaClient, Room } from "@prisma/client";
import RoomCard from "./RoomCard";
import Link from "next/link";
import OkButton from "../components/Button/OkButton";
import { MdAddCircleOutline } from "react-icons/md";

export const dynamic = 'force-dynamic'

/**
 * Page that display all defined rooms and provide manage actions like view, modify, delete.
 * Fetch the room list then iterate over and display them with `RoomCard` component.
 * @returns Rendered explore page
 */
export default async function Explore() {
    const prisma = new PrismaClient();
    const rooms: Room[] = await prisma.room.findMany();

    return (
        <>
            <div className="flex flex-col md:flex-row items-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl flex-grow">Select room</h1>
                <Link href="/form/add/room" className="w-full md:w-auto mt-6 md:mt-0">
                    <OkButton className="w-full md:w-auto drop-shadow-xl flex items-center gap-2 text-xl">
                        <MdAddCircleOutline />
                        Add Room
                    </OkButton>
                </Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {rooms.map((room) => {
                    return (
                        <RoomCard
                            name={room.name}
                            path={room.path}
                            description={room.description}
                            key={room.id}
                        />
                    );
                })}
            </div>
        </>
    );
}
