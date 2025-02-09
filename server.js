import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { marked } from 'marked';

const app = express();
const upload = multer({ dest: 'uploads/' });
const SECRET_KEY = 'your-secret-key';

// In-memory data store (replace with database in production)
let users = [];
let blogPosts = [];

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('User registered');
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).send('User not found');

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  const token = jwt.sign({ username }, SECRET_KEY);
  res.header('Authorization', token).send('Logged in');
});

// Blog endpoints
app.get('/posts', (req, res) => {
  res.json(blogPosts);
});

app.post('/posts', authenticate, upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const markdownContent = marked.parse(content);
  const newPost = {
    id: blogPosts.length + 1,
    title,
    content: markdownContent,
    image: req.file ? `/uploads/${req.file.filename}` : null
  };
  blogPosts.push(newPost);
  res.status(201).json(newPost);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
