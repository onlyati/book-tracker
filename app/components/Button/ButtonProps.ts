import { MouseEventHandler, ReactNode } from "react";

/**
 * Properties for button
 */
export type ButtonProps = {
    /**
     * Child component of button
     */
    children: ReactNode;

    /**
     * Additional classes for button
     */
    className?: string;

    /**
     * OnClick event for button
     */
    onClick?: MouseEventHandler<HTMLElement>;

    /**
     * Button's type
     */
    type?: "submit" | "reset" | "button" | undefined;
};