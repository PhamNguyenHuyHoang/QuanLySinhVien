import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayouts';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/List';
import StudentAdd from './pages/Add';
import StudentEdit from './pages/Edit';
import StudentDelete from './pages/Delete';
import StudentDetail from './pages/Detail';
import ChangePassword from './pages/ChangePassword';
import AccountManage from './pages/AccountManage';
import { Navigate } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />


        {/* Protected routes with layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/add" element={<StudentAdd />} />
          <Route path="/students/edit/:id" element={<StudentEdit />} />
          <Route path="/students/delete/:id" element={<StudentDelete />} />
          <Route path="/students/detail/:id" element={<StudentDetail />} />
          <Route path="/students/manage" element={<AccountManage />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Default fallback */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
