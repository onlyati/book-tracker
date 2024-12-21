"use server";

import { Prisma, Room } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { permanentRedirect } from "next/navigation";

/**
 * Server action return with these information
 */
export type AddRoomActionResponse = {
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
 * Server action for room creation
 * @param _ Previous state
 * @param formData Data from the form
 * @returns Status of the action or with room data
 */
export default async function AddRoomAction(
    _: AddRoomActionResponse,
    formData: FormData
): Promise<AddRoomActionResponse> {
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

    // If room already exists, then fail
    const counter = await prisma.room.count({
        where: {
            OR: [{ name: name }, { path: path }],
        },
    });
    if (counter > 0) {
        return {
            message: "Room already exists",
            room: null,
        };
    }

    // Try to create room, if failed then send "brü-hü-hü" message
    let room: Room | null = null;
    try {
        room = await prisma.room.create({
            data: {
                name: name,
                path: path,
                description: desc,
            },
        });
        console.log("created room: " + JSON.stringify(room));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message: "Internal Server Error (databse error " + e.code + ")",
                room: null,
            };
        }
    }

    permanentRedirect("/explore/" + room?.path);
}
