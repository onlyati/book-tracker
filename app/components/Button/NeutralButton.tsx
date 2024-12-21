import Button from "./Button";
import { ButtonProps } from "./ButtonProps";

/**
 * Blue button that indicates neutral actions like view something
 * @param props Button's properties
 * @returns Blue button
 */
export default function NeutralButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            className={`${
                props.className ?? ""
            } bg-blue-300 hover:bg-blue-500 text-blue-900 hover:text-white`}
        />
    );
}
