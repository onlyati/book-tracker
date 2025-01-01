import { GetRoom } from "@/lib/room";
import { GetShelf } from "@/lib/shelf";
import Link from "next/link";
import OkButton from "@/app/components/Button/OkButton";
import { MdAddCircleOutline } from "react-icons/md";
import { GetBooks } from "@/lib/book";
import BookCard from "./BookCard";

export const dynamic = "force-dynamic";

export default async function Page({
    params,
}: {
    params: Promise<{ room_id: string; shelf_id: string }>;
}) {
    const p = await params;
    const room_id = decodeURI(p.room_id);
    p.shelf_id = decodeURI(p.shelf_id);
    const shelf_id = Number(p.shelf_id);
    const room = await GetRoom(room_id);
    const shelf = await GetShelf(shelf_id);
    const books = await GetBooks(shelf_id);

    // Sort bookes by title
    if (books.books !== null) {
        books.books.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });
    }

    return (
        <>
            <div className="flex flex-col md:flex-row items-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl flex-grow">
                    Rooms &gt; {room.room?.name} &gt; {shelf.shelf?.name}
                </h1>
                <Link
                    href={
                        "/form/add/book/" +
                        decodeURI(p.room_id) +
                        "/" +
                        decodeURI(p.shelf_id)
                    }
                    className="w-full md:w-auto mt-6 md:mt-0"
                >
                    <OkButton className="w-full md:w-auto drop-shadow-xl flex items-center gap-2 text-xl">
                        <MdAddCircleOutline />
                        Add Book
                    </OkButton>
                </Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                {books?.books?.map((book) => {
                    return <BookCard isbn={book.isbn} key={book.isbn} />;
                })}
            </div>
        </>
    );
}
