import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3001;

// Đường dẫn tới file JSON
const studentFilePath = path.join(__dirname, 'database/students.json');
const accountFilePath = path.join(__dirname, 'database/accounts.json');

// Tạo file nếu chưa tồn tại
if (!fs.existsSync(studentFilePath)) fs.writeFileSync(studentFilePath, JSON.stringify([]), 'utf-8');
if (!fs.existsSync(accountFilePath)) fs.writeFileSync(accountFilePath, JSON.stringify([]), 'utf-8');

app.use(cors());
app.use(bodyParser.json());

// ================= UTILITIES =================
const readData = (filePath: string): any[] => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeData = (filePath: string, data: any[]) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// ================= /students =================
// Lấy toàn bộ sinh viên
app.get('/students', (_: Request, res: Response) => {
  res.json(readData(studentFilePath));
});

// Lấy sinh viên theo ID
app.get('/students/:id', (req: Request, res: Response) => {
  const students = readData(studentFilePath);
  const student = students.find(s => s.id === req.params.id);
  student ? res.json(student) : res.status(404).json({ message: 'Không tìm thấy sinh viên' });
});

// Tạo sinh viên và tài khoản
app.post('/students', async (req: Request, res: Response) => {
  const students = readData(studentFilePath);
  const accounts = readData(accountFilePath);

  const { name, age, gender, email, phone, address, password = '123456' } = req.body;

  // Tạo ID tự động
  const maxId = students
    .map(s => parseInt(s.id?.replace('SV', '')))
    .filter(n => !isNaN(n))
    .reduce((max, curr) => Math.max(max, curr), 0);

  const newId = 'SV' + String(maxId + 1).padStart(3, '0');

  // Mã hóa mật khẩu
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newStudent = { id: newId, name, age, gender, email, phone, address };
  const newAccount = { id: newId, email, password: hashedPassword };

  students.push(newStudent);
  accounts.push(newAccount);

  writeData(studentFilePath, students);
  writeData(accountFilePath, accounts);

  res.status(201).json({ student: newStudent, account: newAccount });
});

// Cập nhật sinh viên
app.put('/students/:id', (req: Request, res: Response) => {
  const students = readData(studentFilePath);
  const index = students.findIndex(s => s.id === req.params.id);
  // if (index === -1) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

  students[index] = { ...students[index], ...req.body };
  writeData(studentFilePath, students);
  res.json(students[index]);
});

// Xoá sinh viên và tài khoản
app.delete('/students/:id', (req: Request, res: Response) => {
  const studentId = req.params.id;
  const students = readData(studentFilePath).filter(s => s.id !== studentId);
  const accounts = readData(accountFilePath).filter(a => a.id !== studentId);

  writeData(studentFilePath, students);
  writeData(accountFilePath, accounts);

  res.json({ message: 'Đã xoá sinh viên và tài khoản liên quan' });
});

// ================= /accounts =================
// Lấy toàn bộ tài khoản
app.get('/accounts', (_: Request, res: Response) => {
  res.json(readData(accountFilePath));
});

// Tạo tài khoản (không dùng trong /students nữa nếu cần riêng)
app.post('/accounts', async (req: Request, res: Response) => {
  const accounts = readData(accountFilePath);
  const { id, email, password } = req.body;

  const exists = accounts.find(acc => acc.email === email);
  // if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAccount = { id, email, password: hashedPassword };

  accounts.push(newAccount);
  writeData(accountFilePath, accounts);

  res.status(201).json({ message: 'Tạo tài khoản thành công' });
});

// Cập nhật tài khoản (có mã hóa nếu có password)
app.put('/accounts/:id', async (req: Request, res: Response) => {
  const accounts = readData(accountFilePath);
  const index = accounts.findIndex(acc => acc.id === req.params.id);
  // if (index === -1) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

  const updatedAccount = { ...accounts[index], ...req.body };

  if (req.body.password) {
    updatedAccount.password = await bcrypt.hash(req.body.password, 10);
  }

  accounts[index] = updatedAccount;
  writeData(accountFilePath, accounts);

  res.json(updatedAccount);
});

// Xoá tài khoản
app.delete('/accounts/:id', (req: Request, res: Response) => {
  const accounts = readData(accountFilePath).filter(acc => acc.id !== req.params.id);
  writeData(accountFilePath, accounts);
  res.json({ message: 'Đã xoá tài khoản' });
});

// ================= /login =================
// Đăng nhập
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const accounts = readData(accountFilePath);

  const user = accounts.find(acc => acc.email === email);
  // if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

  const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

  res.json({
    message: 'Đăng nhập thành công',
    user: { id: user.id, email: user.email }
  });
});

// ================= /change-password =================
// Đổi mật khẩu với xác thực mật khẩu cũ
app.post('/change-password', async (req: Request, res: Response) => {
  const { id, oldPassword, newPassword } = req.body;

  // if (!id || !oldPassword || !newPassword) {
  //   return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
  // }

  const accounts = readData(accountFilePath);
  const index = accounts.findIndex(acc => acc.id === id);

  // if (index === -1) {
  //   return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  // }

  const currentUser = accounts[index];
  const isMatch = await bcrypt.compare(oldPassword, currentUser.password);

  // if (!isMatch) {
  //   return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
  // }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  currentUser.password = hashedNewPassword;

  accounts[index] = currentUser;
  writeData(accountFilePath, accounts);

  res.json({ message: 'Đổi mật khẩu thành công' });
});


// ================= Khởi động server =================
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
