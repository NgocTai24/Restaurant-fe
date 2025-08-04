import { auth } from "@/auth";
import MenuItemsTable from "@/components/admin/menuitems.table";
import { sendRequest } from "@/utils/api";


interface IProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const ManageMenuItemsPage = async (props: IProps) => {
    const session = await auth();

    // Lấy danh sách subcategories để hiển thị trong dropdown
    const subcategoriesRes = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subcategory`,
        method: "GET",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ['list-subcategories'] } },
    });

    const subcategories = subcategoriesRes.data && Array.isArray(subcategoriesRes.data)
        ? subcategoriesRes.data
        : subcategoriesRes.data?.result || [];

    // Lấy danh sách menu items
    const menuItemsRes = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
        method: "GET",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ['list-menuitems'] } },
    });

    let menuItems = [];
    let meta = { current: 1, pageSize: 10, total: 0, pages: 1 };

    if (menuItemsRes.data && Array.isArray(menuItemsRes.data)) {
        menuItems = menuItemsRes.data;
    } else if (menuItemsRes.data && 'result' in menuItemsRes.data) {
        menuItems = menuItemsRes.data.result || [];
        meta = menuItemsRes.data.meta || meta;
    }

    return (
        <div>
            <MenuItemsTable menuItems={menuItems} subcategories={subcategories} meta={meta} />
        </div>
    );
};

export default ManageMenuItemsPage;