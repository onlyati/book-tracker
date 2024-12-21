export default async function Page({
    params,
}: {
    params: Promise<{ room_id: string }>;
}) {
    const p = await params;
    return <p>View: {p.room_id}</p>;
}
