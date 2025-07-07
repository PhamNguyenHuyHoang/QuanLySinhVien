/* eslint-disable @typescript-eslint/no-unused-vars */
import {useEffect, useState} from 'react';
import {Form, Input, Card, message, Select} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import {api} from '../services/api';
import type {Student} from '../types/student';

const EditStudent = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const handleback = () => {
        navigate('/students')
    }

    useEffect(() => {
        if (id) {
            setLoading(true);
             api.get(`/students/${id}`)
                .then(res => {
                    form.setFieldsValue(res.data);
                })
                .catch (() => {})
        }
    }, [id]);

    const onFinish = (values: Student) => {
        setLoading (true);
        api.put(`/students/${id}`, values)
            .then(() => {
                message.success('Cập nhật sinh viên thành công!');
                navigate('/students');
            })
            .catch(() => {
                message.error('Lỗi khi cập nhật sinh viên');
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card title="Chỉnh sửa sinh viên" className="w-full max-w-md">
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={form.getFieldsValue()}>
                    <Form.Item
                        label="Họ tên"
                        name="name"
                        rules={[{required: true, message: 'Vui lòng nhập họ tên!'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tuổi"
                        name="age"
                        rules={[{required: true, message: 'Vui lòng nhập tuổi!'}]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{required: true, message: 'Vui lòng chọn giới tính!'}]}
                    >
                        <Select>
                            <Select.Option value="Nam">Nam</Select.Option>
                            <Select.Option value="Nữ">Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{required: true, message: 'Vui lòng nhập email!'}]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{required: true, message: 'Vui lòng nhập số điện thoại!'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{required: true, message: 'Vui lòng nhập địa chỉ!'}]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded">
                            Thêm sinh viên
                            </button>
                            <button onClick={handleback} type="button" className="flex-1 bg-gray-500 text-white py-2 rounded">
                            Quay lại
                            </button>
                        </div>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
};

export default EditStudent;
