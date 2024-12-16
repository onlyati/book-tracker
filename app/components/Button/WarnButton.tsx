import Button from "./Button";
import { ButtonProps } from "./ButtonProps";

/**
 * Yellow button that indicates that something will happen, but not destory actions, like update a resource
 * @param props Button's properties
 * @returns Yellow button
 */
export default function WarnButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            className={`${
                props.className ?? ""
            } bg-orange-300 hover:bg-orange-500 text-orange-900 hover:text-white`}
        />
    );
}
