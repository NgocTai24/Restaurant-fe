'use client';
import { Layout } from 'antd';

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <Footer
      style={{
        textAlign: 'center',
        background: 'linear-gradient(90deg, #4a90e2, #50e3c2)', // Gradient background
        color: '#fff',
        padding: '16px 0',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)', // Shadow for depth
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        position: 'sticky',
        bottom: 0,
      }}
    >
      © {new Date().getFullYear()} Ngọc Tài | Created by @ngoctai
    </Footer>
  );
};

export default AdminFooter;