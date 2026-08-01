import bcrypt from 'bcryptjs';
import User from '../models/User';

export const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@artcorner.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUsername = process.env.ADMIN_USERNAME || 'Admin';

    // Check if an admin user (by email or isAdmin: true) already exists in MongoDB
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { isAdmin: true }],
    });

    if (existingAdmin) {
      console.log('Admin user already exists in database.');
      return;
    }

    // Hash ADMIN_PASSWORD using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create Admin user in MongoDB with isAdmin: true, isVerified: true, status: 'active'
    const adminUser = new User({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      isVerified: true,
      status: 'active',
    });

    await adminUser.save();
    console.log(`Admin user successfully seeded (${adminEmail})`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
};

export default seedAdmin;
