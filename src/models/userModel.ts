import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      maxlength: [32, 'Password must be at most 32 characters long'],
      select: false,
    },
    name: {
      type: String,
      default: 'Guest',
      trim: true,
      minlength: [3, 'Name must be at least 2 characters long'],
      maxlength: [16, 'Name must be at most 32 characters long'],
      required: [true, 'Name is required'],
    },
    image: {
      type: String,
      default: 'default.jpg',
    },
    favouriteRecipes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Recipe',
        },
      ],
      select: false,
      default: [],
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
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: `The 'role' field must be one of the following values: user or admin.`,
      },
      default: 'user',
    },
    passwordResetToken: String,
    passwordResetTokenExpiration: Date,
  },
  { versionKey: false, timestamps: true }
);

// Set a default image path before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('image')) return next();

  console.log('host', process.env.HOST);
  this.image = `${process.env.HOST}/img/users/${this.image}`;

  next();
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

// Method to create a password reset token
userSchema.methods.createPasswordResetToken = function () {
  // 1) Create an original reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2) Encrypt this token to save to the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3) Set a {min} minutes token expiration
  const min = 10;
  this.passwordResetTokenExpiration = Date.now() + min * 60 * 1000;

  // 4) return the original token
  return resetToken;
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
