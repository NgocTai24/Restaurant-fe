'use server'

import { auth, signIn } from "@/auth";
import { revalidateTag } from 'next/cache'
import { sendRequest } from "./api";


// Actions cho MenuItems
export const handleCreateMenuItemAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: data,
    });
    revalidateTag("list-menuitems");
    return res;
};

export const handleUpdateMenuItemAction = async (data: any & { _id: string }) => {
    const session = await auth();
    if (!data._id) throw new Error("ID is required for update");
    const { _id, ...updateData } = data;
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/${_id}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: updateData,
    });
    revalidateTag("list-menuitems");
    return res;
};

export const handleDeleteMenuItemAction = async (id: string) => {
    const session = await auth();
    const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });
    revalidateTag("list-menuitems");
    return res;
};

