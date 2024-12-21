"use server";

import { PrismaClient, Room, Prisma } from "@prisma/client";
import { permanentRedirect } from "next/navigation";

/**
 * Server action return with these information
 */
export type UpdateRoomActionResponse = {
    /**
     * In case of fail, this is not null, but a description about the problem
     */
    message: string | null;

    /**
     * In case of successful action, return with the created resource
     */
    room: Room | null;
};

/**
 * Arbitrary function becaseu '??' did not let me to specify throw error there
 * @param message Message of error
 */
function FailedToFetch(message: string): string {
    throw new Error(message);
}

/**
 * Server action for room information update
 * @param room_id ID of the room
 * @param _ Previous State
 * @param formData Data from the form
 * @returns With the updated room object or with an error message
 */
export default async function UpdateRoomAction(
    room_id: string,
    _: UpdateRoomActionResponse,
    formData: FormData
): Promise<UpdateRoomActionResponse> {
    // Convert `string | undefined` to `string | null` because
    // Prisma accept that one but FormData sends the first one
    const name: string =
        formData.get("name")?.toString() ??
        FailedToFetch("failed to fetch 'name' on /form/add/room");
    const path: string = name.toLowerCase().replaceAll(" ", "_");
    const desc: string | null = formData.get("desc")?.toString() ?? null;

    // Looking for forbidden characters, they just cause trouble
    if (name.includes("#") || name.includes("&")) {
        return {
            message: "Name cannot contains following characters: #, &",
            room: null,
        };
    }

    const prisma = new PrismaClient();

    try {
        // Only update if the entry does exists
        const getRoom = await prisma.room.findUnique({
            where: {
                path: room_id,
            },
        });
        if (getRoom === null) {
            return {
                message: "Room does not exists",
                room: null,
            };
        }

        const room = await prisma.room.update({
            where: {
                path: room_id,
            },
            data: {
                name: name,
                path: path,
                description: desc,
            },
        });
        console.log("updated: " + JSON.stringify(room));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message: "Internal Server Error (databse error " + e.code + ")",
                room: null,
            };
        }
    }

    permanentRedirect("/explore");
}

/**
 * Action to fetch data from the server. This run initially when the form is loaded.
 * @param path ID of the room
 * @returns With details of the room
 */
export async function GetRoom(path: string): Promise<Room | null> {
    try {
        const p = decodeURI(path);
        const prisma = new PrismaClient();
        const room = prisma.room.findUnique({
            where: {
                path: p,
            },
        });

        return room;
    } catch (e) {
        console.log(e);
        return null;
    }
}
