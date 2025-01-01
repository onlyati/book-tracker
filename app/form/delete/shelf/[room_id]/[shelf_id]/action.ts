"use server";

import { DeleteShelf, ShelfResult } from "@/lib/shelf";
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
export default async function DeleteShelfAction(
    room_id: string,
    shelf_id: string,
    _: ShelfResult,
    formData: FormData
): Promise<ShelfResult> {
    // Convert `string | undefined` to `string | null` because
    // Prisma accept that one but FormData sends the first one
    const form_shelf_id: string =
        formData.get("verify")?.toString() ??
        FailedToFetch("failed to fetch 'name' on /form/delete/room/[room_id]");

    // If there is a typo during verification send error back
    if (shelf_id !== form_shelf_id) {
        return {
            message:
                "You must type `" + shelf_id + "` but yout passed `" + form_shelf_id + "`",
            shelf: null,
            shelves: null,
        };
    }

    const shelf = await DeleteShelf(Number(shelf_id));
    if (shelf.message !== null) {
        return shelf;
    }

    permanentRedirect("/explore/" + room_id);
}
