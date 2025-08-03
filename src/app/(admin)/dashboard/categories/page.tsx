import { auth } from "@/auth";
import CategoriesTable from "@/components/admin/categories.table";
import { sendRequest } from "@/utils/api";



interface IProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const ManageCategoriesPage = async (props: IProps) => {
    const session = await auth();

    // Vì backend không hỗ trợ phân trang, bỏ queryParams
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        method: "GET",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ['list-categories'] } },
    });

    // Xử lý dữ liệu linh hoạt
    let categories = [];
    let meta = { current: 1, pageSize: 10, total: 0, pages: 1 };

    if (res.data && Array.isArray(res.data)) {
        // Nếu backend trả về mảng trực tiếp
        categories = res.data;
    } else if (res.data && 'result' in res.data) {
        // Nếu backend trả về IModelPaginate
        categories = res.data.result || [];
        meta = res.data.meta || meta;
    }

    return (
        <div>
            <CategoriesTable categories={categories} meta={meta} />
        </div>
    );
};

export default ManageCategoriesPage;