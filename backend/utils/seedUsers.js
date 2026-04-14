import User from '../models/User.js';

const seedUsers = async () => {
  try {
    // Check if users already exist
    const wardenExists = await User.findOne({ username: process.env.WARDEN_USERNAME });
    const staffExists = await User.findOne({ username: process.env.STAFF_USERNAME });

    if (!wardenExists) {
      await User.create({
        username: process.env.WARDEN_USERNAME,
        password: process.env.WARDEN_PASSWORD,
        role: 'warden'
      });
      console.log('✅ Warden user seeded');
    }

    if (!staffExists) {
      await User.create({
        username: process.env.STAFF_USERNAME,
        password: process.env.STAFF_PASSWORD,
        role: 'staff'
      });
      console.log('✅ Staff user seeded');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export default seedUsers;
