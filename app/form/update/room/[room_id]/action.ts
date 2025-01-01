"use server";

import { RoomResult, UpdateRoom } from "@/lib/room";
import { permanentRedirect } from "next/navigation";

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
    _: RoomResult,
    formData: FormData
): Promise<RoomResult> {
    // Convert `string | undefined` to `string | null` because
    // Prisma accept that one but FormData sends the first one
    const name: string =
        formData.get("name")?.toString() ??
        FailedToFetch("failed to fetch 'name' on /form/add/room");
    const desc: string | null = formData.get("desc")?.toString() ?? null;

    // Looking for forbidden characters, they just cause trouble
    if (name.includes("#") || name.includes("&")) {
        return {
            message: "Name cannot contains following characters: #, &",
            room: null,
            rooms: null,
        };
    }

    const room = await UpdateRoom(room_id, name, desc);
    if (room.message !== null) {
        return room;
    }

    permanentRedirect("/explore");
}

