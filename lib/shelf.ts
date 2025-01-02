"use server";

import { Prisma, PrismaClient, Shelf } from "@prisma/client";
import { DeleteBook, GetBooks } from "./book";

export type ShelfResult = {
    message: string | null;
    shelf: Shelf | null;
    shelves: Shelf[] | null;
};

/**
 * This function create a new Shelf if not already exists within the room
 * @param room_id Room id
 * @parm name Name of the shelf
 * @param description Description of the shelf
 * @returns Status of the action with shelf data
 */
export async function CreateShelf(
    room_id: number,
    name: string,
    description: string | null
): Promise<ShelfResult> {
    const prism = new PrismaClient();

    // Creat a new shelf correlation with the room table
    let shelf = null;
    try {
        shelf = await prism.shelf.create({
            data: {
                name: name,
                room: {
                    connect: {
                        id: room_id,
                    },
                },
                description: description,
            },
        });
        console.log("created shelf: " + JSON.stringify(shelf));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                shelf: null,
                shelves: null,
            };
        }
    }
    return {
        message: null,
        shelf: shelf,
        shelves: null,
    }
}

/**
 * Get list about shelves based on a room id
 * @param room_id Room id
 * @returns List of shelves
 */
export async function GetShelves(room_id: string): Promise<ShelfResult> {
    const prism = new PrismaClient();

    // Get all shelves from the room
    const shelves = await prism.shelf.findMany({
        where: {
            room: {
                path: room_id,
            },
        },
    });

    return {
        message: null,
        shelf: null,
        shelves: shelves,
    };
}

/**
 * Function that update shelf name and description
 * @param shelf_id Shelf id
 * @param new_name New name of the shelf
 * @param new_desc New description of the shelf
 * @returns Status of the action with shelf data
 */
export async function UpdateShelf(
    id: number,
    new_name: string,
    new_desc: string | null
): Promise<ShelfResult> {
    const prism = new PrismaClient();

    // If shelf does not exist no need to do anything
    const counter = await prism.shelf.count({
        where: {
            id: id,
        },
    });

    if (counter === 0) {
        return {
            message: "Shelf does not exists",
            shelf: null,
            shelves: null,
        };
    }

    // Try to update shelf
    let shelf = null;
    try {
        shelf = await prism.shelf.update({
            where: {
                id: id,
            },
            data: {
                name: new_name,
                description: new_desc,
            },
        });
        console.log("updated shelf: " + JSON.stringify(shelf));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                shelf: null,
                shelves: null,
            };
        }
    }
    return {
        message: null,
        shelf: shelf,
        shelves: null,
    }
}

/**
 * Function taht delete a shelf based on its id
 * @param shelf_id Shelf id
 * @returns Status of the action with shelf data
 */
export async function DeleteShelf(id: number): Promise<ShelfResult> {
    const prism = new PrismaClient();

    // If shelf does not exist no need to do anything
    const counter = await prism.shelf.count({
        where: {
            id: id,
        },
    });

    if (counter === 0) {
        return {
            message: "Shelf does not exists",
            shelf: null,
            shelves: null,
        };
    }

    // Delete all books from the shelf
    const books = await GetBooks(id);
    if (books !== null) {
        if (books.books !== null) {
            for (const book of books.books) {
                await DeleteBook(book.id);
            }
        }
    }

    // Try to perform deletion
    let shelf = null;
    try {
        shelf = await prism.shelf.delete({
            where: {
                id: id,
            },
        });
        console.log("deleted shelf: " + JSON.stringify(shelf));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                shelf: null,
                shelves: null,
            };
        }
    }
    return {
        message: null,
        shelf: shelf,
        shelves: null,
    }
}

/**
 * Function that get a shelf based on its id
 * @param shelf_id Shelf id
 * @returns Shelf data
 */
export async function GetShelf(id: number): Promise<ShelfResult> {
    const prism = new PrismaClient();

    // Get shelf based on its id
    const shelf = await prism.shelf.findUnique({
        where: {
            id: id,
        },
    });

    return {
        message: null,
        shelf: shelf,
        shelves: null,
    }
}

/**
 * Function to get all shelves
 * @param room_id Room id
 * @returns List of shelves
 */
export async function GetAllShelves(): Promise<ShelfResult> {
    const prism = new PrismaClient();

    // Get all shelves
    const shelves = await prism.shelf.findMany();

    return {
        message: null,
        shelf: null,
        shelves: shelves,
    };
}
