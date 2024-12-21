/**
 * Properties for TextInput component
 */
export type TextInputProps = {
    /**
     * Placeholder value
     */
    placeholder: string;

    /**
     * Maximum lenght of the input
     */
    maxLength: number;

    /**
     * Error text that displayed at bottom of the page
     */
    errorText: string | null;

    /**
     * Required HTML attribute
     */
    required: boolean;

    /**
     * Name to be able to fetch its value from `FormData`
     */
    elemName: string;

    /**
     * Initial value of the text input
     */
    value: string;

    /**
     * Additional styling
     */
    className?: string;
};