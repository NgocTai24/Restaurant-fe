'use client';
import { handleDeleteSubcategoryAction, handleCreateSubcategoryAction, handleUpdateSubcategoryAction } from "@/utils/categori.actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, Modal, Form, Input, Space, Tooltip, Select, message } from "antd";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { sendRequest } from "@/utils/api";
import { auth } from "@/auth";

interface IProps {
  subcategories: any[];
  categories: any[]; // Thêm danh sách category để chọn trong form
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const SubcategoriesTable = (props: IProps) => {
  const { subcategories, categories, meta } = props;
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
    {
      title: 'Parent Category',
      dataIndex: 'category',
      render: (text: any) => categories.find(cat => cat._id === text)?.name || 'N/A'
    },
    {
      title: 'Actions',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit subcategory">
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
          <Tooltip title="Delete subcategory">
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa subcategory"
              description="Bạn có chắc chắn muốn xóa subcategory này?"
              onConfirm={async () => {
                try {
                  await handleDeleteSubcategoryAction(record._id);
                  message.success('Subcategory deleted successfully');
                } catch (error) {
                  message.error('Failed to delete subcategory');
                }
              }}
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
    try {
      if (dataUpdate) {
        await handleUpdateSubcategoryAction({ ...values, _id: dataUpdate._id });
        message.success('Subcategory updated successfully');
      } else {
        await handleCreateSubcategoryAction(values);
        message.success('Subcategory created successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) { // Ép kiểu error thành any hoặc Error
      message.error(`Failed to ${dataUpdate ? 'update' : 'create'} subcategory: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span>Manage Subcategories</span>
        <Button type="primary" onClick={() => { setIsModalOpen(true); setDataUpdate(null); form.resetFields(); }}>
          Create Subcategory
        </Button>
      </div>
      <Table
        bordered
        dataSource={subcategories}
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
        title={dataUpdate ? "Edit Subcategory" : "Add Subcategory"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Parent Category" rules={[{ required: true, message: 'Please select a category!' }]}>
            <Select placeholder="Select a category">
              {categories.map((cat: any) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SubcategoriesTable;