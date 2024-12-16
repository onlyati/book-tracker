"use client";

import Card from "@/app/components/Card";
import OkButton from "@/app/components/Button/OkButton";
import { useActionState } from "react";
import AddRoomAction from "./action";
import NeutralTextInput from "@/app/components/Forms/NeutralTextInput";

/**
 * Return with a client side form where user can build new rooms.
 * @returns Rendered form
 */
export default function Add() {
    const [state, formAction] = useActionState(AddRoomAction, {
        message: null,
        room: null,
    });

    return (
        <Card>
            <form action={formAction}>
                <h1 className="text-2xl md:text-4xl text-center">
                    Build new room
                </h1>
                <div className="flex flex-col gap-8 mt-6 md:mt-16">
                    <NeutralTextInput
                        placeholder="Name of the room"
                        elemName="name"
                        maxLength={16}
                        errorText={state?.message}
                        required={true}
                        value={state?.room?.name ?? ""}
                    />
                    <NeutralTextInput
                        placeholder="Room's description"
                        elemName="desc"
                        maxLength={80}
                        errorText={null}
                        required={false}
                        value={state?.room?.description ?? ""}
                    />
                    <OkButton type="submit">Build room</OkButton>
                </div>
            </form>
        </Card>
    );
}
