"use client";

import Card from "@/app/components/Card";
import OkButton from "@/app/components/Button/OkButton";
import { useActionState } from "react";
import NeutralTextInput from "@/app/components/Forms/NeutralTextInput";
import { useParams } from "next/navigation";
import AddShelfAction from "./action";

/**
 * Return with a client side form where user can build new rooms.
 * @returns Rendered form
 */
export default function Add() {
    const p: { room_id: string } = useParams();
    p.room_id = decodeURI(p.room_id);

    const [state, formAction] = useActionState(AddShelfAction.bind(null, p.room_id), {
        message: null,
        room: null,
        rooms: null,
    });

    return (
        <Card>
            <form action={formAction}>
                <h1 className="text-2xl md:text-4xl text-center">
                    Add new shelf
                </h1>
                <div className="flex flex-col gap-8 mt-6 md:mt-16">
                    <NeutralTextInput
                        placeholder="Name of the shelf"
                        elemName="name"
                        maxLength={16}
                        errorText={state?.message}
                        required={true}
                        value={state?.shelf?.name ?? ""}
                    />
                    <NeutralTextInput
                        placeholder="Shelf's description"
                        elemName="desc"
                        maxLength={80}
                        errorText={null}
                        required={false}
                        value={state?.shelf?.description ?? ""}
                    />
                    <OkButton type="submit">Build room</OkButton>
                </div>
            </form>
        </Card>
    );
}
