"use server";

import { RoomResult } from "@/lib/room";
import { DeleteRoom } from "@/lib/room";
import { permanentRedirect } from "next/navigation";

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
    _: RoomResult,
    formData: FormData
): Promise<RoomResult> {
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
            rooms: null,
        };
    }

    const room = await DeleteRoom(rid);
    if (room.message !== null) {
        return room;
    }

    permanentRedirect("/explore");
}
