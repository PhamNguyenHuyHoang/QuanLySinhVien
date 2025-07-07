/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { useTranslation } from 'react-i18next'
import { t } from 'i18next';
import i18n from '../i18n';

const MyComponent = () => {
  // const { t, i18n } = 
  useTranslation();
}
const { Header, Content } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk() {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
      },
      onCancel() {
        console.log('Huỷ đăng xuất');
      },
    });
  };

  if (!isLoggedIn && location.pathname !== '/login') {
    return null;
  }

  const menuItems = [
    {
      key: '/dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/students',
      label: <Link to="/students">Danh sách sinh viên</Link>,
    },
    {
      key: '/students/manage',
      label: <Link to="/students/manage">Quản lý sinh viên</Link>,
    },
    {
      key: '/change-password',
      label: <Link to="/change-password">Đổi mật khẩu</Link>,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout} className="text-red-500">Đăng xuất</span>,
      danger: true,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
          <div className="font-bold text-xl">
            <Link to="/dashboard">🎓 Student Manager</Link>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="flex-1 ml-10"
            items={menuItems}
          />
        </div>
        
      </Header>

      <Content className="bg-gray-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
