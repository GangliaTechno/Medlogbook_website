const mongoose = require('mongoose');
const argon2 = require('argon2');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = require('./models/User');

async function resetPassword() {
    try {
        const email = 'eniyan2001@gmail.com';
        const newPassword = 'password';

        console.log(`🔍 Looking for user: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            process.exit(1);
        }

        console.log(`✅ User found: ${email}`);
        console.log(`🔐 Hashing new password...`);

        const hashedPassword = await argon2.hash(newPassword);

        console.log(`💾 Updating password in database...`);

        user.password = hashedPassword;
        await user.save();

        console.log(`✅ Password successfully reset for ${email}`);
        console.log(`🔑 New password: ${newPassword}`);
        console.log(`\n✅ User can now login with:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${newPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting password:', error);
        process.exit(1);
    }
}

resetPassword();
