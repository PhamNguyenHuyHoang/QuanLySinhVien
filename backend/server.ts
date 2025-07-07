import express, { Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';


const app: express.Application = express();
const PORT = 3001;

// File paths
const studentFilePath = path.join(__dirname, 'database/students.json');
const accountFilePath = path.join(__dirname, 'database/accounts.json');

// Tạo file nếu chưa có
if (!fs.existsSync(studentFilePath)) fs.writeFileSync(studentFilePath, JSON.stringify([]), 'utf-8');
if (!fs.existsSync(accountFilePath)) fs.writeFileSync(accountFilePath, JSON.stringify([]), 'utf-8');

app.use(cors());
app.use(bodyParser.json());

// ================= UTILITIES =================
const readData = (filePath: string): any[] => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeData = (filePath: string, data: any[]) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// ================= /students =================
// GET all students
app.get('/students', (_: Request, res: Response) => {
  res.json(readData(studentFilePath));
});

// GET student by ID
app.get('/students/:id', (req: Request, res: Response) => {
  const students = readData(studentFilePath);
  const student = students.find(s => s.id === req.params.id);
  student ? res.json(student) : res.status(404).json({ message: 'Không tìm thấy sinh viên' });
});

// POST new student & account
app.post('/students', (req: Request, res: Response) => {
  const students = readData(studentFilePath);
  const accounts = readData(accountFilePath);

  const { name, age, gender, email, phone, address, password = '123456' } = req.body;

  // if (!email || !password) {
  //   return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
  // }

  // const emailExists = accounts.some(acc => acc.email === email);
  // if (emailExists) {
  //   return res.status(400).json({ message: 'Email đã tồn tại' });
  // }

  const maxIdNumber = students
    .map(s => parseInt(s.id?.replace('SV', '')))
    .filter(n => !isNaN(n))
    .reduce((max, curr) => Math.max(max, curr), 0);

  const newId = 'SV' + String(maxIdNumber + 1).padStart(3, '0');

  const newStudent = { id: newId, name, age, gender, email, phone, address };
  const newAccount = { id: newId, email, password };

  students.push(newStudent);
  accounts.push(newAccount);

  writeData(studentFilePath, students);
  writeData(accountFilePath, accounts);

  res.status(201).json({ student: newStudent, account: newAccount });
});

// PUT update student
app.put('/students/:id', (req: Request, res: Response) => {
  const students = readData(studentFilePath);
  const index = students.findIndex(s => s.id === req.params.id);
  // if (index === -1) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

  students[index] = { ...students[index], ...req.body };
  writeData(studentFilePath, students);
  res.json(students[index]);
});

// DELETE student and associated account
app.delete('/students/:id', (req: Request, res: Response) => {
  const studentId = req.params.id;
  const students = readData(studentFilePath).filter(s => s.id !== studentId);
  const accounts = readData(accountFilePath).filter(a => a.id !== studentId);

  writeData(studentFilePath, students);
  writeData(accountFilePath, accounts);

  res.json({ message: 'Đã xoá sinh viên và tài khoản liên quan' });
});

// ================= /accounts =================
app.get('/accounts', (_: Request, res: Response) => {
  res.json(readData(accountFilePath));
});

app.post('/accounts', (req: Request, res: Response) => {
  const accounts = readData(accountFilePath);
  const newAccount = req.body;

  // if (!newAccount.id || !newAccount.email || !newAccount.password) {
  //   return res.status(400).json({ message: 'Thiếu thông tin tài khoản' });
  // }

  // const exists = accounts.find(acc => acc.email === newAccount.email);
  // if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });

  accounts.push(newAccount);
  writeData(accountFilePath, accounts);
  res.status(201).json(newAccount);
});

// POST /change-password
app.post('/change-password', (req: Request, res: Response) => {
  const { id, oldPassword, newPassword } = req.body;
  // if (!id || !oldPassword || !newPassword) {
  //   return res.status(400).json({ message: 'Thiếu thông tin' });
  // }

  const accounts = readData(accountFilePath);
  const index = accounts.findIndex(acc => acc.id === id);

  // if (index === -1) {
  //   return res.status(404).json({ message: 'Tài khoản không tồn tại' });
  // }

  // if (accounts[index].password !== oldPassword) {
  //   return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
  // }

  accounts[index].password = newPassword;
  writeData(accountFilePath, accounts);

  res.json({ message: 'Đổi mật khẩu thành công' });
});



app.put('/accounts/:id', (req: Request, res: Response) => {
  const accounts = readData(accountFilePath);
  const index = accounts.findIndex(acc => acc.id === req.params.id);

  // if (index === -1) {
  //   return res.status(404).json({ message: 'Không tìm thấy tài khoản để cập nhật' });
  // }

  // Cập nhật password hoặc các trường khác nếu cần
  accounts[index] = { ...accounts[index], ...req.body };

  writeData(accountFilePath, accounts);
  res.json(accounts[index]);
});


app.delete('/accounts/:id', (req: Request, res: Response) => {
  const accounts = readData(accountFilePath).filter(acc => acc.id !== req.params.id);
  writeData(accountFilePath, accounts);
  res.json({ message: 'Đã xoá tài khoản' });
});

// ================= /login =================
app.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const accounts = readData(accountFilePath);

  const user = accounts.find(acc => acc.email === email && acc.password === password);
  if (user) {
    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } else {
    res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
});

// ================= Server Start =================
app.listen(PORT, () => { console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);});
