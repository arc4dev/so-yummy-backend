interface UserDocument extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  verify: boolean;
  verificationToken?: string | null;
  isCorrectPassword(password: string, hashedPassword: string): Promise<boolean>;
}
