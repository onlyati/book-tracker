import { ButtonProps } from "./ButtonProps";

/**
 * Basic wrapper for buttons.
 * @param props Properties of the component
 * @returns Basic button component
 */
export default function Button(props: ButtonProps) {
    return (
        <button
            className={`${props.className ?? ""} px-4 py-2 rounded-md`}
            onClick={props.onClick}
            type={props.type ?? "button"}
        >
            {props.children}
        </button>
    );
}
