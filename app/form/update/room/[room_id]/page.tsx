"use client";

import Card from "@/app/components/Card";
import NeutralTextInput from "@/app/components/Forms/NeutralTextInput";
import { useParams } from "next/navigation";
import WarnButton from "@/app/components/Button/WarnButton";
import UpdateRoomAction, { GetRoom } from "./action";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Room } from "@prisma/client";
import { IoCloudDownloadOutline } from "react-icons/io5";

/**
 * Update form for the room
 * @returns Rendered page
 */
export default function Page(): JSX.Element {
    // This is a dynamic route, and because it is on client side useParams hook can retrieve the data
    const p: { room_id: string } = useParams();

    // If we can't fetch data from database we redirect back to explore root page
    const router = useRouter();

    // Requires to render properly the component
    const [isLoading, setIsLoading] = useState(true);
    const [room, setRoom] = useState<Room>();

    // The useActionState hook connect the server process with this client page
    const [state, actionForm] = useActionState(
        UpdateRoomAction.bind(null, decodeURI(p.room_id)),
        {
            message: null,
            room: null,
        }
    );

    useEffect(() => {
        const loadForm = async () => {
            const room = await GetRoom(p.room_id);
            if (room === null) {
                router.push("/explore");
                return;
            }

            setRoom(room);
            setIsLoading(false);

            if (state !== null || state !== undefined) {
                if (state.room !== null) {
                    setRoom(state.room);
                    console.log(state.room);
                }
            }
        };
        loadForm();
    }, [router, p.room_id, state]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center text-6xl text-center">
                <IoCloudDownloadOutline />
                <p>Loading data</p>
            </div>
        );
    }

    return (
        <Card>
            <form action={actionForm}>
                <h1 className="text-2xl md:text-4xl text-center">
                    Rebuild the room
                </h1>
                <div className="flex flex-col gap-8 mt-6 md:mt-16">
                    <NeutralTextInput
                        placeholder="Name of the room"
                        elemName="name"
                        maxLength={16}
                        errorText={state?.message}
                        required={true}
                        value={room?.name ?? ""}
                    />
                    <NeutralTextInput
                        placeholder="Room's description"
                        elemName="desc"
                        maxLength={80}
                        errorText={null}
                        required={false}
                        value={room?.description ?? ""}
                    />
                    <WarnButton type="submit">Update room</WarnButton>
                </div>
            </form>
        </Card>
    );
}
