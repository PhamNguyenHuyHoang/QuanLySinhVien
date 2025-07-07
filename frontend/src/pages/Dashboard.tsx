import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Student } from '../types/student';

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trang Quản lý</h1>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số sinh viên"
              value={students.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Card hoverable onClick={() => navigate('/students')} className="cursor-pointer text-center">
            <UnorderedListOutlined className="text-2xl mb-2" />
            <p>Danh sách sinh viên</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => navigate('/students/add')} className="cursor-pointer text-center">
            <PlusCircleOutlined className="text-2xl mb-2" />
            <p>Thêm sinh viên mới</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => navigate('/students/manage')} className="cursor-pointer text-center">
            <UserOutlined className="text-2xl mb-2" />
            <p>Quản lý sinh viên</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
