/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, message } from 'antd';
import { api } from '../services/api';
import type { Account } from '../types/accounts';

const AccountManage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [form] = Form.useForm();

  const fetchAccounts = () => {
    api.get('/accounts')
      .then(res => setAccounts(res.data))
      .catch(() => message.error('Không thể tải danh sách tài khoản'));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const showModal = (account?: Account) => {
    setEditingAccount(account || null);
    if (account) form.setFieldsValue(account);
    else form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingAccount) {
        // Cập nhật tài khoản
        api.put(`/accounts/${editingAccount.id}`, values)
          .then(() => {
            message.success('Cập nhật tài khoản thành công');
            fetchAccounts();
            setIsModalOpen(false);
          });
      } else {
        // Thêm mới tài khoản
        api.post('/accounts', values)
          .then(() => {
            message.success('Thêm tài khoản thành công');
            fetchAccounts();
            setIsModalOpen(false);
          });
      }
    });
  };

  const handleDelete = (id: string) => {
    api.delete(`/accounts/${id}`)
      .then(() => {
        message.success('Xoá tài khoản thành công');
        fetchAccounts();
      })
      .catch(() => message.error('Lỗi khi xoá tài khoản'));
  };

  const columns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mật khẩu',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Account) => (
        <Space>
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Quản lý tài khoản sinh viên</h2>
        <Button type="primary" onClick={() => showModal()}>Thêm tài khoản</Button>
      </div>
      <Table dataSource={accounts} columns={columns} rowKey="id" />

      <Modal
        title={editingAccount ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="Mã sinh viên" rules={[{ required: true }]}>
            <Input disabled={!!editingAccount} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManage;
