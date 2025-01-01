"use server";

import { Prisma, PrismaClient, Room } from "@prisma/client";
import { DeleteShelf, GetShelves } from "./shelf";

export type RoomResult = {
    message: string | null;
    room: Room | null;
    rooms: Room[] | null;
};

/**
 * Server action return with these information
 * @param room Room name
 * @param description Room description
 * @returns Status of the action with room data
 */
export async function NewRoom(
    room: string,
    description: string | null
): Promise<RoomResult> {
    const prism = new PrismaClient();

    // Remove all non-englihs character from room name, make it lower case and replace spaces with underscores
    const room_id: string = room
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replaceAll(" ", "_")
        .toLowerCase();

    // Check if room already exists
    const counter = await prism.room.count({
        where: {
            OR: [{ name: room }, { path: room_id }],
        },
    });

    if (counter > 0) {
        return {
            message: "Room already exists",
            room: null,
            rooms: null,
        };
    }

    // Try to create new room, if failed then send error message
    let new_room = null;
    try {
        new_room = await prism.room.create({
            data: {
                name: room,
                path: room_id,
                description: description,
            },
        });
        console.log("created room: " + JSON.stringify(new_room));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                room: null,
                rooms: null,
            };
        }
    }
    return {
        message: null,
        room: new_room,
        rooms: null,
    };
}

/**
 * Function that delete a room if exists else return with error message
 * @parm room_id Room id
 * @returns Status of the action with room data
 */
export async function DeleteRoom(room_id: string): Promise<RoomResult> {
    const prism = new PrismaClient();

    // If room does not exist no need to do anything
    const counter = await prism.room.count({
        where: {
            path: room_id,
        },
    });
    if (counter === 0) {
        return {
            message: "Room does not exists",
            room: null,
            rooms: null,
        };
    }

    // Delete all shelf that belongs to this room
    const shelves = await GetShelves(room_id);
    if (shelves !== null) {
        if (shelves.shelves !== null) {
            for (const shelf of shelves.shelves) {
                await DeleteShelf(shelf.id);
            }
        }
    }

    // Try to perform deletion
    var room = null;
    try {
        room = await prism.room.delete({
            where: {
                path: room_id,
            },
        });
        console.log("deleted room: " + JSON.stringify(room));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                room: null,
                rooms: null,
            };
        }
    }
    return {
        message: null,
        room: room,
        rooms: null,
    };
}

/**
 * Update room name and description based on its path
 * @param room_id Room id
 * @param new_name New name of the room
 * @param new_desc New description of the room
 * @returns Status of the action with room data
 */
export async function UpdateRoom(
    room_id: string,
    new_name: string,
    new_desc: string | null
): Promise<RoomResult> {
    const prism = new PrismaClient();

    // If room does not exist no need to do anything
    const counter = await prism.room.count({
        where: {
            path: room_id,
        },
    });

    if (counter === 0) {
        const result = {
            message: "Room does not exists",
            room: null,
            rooms: null,
        };
        return result;
    }

    // Try to update room
    var room = null;
    try {
        room = await prism.room.update({
            where: {
                path: room_id,
            },
            data: {
                name: new_name,
                description: new_desc,
                path: new_name
                    .replace(/[^a-zA-Z0-9 ]/g, "")
                    .replaceAll(" ", "_")
                    .toLowerCase(),
            },
        });
        console.log("updated room: " + JSON.stringify(room));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                room: null,
                rooms: null,
            };
        }
    }
    return {
        message: null,
        room: room,
        rooms: null,
    };
}

/**
 * Get room data based on its path
 * @param room_id Room id
 * @returns Room data
 */
export async function GetRoom(room_id: string): Promise<RoomResult> {
    const prism = new PrismaClient();

    const room = await prism.room.findUnique({
        where: {
            path: room_id,
        },
    });

    return {
        message: null,
        room: room,
        rooms: null,
    };
}

/**
 * Get all rooms
 * @returns All rooms
 */
export async function GetAllRooms(): Promise<RoomResult> {
    const prism = new PrismaClient();

    const rooms = await prism.room.findMany();

    return {
        message: null,
        room: null,
        rooms: rooms,
    };
}
