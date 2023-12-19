// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

import app from './app.js';
import connectDB from './utils/connectDB.js';

// Database connection
await connectDB();

// Server launching
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Handling promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
