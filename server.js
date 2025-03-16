const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: '*', // Allow all origins for testing (update to specific domain after hosting)
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect('mongodb+srv://kan0000413:ChatApp2025@cluster0.kpn5l.mongodb.net/chatapp?retryWrites=true&w=majority&appName=Cluster0', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  dbName: 'chatapp'
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Chat App Backend is running!');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('typing', ({ sender, receiver }) => {
    socket.broadcast.emit('typing', { sender, receiver });
  });

  socket.on('messageRead', ({ messageId, sender, receiver }) => {
    io.emit('messageRead', { messageId, sender, receiver });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});