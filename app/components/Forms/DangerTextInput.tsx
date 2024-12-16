import { TextInputProps } from "./TextInputProps";
import TextInput from "./TextInput";

/**
 * This component render a red text input, that is handy to verify dangerous actions
 * @param props Properties of text input
 * @returns Rendered component
 */
export default function DangerTextInput(props: TextInputProps) {
    return (
        <TextInput
            {...props}
            className={`${
                props.className ?? ""
            } bg-red-200 focus:outline-none focus:ring-0 border-red-600 border-2 text-red-500 placeholder-red-500`}
        />
    );
}
