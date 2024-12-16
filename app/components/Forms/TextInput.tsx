"use client";

import { ChangeEvent, useState } from "react";
import { TextInputProps } from "./TextInputProps";

/**
 * This render an input field with text type for forms that are used with ServerAction
 * @param props Input's properties
 * @returns Rendered component
 */
export default function TextInput(props: TextInputProps): JSX.Element {
    const [inputLen, SetInputLen] = useState(props.value.length);
    const [inputText, SetInputText] = useState(props.value);

    const valueOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trimStart();
        if (value.length > props.maxLength) {
            return;
        }

        SetInputLen(value.length);
        SetInputText(value);
    };

    return (
        <div>
            <input
                name={props.elemName}
                required={props.required}
                onChange={valueOnChange}
                type="text"
                value={inputText}
                placeholder={props.placeholder}
                className={`${
                    props.className ?? ""
                } w-full rounded`}
            ></input>
            <div className="flex">
                <p className="flex-grow text-red-500" aria-live="polite">
                    {props.errorText ?? ""}
                </p>
                <p className="text-stone-400">
                    {inputLen}/{props.maxLength}
                </p>
            </div>
        </div>
    );
}
