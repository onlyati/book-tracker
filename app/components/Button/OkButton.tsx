import Button from "./Button";
import { ButtonProps } from "./ButtonProps";

/**
 * Green button that indicates creation of something
 * @param props Button's properties
 * @returns Green button
 */
export default function OkButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            className={`${
                props.className ?? ""
            } bg-green-300 hover:bg-green-500 text-green-900 hover:text-white`}
        />
    );
}
