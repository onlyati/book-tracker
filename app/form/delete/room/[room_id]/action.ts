"use server";

import { Prisma, Room } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { permanentRedirect } from "next/navigation";

/**
 * Server action return with these information
 */
export type DeleteRoomActionResponse = {
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
 * Server action for room deletion
 * @param rid Room id
 * @param _ Previous state
 * @param formData Data from form
 * @returns Status of the action with room data
 */
export default async function DeleteRoomAction(
    rid: string,
    _: DeleteRoomActionResponse,
    formData: FormData
): Promise<DeleteRoomActionResponse> {
    // Convert `string | undefined` to `string | null` because
    // Prisma accept that one but FormData sends the first one
    const path: string =
        formData.get("verify")?.toString() ??
        FailedToFetch("failed to fetch 'name' on /form/delete/room/[room_id]");

    // If there is a typo during verification send error back
    if (rid !== path) {
        return {
            message:
                "You must type `" + rid + "` but yout passed `" + path + "`",
            room: null,
        };
    }

    const prisma = new PrismaClient();

    // If room does not exist no need to do anything
    const counter = await prisma.room.count({
        where: {
            path: path,
        },
    });
    if (counter === 0) {
        return {
            message: "Room does not exists",
            room: null,
        };
    }

    // Try to perform deletion
    try {
        const room = await prisma.room.delete({
            where: {
                path: path,
            },
        });
        console.log("deleted room: " + JSON.stringify(room));
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
