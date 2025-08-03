'use server'

import { auth } from "@/auth";
import { revalidateTag } from 'next/cache'
import { sendRequest } from "./api";



// Categori
export const handleCreateCategoryAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: data,
    });
    revalidateTag("list-categories");
    return res;
};

interface UpdateCategoryDto {
    name?: string;
    image?: string;
}

export const handleUpdateCategoryAction = async (data: UpdateCategoryDto & { _id: string }) => {
    const session = await auth();
    if (!data._id) throw new Error("ID is required for update");

    const { _id, ...updateData } = data; // Tách _id ra khỏi body
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${_id}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: updateData, // Chỉ gửi name và image
    });

    revalidateTag("list-categories");
    return res;
};

export const handleDeleteCategoryAction = async (id: string) => {
    const session = await auth();
    const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });
    revalidateTag("list-categories");
    return res;
};

