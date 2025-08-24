const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://root:123@cluster0.jwxt0.mongodb.net/wallokart?retryWrites=true&w=majority';
mongoose.set('strictQuery', true);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URL, { dbName: 'wallokart' });
  console.log('[mongo] conectado');
}

module.exports = { connectDB, mongoose };
