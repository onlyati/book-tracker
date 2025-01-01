import Card from "@/app/components/Card";
import { GetBook } from "@/lib/book";

/**
 * Properties for RoomCard
 */
type BookCardProps = {
    isbn: string;
};

/**
 * It renderes a card that fit for displaye room information.
 * @param props Component's properties
 * @returns Rendered card
 */
export default async function BookCard(props: BookCardProps) {
    const bookRes = await GetBook(props.isbn);
    const book = bookRes.book;

    return (
        <Card className="flex flex-col md:flex-row gap-4">
            <div>
                {book?.cover !== null && (
                    <img
                        src={book?.cover ?? ""}
                        alt="Book cover"
                        className="object-cover w-64 h-96"
                    />
                )}
                {book?.cover === null && <div className="w-64 h-96 bg-zinc-300 dark:bg-gray-700" />}
            </div>
            <div>
                <label className="text-sm text-zinc-700 dark:text-zinc-300">Title</label>
                <p className="text-xl mb-4">{book?.title}</p>
                <label className="text-sm text-zinc-700 dark:text-zinc-300">Author</label>
                <p className="text-xl mb-4">{book?.author}</p>
                {book?.description && (
                    <div>
                        <label className="text-sm text-zinc-700 dark:text-zinc-300">
                            Description
                        </label>
                        <p className="text-xl mb-4">
                            {book?.description ?? " "}
                        </p>
                    </div>
                )}
                <label className="text-sm text-zinc-700 dark:text-zinc-300">ISBN</label>
                <p className="text-xl mb-4">{props.isbn}</p>
            </div>
        </Card>
    );
}
