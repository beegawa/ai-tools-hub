const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const TOOLS_FILE = path.join(DATA_DIR, 'tools.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files
const initializeDataFiles = () => {
    if (!fs.existsSync(TOOLS_FILE)) {
        fs.writeFileSync(TOOLS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(REVIEWS_FILE)) {
        fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(NEWS_FILE)) {
        fs.writeFileSync(NEWS_FILE, JSON.stringify([], null, 2));
    }
};

// Helper functions
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Routes

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const users = readJsonFile(USERS_FILE);

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            role: users.length === 0 ? 'admin' : 'user', // First user is admin
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeJsonFile(USERS_FILE, users);

        // Generate token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = readJsonFile(USERS_FILE);

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Tools Routes
app.get('/api/tools', (req, res) => {
    try {
        const tools = readJsonFile(TOOLS_FILE);
        const { category, search } = req.query;

        let filteredTools = tools;

        if (category && category !== 'all') {
            filteredTools = filteredTools.filter(tool => 
                tool.category.toLowerCase() === category.toLowerCase()
            );
        }

        if (search) {
            filteredTools = filteredTools.filter(tool =>
                tool.name.toLowerCase().includes(search.toLowerCase()) ||
                tool.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        res.json(filteredTools);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/tools', authenticateToken, requireAdmin, (req, res) => {
    try {
        const tools = readJsonFile(TOOLS_FILE);
        const newTool = {
            id: Date.now().toString(),
            ...req.body,
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString()
        };

        tools.push(newTool);
        writeJsonFile(TOOLS_FILE, tools);

        res.json(newTool);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/tools/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const tools = readJsonFile(TOOLS_FILE);
        const toolIndex = tools.findIndex(t => t.id === req.params.id);

        if (toolIndex === -1) {
            return res.status(404).json({ error: 'Tool not found' });
        }

        tools[toolIndex] = { ...tools[toolIndex], ...req.body };
        writeJsonFile(TOOLS_FILE, tools);

        res.json(tools[toolIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/tools/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const tools = readJsonFile(TOOLS_FILE);
        const filteredTools = tools.filter(t => t.id !== req.params.id);

        if (tools.length === filteredTools.length) {
            return res.status(404).json({ error: 'Tool not found' });
        }

        writeJsonFile(TOOLS_FILE, filteredTools);
        res.json({ message: 'Tool deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Reviews Routes
app.get('/api/reviews/:toolId', (req, res) => {
    try {
        const reviews = readJsonFile(REVIEWS_FILE);
        const toolReviews = reviews.filter(r => r.toolId === req.params.toolId);
        res.json(toolReviews);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/reviews', authenticateToken, (req, res) => {
    try {
        const reviews = readJsonFile(REVIEWS_FILE);
        const tools = readJsonFile(TOOLS_FILE);

        const newReview = {
            id: Date.now().toString(),
            userId: req.user.id,
            userName: req.user.name,
            ...req.body,
            createdAt: new Date().toISOString()
        };

        reviews.push(newReview);
        writeJsonFile(REVIEWS_FILE, reviews);

        // Update tool rating
        const toolReviews = reviews.filter(r => r.toolId === req.body.toolId);
        const avgRating = toolReviews.reduce((sum, r) => sum + r.rating, 0) / toolReviews.length;

        const toolIndex = tools.findIndex(t => t.id === req.body.toolId);
        if (toolIndex !== -1) {
            tools[toolIndex].rating = Math.round(avgRating * 10) / 10;
            tools[toolIndex].reviewCount = toolReviews.length;
            writeJsonFile(TOOLS_FILE, tools);
        }

        res.json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// News Routes
app.get('/api/news', (req, res) => {
    try {
        const news = readJsonFile(NEWS_FILE);
        res.json(news.slice(0, 10)); // Return latest 10 news items
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Auto-update news every hour
cron.schedule('0 * * * *', async () => {
    try {
        // Simulate fetching AI news (replace with real API)
        const mockNews = [
            {
                id: Date.now().toString(),
                title: "Latest AI Breakthrough in Machine Learning",
                content: "Researchers have made significant progress in developing more efficient AI models...",
                date: new Date().toISOString(),
                link: "https://example.com/news1"
            }
        ];

        const existingNews = readJsonFile(NEWS_FILE);
        const updatedNews = [...mockNews, ...existingNews].slice(0, 50); // Keep latest 50
        writeJsonFile(NEWS_FILE, updatedNews);

        console.log('News updated successfully');
    } catch (error) {
        console.error('Error updating news:', error);
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize and start server
initializeDataFiles();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
