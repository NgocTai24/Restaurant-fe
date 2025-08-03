'use client';
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
   AppstoreOutlined,
   GiftOutlined,
   MailOutlined,
   SettingOutlined,
   TeamOutlined,
   UnorderedListOutlined, // Icon cho Manage Categories
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
               icon: <AppstoreOutlined />,
            },
            {
               key: "users",
               label: <Link href={"/dashboard/user"}>Manage Users</Link>,
               icon: <TeamOutlined />,
            },
            {
               key: "products",
               label: <Link href={"/dashboard/product"}>Manage Menu</Link>,
               icon: <GiftOutlined />,
            },
            {
               key: "categories",
               label: <Link href={"/dashboard/categories"}>Manage Categories</Link>,
               icon: <UnorderedListOutlined />,
            },
            {
               key: "subcategories",
               label: <Link href={"/dashboard/subcategories"}>Manage Subcategories</Link>,
               icon: <UnorderedListOutlined />,
            },
            {
               key: 'sub1',
               label: 'Navigation One',
               icon: <MailOutlined />,
               children: [
                  {
                     key: 'g1',
                     label: 'Item 1',
                     type: 'group',
                     children: [
                        { key: '1', label: 'Option 1' },
                        { key: '2', label: 'Option 2' },
                     ],
                  },
                  {
                     key: 'g2',
                     label: 'Item 2',
                     type: 'group',
                     children: [
                        { key: '3', label: 'Option 3' },
                        { key: '4', label: 'Option 4' },
                     ],
                  },
               ],
            },
         ],
      },
   ];

   return (
      <Sider
         collapsed={collapseMenu}
      >
         <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={items}
            style={{ height: '100vh' }}
         />
      </Sider>
   );
};

export default AdminSideBar;