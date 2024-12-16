"use client";

import { usePathname } from "next/navigation";
import MenuItem from "./MenuItem";
import { useEffect, useState } from "react";

/**
 * Type to store the menupoint. Item is rendered based on it.
 */
type MenuItemElement = {
    /**
     * Menupoint name that is displayed
     */
    title: string;

    /**
     * Where the menu should point
     */
    link: string;

    /**
     * If the match mechanism match with the current path, then the `extraClass` will be applied
     */
    match: "partialMatch" | "fullMatch";

    /**
     * Additional class for match mechanism
     */
    extraClass?: string;
};

/**
 * This component render the navigation bar.
 * @param props Properties of navigation bar
 * @returns Navigation bar component
 */
export default function NavBar(props: { className?: string }): JSX.Element {
    const path = usePathname();
    const elements: MenuItemElement[] = [
        {
            title: "Actuals",
            link: "/",
            match: "fullMatch",
        },
        {
            title: "Dashboard",
            link: "/dashboard",
            match: "partialMatch",
        },
        {
            title: "Explore",
            link: "/explore",
            match: "partialMatch",
        },
        {
            title: "Forms",
            link: "/form",
            match: "partialMatch",
        },
    ];
    const [options, setOptions] = useState(elements);

    // Whenever the address is chaneging, this code is run and handle the additional class
    const activeClass = "bg-stone-200 dark:bg-gray-900";
    useEffect(() => {
        setOptions((o) => {
            const n = o.map((option) => {
                option.extraClass = "";
                if (option.match === "fullMatch" && path === option.link) {
                    option.extraClass = activeClass;
                }
                if (
                    option.match === "partialMatch" &&
                    path.startsWith(option.link)
                ) {
                    option.extraClass = activeClass;
                }
                return option;
            });
            return n;
        });
    }, [path]);

    return (
        <nav
            className={`${
                props.className ?? ""
            } flex flex-col md:flex-row gap-2`}
        >
            {options.map((option) => {
                return (
                    <MenuItem
                        key={option.link}
                        title={option.title}
                        link={option.link}
                        className={option.extraClass}
                    />
                );
            })}
        </nav>
    );
}
