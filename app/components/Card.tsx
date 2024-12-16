import { ReactNode } from "react";

/**
 * Properties for the `Card` component
 */
type CardProps = {
    /**
     * What is displayed on the card
     */
    children: ReactNode;

    /**
     * Additional classes for card
     */
    className?: string;
};

/**
 * It render an empty and basic card. This is usually a bulding block for other specific cards.
 * @param props Properties of card
 * @returns Base card element
 */
export default function Card(props: CardProps) {
    return (
        <div
            className={`${
                props.className ?? ""
            } bg-white dark:bg-sky-950 px-8 py-4 rounded-xl drop-shadow-xl`}
        >
            {props.children}
        </div>
    );
}
