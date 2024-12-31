import { Prisma, PrismaClient } from "@prisma/client";

/**
 * This function create a new Shelf if not already exists within the room
 * @param room_id Room id
 * @parm name Name of the shelf
 * @param description Description of the shelf
 * @returns Status of the action with shelf data
 */
export async function CreateShelf(
    room_id: string,
    name: string,
    description: string | null
) {
    const prism = new PrismaClient();

    // Creat a new shelf correlation with the room table
    let shelf = null;
    try {
        shelf = await prism.shelf.create({
            data: {
                name: name,
                room: {
                    connect: {
                        path: room_id,
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
            };
        }
    }
}

/**
 * Get list about shelves based on a room id
 * @param room_id Room id
 * @returns List of shelves
 */
export async function GetShelves(room_id: string) {
    const prism = new PrismaClient();

    // Get all shelves from the room
    const shelves = await prism.shelf.findMany({
        where: {
            room: {
                path: room_id,
            },
        },
    });

    return shelves;
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
) {
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
        };
    }

    // Try to update shelf
    try {
        const shelf = await prism.shelf.update({
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
            };
        }
    }
}

/**
 * Function taht delete a shelf based on its id
 * @param shelf_id Shelf id
 * @returns Status of the action with shelf data
 */
export async function DeleteShelf(id: number) {
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
        };
    }

    // Try to perform deletion
    try {
        const shelf = await prism.shelf.delete({
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
            };
        }
    }
}

/**
 * Function that get a shelf based on its id
 * @param shelf_id Shelf id
 * @returns Shelf data
 */
export async function GetShelf(id: number) {
    const prism = new PrismaClient();

    // Get shelf based on its id
    const shelf = await prism.shelf.findUnique({
        where: {
            id: id,
        },
    });

    return shelf;
}
