"use client";

import Card from "@/app/components/Card";
import OkButton from "@/app/components/Button/OkButton";
import { useActionState } from "react";
import NeutralTextInput from "@/app/components/Forms/NeutralTextInput";
import { useParams } from "next/navigation";
import AddShelfAction from "./action";
import AddBookAction from "./action";

/**
 * Return with a client side form where user can build new rooms.
 * @returns Rendered form
 */
export default function Add() {
    const p: { room_id: string; shelf_id: string } = useParams();
    p.room_id = decodeURI(p.room_id);
    p.shelf_id = decodeURI(p.shelf_id);

    const [state, formAction] = useActionState(
        AddBookAction.bind(null, p.room_id, p.shelf_id),
        {
            message: null,
            book: null,
            books: null,
        }
    );

    return (
        <Card>
            <form action={formAction}>
                <h1 className="text-2xl md:text-4xl text-center">
                    Add new book
                </h1>
                <div className="flex flex-col gap-8 mt-6 md:mt-16">
                    <NeutralTextInput
                        placeholder="ISBN code"
                        elemName="isbn"
                        maxLength={10}
                        errorText={state?.message}
                        required={true}
                        value={state?.book?.isbn ?? ""}
                    />
                    <OkButton type="submit">Search book</OkButton>
                </div>
            </form>
        </Card>
    );
}
