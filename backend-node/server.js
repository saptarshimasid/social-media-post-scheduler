const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const DJANGO_URL = process.env.DJANGO_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

const TASKS_FILE = path.join(__dirname, 'tasks.json');
const POSTS_FILE = path.join(__dirname, 'posts.json');

// Helper function to read JSON files safely
const readData = (filePath, defaultData = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultData;
  }
};

// Helper function to write JSON files safely
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// --- TASKS API ---

app.get('/api/tasks', (req, res) => {
  const tasks = readData(TASKS_FILE, []);
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const tasks = readData(TASKS_FILE);
  const { text, priority, due } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    priority: priority || 'Routine',
    due: due || ''
  };

  tasks.push(newTask);
  writeData(TASKS_FILE, tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readData(TASKS_FILE);
  const taskId = parseInt(req.params.id);
  const { completed, text, priority, due } = req.body;

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (completed !== undefined) tasks[taskIndex].completed = completed;
  if (text !== undefined) tasks[taskIndex].text = text;
  if (priority !== undefined) tasks[taskIndex].priority = priority;
  if (due !== undefined) tasks[taskIndex].due = due;

  writeData(TASKS_FILE, tasks);
  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readData(TASKS_FILE);
  const taskId = parseInt(req.params.id);

  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  writeData(TASKS_FILE, tasks);
  res.json({ message: 'Task deleted successfully' });
});

// --- POSTS API ---

app.get('/api/posts', (req, res) => {
  const posts = readData(POSTS_FILE, []);
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const posts = readData(POSTS_FILE);
  const { date, draft, instagram, linkedin, tags, platforms, image, scheduledTime } = req.body;

  if (!draft) {
    return res.status(400).json({ error: 'Post text/draft is required' });
  }

  const newPost = {
    id: Date.now(),
    date: date || new Date().toISOString().split('T')[0],
    draft,
    instagram: instagram || draft,
    linkedin: linkedin || draft,
    tags: tags || [],
    platforms: platforms || ['Instagram'],
    scheduledTime: scheduledTime || 'Scheduled',
    image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeubOjIhhIx5YdlKgojMSomPYRiPH0Kh3UJb1Sjg-_NDcrvUlbRT1g0ZoBG8MMoCT3LmABNfnmmxgqjUay8MrWFYXjwZzoCCT4qq7j5qvOA6SIZ1MlmEQy54TXjeSRdqgQRPy8Xvc7cAsZeT9y7PFbo81IcRZCDQoDjtclIEokbCeX8OEy3p3w5xkw3KPJmfU54h4YQyMNXfoDFWzaTBRET5SswuDQ572W9ardM240TEyVfHqUt33phnFUUCP727gLOiuzg243PjMn'
  };

  posts.push(newPost);
  writeData(POSTS_FILE, posts);
  res.status(201).json(newPost);
});

// --- AI POST GENERATION PROXY ---

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(`${DJANGO_URL}/ai/generate-post/`, { prompt });
    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding generate post request to Django:', error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: 'Failed to generate post from AI agent' }
    );
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
