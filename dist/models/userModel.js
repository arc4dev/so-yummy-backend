import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
    },
    name: {
        type: String,
        default: null,
        required: [true, 'Name is require'],
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
});
// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
// Exclude fields before find
userSchema.pre(/^find/, function (next) {
    this.select('-password -verify -verificationToken');
    next();
});
// Method to check if password is correct
userSchema.methods.isCorrectPassword = async function (passwordToCheck, userPassword) {
    return await bcrypt.compare(passwordToCheck, userPassword);
};
const User = mongoose.model('User', userSchema);
export default User;
