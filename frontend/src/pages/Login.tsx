/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { api } from '../services/api';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const user = localStorage.getItem('user');
  //   if (user) navigate('/dashboard');
  // }, []);

  const onFinish = async (values: any) => {
    try {
      const res = await api.post('/login', values);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (err) {
      message.error('Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Đăng nhập" className="w-full max-w-sm">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
