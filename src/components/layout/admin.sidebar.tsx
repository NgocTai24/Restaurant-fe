'use client';
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
   DashboardOutlined,
   TeamOutlined,
   ShopOutlined,
   FolderOutlined,
   FolderOpenOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

const AdminSideBar = () => {
   const { Sider } = Layout;
   const { collapseMenu } = useContext(AdminContext)!;

   const items: MenuItem[] = [
      {
         key: 'grp',
         label: 'Restaurant',
         type: 'group',
         children: [
            {
               key: "dashboard",
               label: <Link href={"/dashboard"}>Dashboard</Link>,
               icon: <DashboardOutlined />,
            },
            {
               key: "users",
               label: <Link href={"/dashboard/user"}>Manage Users</Link>,
               icon: <TeamOutlined />,
            },
            {
               key: "categories",
               label: <Link href={"/dashboard/categories"}>Manage Categories</Link>,
               icon: <FolderOutlined />,
            },
            {
               key: "subcategories",
               label: <Link href={"/dashboard/subcategories"}>Manage Subcategories</Link>,
               icon: <FolderOpenOutlined />,
            },
            {
               key: "products",
               label: <Link href={"/dashboard/product"}>Manage Menu</Link>,
               icon: <ShopOutlined />,
            },
         ],
      },
   ];

   return (
      <Sider
         collapsed={collapseMenu}
         style={{ background: '#fff', height: '100vh' }} // Thêm background trắng để nổi bật
      >
         <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={items}
            style={{ height: '100%', borderRight: 0 }} // Loại bỏ border phải để liền mạch
         />
      </Sider>
   );
};

export default AdminSideBar;