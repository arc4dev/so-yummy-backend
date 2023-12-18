import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Query } from 'mongoose';

const userSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required'],
    select: false,
  },
  name: {
    type: String,
    default: null,
    required: [true, 'Name is require'],
  },
  verify: {
    type: Boolean,
    default: false,
    select: false,
  },
  verificationToken: {
    type: String,
    select: false,
  },
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Method to check if password is correct
userSchema.methods.isCorrectPassword = async function (
  passwordToCheck: string,
  userPassword: string
) {
  return await bcrypt.compare(passwordToCheck, userPassword);
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
