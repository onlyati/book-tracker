import Button from "./Button";
import { ButtonProps } from "./ButtonProps";

/**
 * Red button that indicated dangerous actions like delete a resource
 * @param props Button's properties
 * @returns Red buttton
 */
export default function DangerButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            className={`${
                props.className ?? ""
            } bg-red-300 hover:bg-red-500 text-red-900 hover:text-white`}
        />
    );
}
