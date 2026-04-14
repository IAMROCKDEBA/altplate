import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const PlateChoice = mongoose.model('PlateChoice');
    const FoodParcel = mongoose.model('FoodParcel');
    
    await PlateChoice.collection.createIndex({ submissionDate: -1 });
    await PlateChoice.collection.createIndex({ studentName: 1 });
    
    await FoodParcel.collection.createIndex({ status: 1, submissionDate: -1 });
    await FoodParcel.collection.createIndex({ approvalDate: -1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.log('Note: Indexes will be created after models are registered');
  }
};

export default connectDatabase;
