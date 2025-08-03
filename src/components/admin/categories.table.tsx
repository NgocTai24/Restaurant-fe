'use client';
import { handleDeleteCategoryAction, handleCreateCategoryAction, handleUpdateCategoryAction } from "@/utils/categori.actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, Modal, Form, Input, Space, Tooltip } from "antd"; // Thêm Space và Tooltip
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";

interface IProps {
  categories: any[];
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const CategoriesTable = (props: IProps) => {
  const { categories, meta } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: "STT", render: (_: any, __: any, index: number) => <>{(index + 1) + (meta.current - 1) * meta.pageSize}</> },
    { title: 'ID', dataIndex: '_id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Image', dataIndex: 'image', render: (text: any) => text || 'N/A' },
    {
      title: 'Actions',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit category">
            <Button
              icon={<EditTwoTone twoToneColor="#f57800" />}
              onClick={() => {
                setIsModalOpen(true);
                setDataUpdate(record);
                form.setFieldsValue(record);
              }}
              style={{ padding: '0 8px' }}
            />
          </Tooltip>
          <Tooltip title="Delete category">
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa category"
              description="Bạn có chắc chắn muốn xóa category này?"
              onConfirm={async () => await handleDeleteCategoryAction(record._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button
                icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
                danger
                style={{ padding: '0 8px' }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onChange = (pagination: any) => {
    if (pagination && pagination.current) {
      const params = new URLSearchParams(searchParams);
      params.set('current', pagination.current);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    if (dataUpdate) {
      await handleUpdateCategoryAction({ ...values, _id: dataUpdate._id });
    } else {
      await handleCreateCategoryAction(values);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span>Manage Categories</span>
        <Button type="primary" onClick={() => { setIsModalOpen(true); setDataUpdate(null); form.resetFields(); }}>
          Create Category
        </Button>
      </div>
      <Table
        bordered
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => <div>{range[0]}-{range[1]} trên {total} rows</div>,
        }}
        onChange={onChange}
      />
      <Modal
        title={dataUpdate ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true, message: 'Please input the image URL!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoriesTable;