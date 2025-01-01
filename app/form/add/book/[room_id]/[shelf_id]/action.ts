"use server";

import { BookResult, CreateBook } from "@/lib/book";
import { GetRoom } from "@/lib/room";
import { ShelfResult, CreateShelf, GetShelf } from "@/lib/shelf";
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
export default async function AddBookAction(
    room_id: string,
    self_id: string,
    _: BookResult,
    formData: FormData
): Promise<BookResult> {
    // Convert `string | undefined` to `string | null` because
    // Prisma accept that one but FormData sends the first one
    const isbn: string =
        formData.get("isbn")?.toString() ??
        FailedToFetch("failed to fetch 'isbn' on /form/add/book");

    const roomReq = await GetRoom(room_id);
    if (roomReq.room === null) {
        return {
            message: "Room not found",
            book: null,
            books: null,
        };
    }
    const room = roomReq.room;

    const shelfReq = await GetShelf(Number(self_id));
    if (shelfReq.shelf === null) {
        return {
            message: "Shelf not found",
            book: null,
            books: null,
        };
    }
    const shelf = shelfReq.shelf;

    // Fetch book from openlibrary.org
    const bookReq = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    const bookJson = await bookReq.json();
    if (bookReq.status !== 200) {
        return {
            message: "Failed to fetch book from openlibrary.org",
            book: null,
            books: null,
        };
    }

    const book = bookJson[`ISBN:${isbn}`];
    if (book === undefined) {
        return {
            message: "Book not found",
            book: null,
            books: null,
        };
    }

    console.log(book["title"]);
    console.log(book["authors"]);
    var cover = null;
    if (book["cover"] !== undefined) {
        cover = book["cover"]["large"];
    }

    const newBook = await CreateBook(Number(self_id), book["title"], book["authors"][0]["name"], null, isbn, cover);
    if (newBook.message !== null) {
        return newBook;
    }
    
    permanentRedirect("/explore/" + room.path + "/" + shelf.id);
}
