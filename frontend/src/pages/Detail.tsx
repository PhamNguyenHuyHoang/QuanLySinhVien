// 📄 src/pages/Students/Detail.tsx
import { useEffect, useState } from 'react';
import { Card, Descriptions, message, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Student } from '../types/student';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/students/${id}`)
        .then(res => setStudent(res.data))
        .catch(() => message.error('Không tìm thấy sinh viên'));
    }
  }, [id]);

  return (
    <div className="p-4">
      <Card title="Thông tin chi tiết sinh viên" className="max-w-3xl mx-auto">
        {student ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã sinh viên">{student.id}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">{student.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
            <Descriptions.Item label="Tuổi">{student.age}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{student.gender}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{student.phone}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{student.address}</Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
        <div className="mt-4">
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </Card>
    </div>
  );
};

export default StudentDetail;
