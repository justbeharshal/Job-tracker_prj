require('dotenv').config();

const app             = require('./app');
const { connectDB }   = require('./src/config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();           // verify DB reachable before accepting traffic
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   ENV:    ${process.env.NODE_ENV || 'development'}`);
  });
}

start();
