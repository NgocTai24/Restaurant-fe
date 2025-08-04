import { auth } from "@/auth";
import SubcategoriesTable from "@/components/admin/subcategories.table";
import { sendRequest} from "@/utils/api";

// Định nghĩa kiểu Category và Subcategory

interface IProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ManageSubcategoriesPage = async (props: IProps) => {
  const session = await auth();

  // Lấy danh sách categories để hiển thị trong dropdown
  const categoriesRes = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
    method: "GET",
    headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    nextOption: { next: { tags: ['list-categories'] } },
  });

  const categories = categoriesRes.data && Array.isArray(categoriesRes.data)
    ? categoriesRes.data
    : categoriesRes.data?.result || [];

  // Lấy danh sách subcategories
  const subcategoriesRes = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subcategory`,
    method: "GET",
    headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    nextOption: { next: { tags: ['list-subcategories'] } },
  });

  let subcategories: any[] = [];
  let meta = { current: 1, pageSize: 10, total: 0, pages: 1 };

  if (subcategoriesRes.data && Array.isArray(subcategoriesRes.data)) {
    subcategories = subcategoriesRes.data;
  } else if (subcategoriesRes.data && 'result' in subcategoriesRes.data) {
    subcategories = subcategoriesRes.data.result || [];
    meta = subcategoriesRes.data.meta || meta;
  }

  return (
    <div>
      <SubcategoriesTable subcategories={subcategories} categories={categories} meta={meta} />
    </div>
  );
};

export default ManageSubcategoriesPage;