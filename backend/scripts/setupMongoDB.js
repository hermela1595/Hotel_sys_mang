const mongoose = require('mongoose');
require('dotenv').config();

async function setupMongoDatabase() {
  console.log('🚀 Setting up MongoDB database...');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    console.log('💡 You can get a free MongoDB database at: https://cloud.mongodb.com');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB database');

    // Import models to ensure indexes are created
    const { User, Reservation } = require('../models/mongoose-models');

    // Create indexes
    await User.createIndexes();
    await Reservation.createIndexes();
    
    console.log('✅ Database indexes created/verified');

    // Verify collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log('📊 Database collections:', collectionNames);
    
    // Test data insertion (optional)
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      const newUser = new User({
        email: 'test@example.com',
        phone: '+1234567890'
      });
      await newUser.save();
      console.log('✅ Test user created');
    }

    console.log('🎉 MongoDB database setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up MongoDB database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  setupMongoDatabase()
    .then(() => {
      console.log('✅ MongoDB setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ MongoDB setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupMongoDatabase;
