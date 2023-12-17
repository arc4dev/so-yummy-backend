// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

import app from './app.js';
import mongoose from 'mongoose';

// Database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xbudkcm.mongodb.net/so-yummy`
  )
  .then(() => console.log('Database connection successful!'))
  .catch(() => process.exit(1));

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
