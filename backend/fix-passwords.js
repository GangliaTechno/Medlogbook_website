const mongoose = require('mongoose');
const argon2 = require('argon2');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = require('./models/User');

async function fixPlainTextPasswords() {
    try {
        console.log('🔍 Checking for users with plain text passwords...');

        const users = await User.find({});
        let fixedCount = 0;

        for (const user of users) {
            // Skip admin account
            if (user.email === 'admin@logbook.com') {
                console.log(`⏭️  Skipping admin account`);
                continue;
            }

            try {
                // Try to verify the password - if it fails, it's likely plain text
                await argon2.verify(user.password, 'test');
                console.log(`✅ ${user.email} - Password is properly hashed`);
            } catch (error) {
                if (error.message.includes('pchstr must contain a $')) {
                    console.log(`⚠️  ${user.email} - Found plain text password, fixing...`);

                    // The password is plain text, we need to hash it
                    // NOTE: We can't recover the original password, so we'll set a default one
                    const defaultPassword = 'TempPassword123!';
                    const hashedPassword = await argon2.hash(defaultPassword);

                    user.password = hashedPassword;
                    await user.save();

                    console.log(`✅ ${user.email} - Password reset to: ${defaultPassword}`);
                    console.log(`   User should use "Forgot Password" to set a new password`);
                    fixedCount++;
                } else {
                    console.log(`✅ ${user.email} - Password is properly hashed`);
                }
            }
        }

        console.log(`\n✅ Migration complete! Fixed ${fixedCount} user(s)`);
        console.log('Users with reset passwords should use the "Forgot Password" feature to set a new password.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

fixPlainTextPasswords();
