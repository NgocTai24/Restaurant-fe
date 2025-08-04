'use client';
import { handleDeleteMenuItemAction, handleCreateMenuItemAction, handleUpdateMenuItemAction } from "@/utils/menuitem.actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, Modal, Form, Input, Space, Tooltip, Select, message, InputNumber } from "antd";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";

interface IProps {
  menuItems: any[];
  subcategories: any[]; // Thêm danh sách subcategory để chọn trong form
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const MenuItemsTable = (props: IProps) => {
  const { menuItems, subcategories, meta } = props;
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
      title: 'Subcategory',
      dataIndex: 'subcategory',
      render: (text: any) => subcategories.find(sub => sub._id === text)?.name || 'N/A'
    },
    { title: 'Price', dataIndex: 'price', render: (text: any) => `$${text}` },
    { title: 'Image', dataIndex: 'image', render: (text: any) => text || 'N/A' },
    {
      title: 'Actions',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit menu item">
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
          <Tooltip title="Delete menu item">
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa menu item"
              description="Bạn có chắc chắn muốn xóa menu item này?"
              onConfirm={async () => {
                try {
                  await handleDeleteMenuItemAction(record._id);
                  message.success('Menu item deleted successfully');
                } catch (error) {
                  message.error('Failed to delete menu item');
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
        await handleUpdateMenuItemAction({ ...values, _id: dataUpdate._id });
        message.success('Menu item updated successfully');
      } else {
        await handleCreateMenuItemAction(values);
        message.success('Menu item created successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(`Failed to ${dataUpdate ? 'update' : 'create'} menu item: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span>Manage Menu Items</span>
        <Button type="primary" onClick={() => { setIsModalOpen(true); setDataUpdate(null); form.resetFields(); }}>
          Create Menu Item
        </Button>
      </div>
      <Table
        bordered
        dataSource={menuItems}
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
        title={dataUpdate ? "Edit Menu Item" : "Add Menu Item"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subcategory" label="Subcategory" rules={[{ required: true, message: 'Please select a subcategory!' }]}>
            <Select placeholder="Select a subcategory">
              {subcategories.map((sub: any) => (
                <Select.Option key={sub._id} value={sub._id}>
                  {sub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true, message: 'Please input the image URL!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MenuItemsTable;