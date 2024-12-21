import { redirect } from "next/navigation";
import { FaSearch } from "react-icons/fa";

/**
 * This component render a client side search box.
 * This is where user can search for books in their and online repository.
 * @param props Properties for the component
 * @returns With search box component
 */
export default function SearchBar(props: { className?: string }): JSX.Element {
    async function submitAction(formData: FormData) {
        "use server";
        const s = formData.get("searchText")?.toString() ?? "";
        redirect("/search?s=" + encodeURI(s));
    }

    return (
        <form
            className={`${props.className ? props.className : ""}`}
            action={submitAction}
        >
            <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
                Search
            </label>
            <div className="bg-stone-100 dark:bg-gray-900 rounded flex items-center border dark:border-zinc-500 px-4 text-xl">
                <FaSearch />
                <input
                    name="searchText"
                    type="text"
                    placeholder="Search for books..."
                    className="bg-stone-100 dark:bg-gray-900 focus:outline-none ml-2 p-1 flex-grow dark:placeholder-stone-400 border-0"
                />
            </div>
        </form>
    );
}
