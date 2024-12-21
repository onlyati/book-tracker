"use client";

import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

/**
 * Button that is siwthcin between dark/light mode. This is controlled by local storage with `isDark` element.
 * @returns Button that is good to switch between ligh/dark mode
 */
export default function DarkModeSwitch(): JSX.Element {
    const [isDark, setIsDark] = useState<number>(0);

    // Initially this run when page is loading, so if dark was set before, it will set during page laod
    useEffect(() => {
        const initialTheme = localStorage.getItem("isDark");
        if (initialTheme === "1") {
            document.documentElement.classList.add("dark");
            setIsDark(1);
        }
    }, []);

    /**
     * Handle the click event on the button and reverse the mode
     */
    const switchHandler = () => {
        const isDark = localStorage.getItem("isDark");
        if (isDark === "1") {
            localStorage.setItem("isDark", "0");
            document.documentElement.classList.remove("dark");
            setIsDark(0);
        } else {
            localStorage.setItem("isDark", "1");
            document.documentElement.classList.add("dark");
            setIsDark(1);
        }
    };

    return (
        <>
            {isDark === 1 && (
                <button
                    onClick={switchHandler}
                    className="bg-cyan-950 border p-1 rounded-full border-zinc-500"
                >
                    <MdLightMode size={24} />
                </button>
            )}
            {isDark === 0 && (
                <button
                    onClick={switchHandler}
                    className="bg-stone-100 border p-1 rounded-full"
                >
                    <MdDarkMode size={24} />
                </button>
            )}
        </>
    );
}
