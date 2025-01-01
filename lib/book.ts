"use server";

import { Prisma, PrismaClient, Book } from "@prisma/client";

export type BookResult = {
    message: string | null;
    book: Book | null;
    books: Book[] | null;
};

/**
 * This function create a new Book item if it is not already exists
 * @param shelf_id Shelf id
 * @param title Title of the book
 * @param author Author of the book
 * @param description Description of the book
 * @param isbn ISBN of the book
 * @param cover Cover image of the book
 * @returns Status of the action with book data
 */
export async function CreateBook(
    shelf_id: number,
    title: string,
    author: string,
    description: string | null,
    isbn: string,
    cover: string | null
): Promise<BookResult> {
    const prism = new PrismaClient();

    // Create a new book correlation with the shelf table
    let book = null;
    try {
        book = await prism.book.create({
            data: {
                title: title,
                author: author,
                shelf: {
                    connect: {
                        id: shelf_id,
                    },
                },
                description: description,
                isbn: isbn,
                cover: cover,
            },
        });
        console.log("created book: " + JSON.stringify(book));
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                book: null,
                books: null,
            };
        }
    }
    return {
        message: null,
        book: book,
        books: null,
    };
}

/**
 * This function get a list of books based on a shelf id
 * @param shelf_id Shelf id
 * @returns List of books
 */
export async function GetBooks(shelf_id: number): Promise<BookResult> {
    const prism = new PrismaClient();

    // Get all books from the shelf
    const books = await prism.book.findMany({
        where: {
            shelf: {
                id: shelf_id,
            },
        },
    });
    return {
        message: null,
        book: null,
        books: books,
    };
}

/**
 * This function update book title, author, description, ISBN and cover
 * @param book_id Book id
 * @param new_title New title of the book
 * @param new_author New author of the book
 * @param new_desc New description of the book
 * @param new_isbn New ISBN of the book
 * @param new_cover New cover image of the book
 * @returns Status of the action with book data
 */
export async function UpdateBook(
    book_id: number,
    new_title: string,
    new_author: string,
    new_desc: string | null,
    new_isbn: string,
    new_cover: string | null
): Promise<BookResult> {
    const prism = new PrismaClient();

    // Update book data
    let book = null;
    try {
        book = await prism.book.update({
            where: {
                id: book_id,
            },
            data: {
                title: new_title,
                author: new_author,
                description: new_desc,
                isbn: new_isbn,
                cover: new_cover,
            },
        });
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                book: null,
                books: null,
            };
        }
    }
    return {
        message: null,
        book: book,
        books: null,
    };
}

/**
 * This function delete a book from the database
 * @param book_id Book id
 * @returns Status of the action
 */
export async function DeleteBook(book_id: number): Promise<BookResult> {
    const prism = new PrismaClient();

    // Delete book from the database
    var book = null;
    try {
        book = await prism.book.delete({
            where: {
                id: book_id,
            },
        });
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message:
                    "Internal Server Error (database error " + e.code + ")",
                book: null,
                books: null,
            };
        }
    }
    return {
        message: null,
        book: book,
        books: null,
    };
}


/**
 * Get based based on its ISBN number
 * @param isbn ISBN number
 * @returns Book data
 */
export async function GetBook(isbn: string): Promise<BookResult> {
    const prism = new PrismaClient();

    // Get book based on its ISBN number
    const book = await prism.book.findUnique({
        where: {
            isbn: isbn,
        },
    });
    return {
        message: null,
        book: book,
        books: null,
    };
}