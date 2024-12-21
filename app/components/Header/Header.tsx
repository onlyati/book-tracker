import SearchBar from "./SearchBar";
import { LuBookCopy } from "react-icons/lu";
import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import NavBar from "../Navbar/NavBar";

/**
 * This is a header that displayed on the top of the page. This header dsiplay an icon, title and search box.
 * @param props Header properties
 * @returns With header component
 */
export default function Header(props: { title?: string }): JSX.Element {
    return (
        <div className="bg-zinc-50 my-0 mb-6 md:my-6 container mx-auto rounded-2xl dark:bg-sky-950 drop-shadow-xl">
            <div className="mx-2 md:mx-8 flex flex-col md:flex-row gap-2 md:gap-8 items-center pt-4">
                <div className="flex items-center text-2xl">
                    <LuBookCopy />
                    <Link href="/">
                        <h1 className="self-center text-2xl font-semibold whitespace-nowrap ml-2">
                            {props.title ? props.title : "My Book Tracker"}
                        </h1>
                    </Link>
                </div>
                <SearchBar className="w-full" />
                <DarkModeSwitch />
            </div>
            <hr className="mx-2 md:mx-8 border-stone-300 dark:border-zinc-500 my-2" />
            <NavBar className="mx-2 md:mx-8 pb-2" />
        </div>
    );
}
