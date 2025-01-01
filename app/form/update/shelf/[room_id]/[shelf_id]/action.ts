"use server";

import { ShelfResult, UpdateShelf } from "@/lib/shelf";
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
export default async function UpdateShelfAction(
    room_id: string,
    shelf_id: string,
    _: ShelfResult,
    formData: FormData
): Promise<ShelfResult> {
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
            shelf: null,
            shelves: null,
        };
    }

    const shelf = await UpdateShelf(Number(shelf_id), name, desc);
    if (shelf.message !== null) {
        return shelf;
    }

    permanentRedirect("/explore/" + room_id);
}
