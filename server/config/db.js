// config/db.js
// MongoDB connection using Mongoose

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the MONGODB_URI from environment variables.
 * Logs success or error to the console.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB connection error: ${error.message}`);
    console.log('\n💡 Tip: MongoDB Community Server is not running on 127.0.0.1:27017.');
    console.log('   1. If MongoDB is installed as a Windows Service, start it:');
    console.log('      net start MongoDB');
    console.log('   2. If not installed yet, download MongoDB Community Server from:');
    console.log('      https://www.mongodb.com/try/download/community');
    console.log('   3. Keep the default port 27017 and open MongoDB Compass to connect!\n');
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
