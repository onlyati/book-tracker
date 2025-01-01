"use server";

import { GetRoom } from "@/lib/room";
import { ShelfResult, CreateShelf } from "@/lib/shelf";
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
export default async function AddShelfAction(
    rid: string,
    _: ShelfResult,
    formData: FormData
): Promise<ShelfResult> {
    // Convert `string | undefined` to `string | null` because
    // Prisma accept that one but FormData sends the first one
    const name: string =
        formData.get("name")?.toString() ??
        FailedToFetch("failed to fetch 'name' on /form/add/shelf");

    // Remove all non-englihs character from room name, make it lower case and replace spaces with underscores
    const desc: string | null = formData.get("desc")?.toString() ?? null;

    const roomReq = await GetRoom(rid);
    if (roomReq.room === null) {
        return {
            message: "Room not found",
            shelf: null,
            shelves: null,
        };
    }
    const room = roomReq.room;

    // Looking for forbidden characters, they just cause trouble
    if (name.includes("#") || name.includes("&")) {
        return {
            message: "Name cannot contains following characters: #, &",
            shelf: null,
            shelves: null,
        };
    }

    const shelf = await CreateShelf(room.id, name, desc);
    if (shelf.message !== null) {
        return shelf;
    }

    permanentRedirect("/explore/" + room.path);
}
