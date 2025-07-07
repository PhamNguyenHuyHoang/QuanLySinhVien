/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');

  const onFinish = async (values: any) => {
    if (!storedUser || !storedUser.id) {
      message.error('Phiên đăng nhập không hợp lệ');
      return navigate('/login');
    }

    if (values.newPassword !== values.confirmPassword) {
      return message.error('Mật khẩu xác nhận không khớp');
    }

    try {
      const res = await fetch('http://localhost:3001/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: storedUser.id,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        message.success('Đổi mật khẩu thành công!');
        navigate('/dashboard');
      } else {
        message.error(result.message || 'Lỗi đổi mật khẩu');
      }
    } catch (error) {
      message.error('Lỗi kết nối đến máy chủ');
    }
  };

  return (
    <div className="p-4">
      <Card title="Đổi mật khẩu" className="max-w-xl mx-auto">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-2">
          <Button type="default" block onClick={() => navigate(-1)}>
            Huỷ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChangePassword;
