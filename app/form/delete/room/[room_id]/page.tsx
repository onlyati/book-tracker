"use client";

import DangerButton from "@/app/components/Button/DangerButton";
import OkButton from "@/app/components/Button/OkButton";
import Card from "@/app/components/Card";
import Link from "next/link";
import DeleteRoomAction from "./action";
import { useActionState } from "react";
import { useParams } from "next/navigation";
import DangerTextInput from "@/app/components/Forms/DangerTextInput";

/**
 * This is a client side form that render a verification site to remove room
 * @returns Rendered component
 */
export default function Page() {
    // This is a dynamic route, and because it is on client side useParams hook can retrieve the data
    const p: { room_id: string } = useParams();

    // The useActionState hook connect the server process with this client page
    const [state, formAction] = useActionState(DeleteRoomAction.bind(null, p.room_id), {
        message: null,
        room: null,
    });

    return (
        <Card>
            <form action={formAction}>
                <h1 className="text-2xl md:text-4xl text-center mb-6">
                    To delete room, type the room path below:{" "}
                    <strong>{decodeURI(p.room_id)}</strong>
                </h1>
                <DangerTextInput
                    placeholder="Type room path here to verify"
                    elemName="verify"
                    maxLength={p.room_id.length}
                    errorText={state?.message}
                    required={true}
                    value={state?.room?.path ?? ""}
                />
                <div className="flex flex-col md:flex-row gap-6 md:gap-32 justify-center mt-6">
                    <DangerButton type="submit" className="w-full md:w-auto">
                        I delete it, with all of its content!
                    </DangerButton>
                    <Link href="/explore">
                        <OkButton className="w-full md:w-auto">
                            No, I changed my mind
                        </OkButton>
                    </Link>
                </div>
            </form>
        </Card>
    );
}
