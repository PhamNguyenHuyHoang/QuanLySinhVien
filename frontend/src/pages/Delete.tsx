import { useEffect, useState } from 'react';
import { Card, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Student } from '../types/student';

const DeleteStudent = () => {
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

  const handleDelete = () => {
    api.delete(`/students/${id}`)
      .then(() => {
        message.success('Xoá sinh viên thành công');
        navigate('/students');
      })
      .catch(() => message.error('Lỗi khi xoá sinh viên'));
  };

  return (
    <div className="p-4">
      <Card title="Xác nhận xoá sinh viên" className="max-w-xl mx-auto">
        {student ? (
          <>
            <p>Bạn có chắc chắn muốn xoá sinh viên <strong>{student.name}</strong>?</p>
            <div className="flex gap-2 mt-4">
              <Button danger onClick={handleDelete}>Xoá</Button>
              <Button onClick={() => navigate(-1)}>Huỷ</Button>
            </div>
          </>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </Card>
    </div>
  );
};

export default DeleteStudent;
