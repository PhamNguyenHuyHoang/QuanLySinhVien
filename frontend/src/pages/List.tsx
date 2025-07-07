/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Student } from '../types/student';

const { Option } = Select;

const List = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const navigate = useNavigate();

  const fetchStudents = () => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(() => message.error('Lỗi khi tải danh sách sinh viên'));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (id: string) => {
    api.delete(`/students/${id}`)
      .then(() => {
        message.success('Xóa sinh viên thành công');
        fetchStudents();
      })
      .catch(() => message.error('Lỗi khi xóa sinh viên'));
  };

  const filteredStudents = students.filter((student) => {
    const keyword = searchTerm.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(keyword) ||
      student.email.toLowerCase().includes(keyword) ||
      student.id.toLowerCase().includes(keyword);

    const matchesGender = genderFilter === '' || student.gender === genderFilter;
    const matchesAge = ageFilter === '' || student.age.toString() === ageFilter;

    return matchesSearch && matchesGender && matchesAge;
  });

  const ageOptions = Array.from(new Set(students.map(s => s.age))).sort((a, b) => a - b);

  const columns = [
    {
      title: 'Mã SV',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Student) => (
        <Space>
          <Button onClick={() => navigate(`/students/edit/${record.id}`)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xoá?" onConfirm={() => handleDelete(record.id)}>
            <Button>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-xl font-semibold">Danh sách sinh viên</h1>
        <Button type="primary" onClick={() => navigate('/students/add')}>Thêm sinh viên</Button>
      </div>

      <div className="flex gap-4 mb-4 flex-wrap">
        <Input.Search
          placeholder="Tìm kiếm theo tên, email hoặc mã SV"
          allowClear
          enterButton="Tìm"
          size="large"
          className="max-w-md"
          onSearch={(value) => setSearchTerm(value.trim())}
        />

        <Select
          placeholder="Lọc theo giới tính"
          allowClear
          className="w-48"
          size="large"
          onChange={(value) => setGenderFilter(value || '')}
        >
          <Option value="Nam">Nam</Option>
          <Option value="Nữ">Nữ</Option>
        </Select>

        <Select
          placeholder="Lọc theo tuổi"
          allowClear
          className="w-48"
          size="large"
          onChange={(value) => setAgeFilter(value || '')}
        >
          {ageOptions.map((age) => (
            <Option key={age} value={age.toString()}>{age}</Option>
          ))}
        </Select>
      </div>

      <Table dataSource={filteredStudents} columns={columns} rowKey="id" />
    </div>
  );
};

export default List;
