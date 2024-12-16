import { TextInputProps } from "./TextInputProps";
import TextInput from "./TextInput";

/**
 * This component render a normal input, good to ask any input
 * @param props Properties of text input
 * @returns Rendered component
 */
export default function NeutralTextInput(props: TextInputProps) {
    return (
        <TextInput
            {...props}
            className={`${
                props.className ?? ""
            } bg-stone-100 dark:bg-gray-900 focus:outline-none focus:ring-0 dark:placeholder-stone-400 border-stone-200 dark:border-zinc-500 focus:border-stone-200 dark:focus:border-zinc-500`}
        />
    );
}
