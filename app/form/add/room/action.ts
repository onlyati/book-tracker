"use server";

import { RoomResult, NewRoom } from "@/lib/room";
import { permanentRedirect } from "next/navigation";

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
    _: RoomResult,
    formData: FormData
): Promise<RoomResult> {
    // Convert `string | undefined` to `string | null` because
    // Prisma accept that one but FormData sends the first one
    const name: string =
        formData.get("name")?.toString() ??
        FailedToFetch("failed to fetch 'name' on /form/add/room");

    // Remove all non-englihs character from room name, make it lower case and replace spaces with underscores
    const desc: string | null = formData.get("desc")?.toString() ?? null;

    // Looking for forbidden characters, they just cause trouble
    if (name.includes("#") || name.includes("&")) {
        return {
            message: "Name cannot contains following characters: #, &",
            room: null,
            rooms: null,
        };
    }

    const room = await NewRoom(name, desc);
    if (room.message !== null) {
        return room;
    }

    permanentRedirect("/explore/" + room?.room?.path);
}
