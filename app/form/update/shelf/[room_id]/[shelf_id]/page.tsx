"use client";

import Card from "@/app/components/Card";
import NeutralTextInput from "@/app/components/Forms/NeutralTextInput";
import { useParams } from "next/navigation";
import WarnButton from "@/app/components/Button/WarnButton";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Room, Shelf } from "@prisma/client";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { GetShelf } from "@/lib/shelf";
import UpdateShelfAction from "./action";

/**
 * Update form for the room
 * @returns Rendered page
 */
export default function Page(): JSX.Element {
    // This is a dynamic route, and because it is on client side useParams hook can retrieve the data
    const p: { room_id: string, shelf_id: string } = useParams();

    // If we can't fetch data from database we redirect back to explore root page
    const router = useRouter();

    // Requires to render properly the component
    const [isLoading, setIsLoading] = useState(true);
    const [shelf, setShelf] = useState<Shelf>();

    // The useActionState hook connect the server process with this client page
    const [state, actionForm] = useActionState(
        UpdateShelfAction.bind(null, decodeURI(p.room_id), decodeURI(p.shelf_id)),
        {
            message: null,
            shelf: null,
            shelves: null,
        }
    );

    useEffect(() => {
        const loadForm = async () => {
            const shelf = await GetShelf(Number(decodeURI(p.shelf_id)));
            if (shelf === null) {
                router.push("/explore");
                return;
            }

            if (shelf.shelf === null) {
                router.push("/explore");
                return;
            }

            setShelf(shelf.shelf);
            setIsLoading(false);

            if (state !== null || state !== undefined) {
                if (state.shelf !== null) {
                    setShelf(state.shelf);
                    console.log(state.shelf);
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
                        value={shelf?.name ?? ""}
                    />
                    <NeutralTextInput
                        placeholder="Room's description"
                        elemName="desc"
                        maxLength={80}
                        errorText={null}
                        required={false}
                        value={shelf?.description ?? ""}
                    />
                    <WarnButton type="submit">Update room</WarnButton>
                </div>
            </form>
        </Card>
    );
}
