import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  } catch (err) {
    throw new Error('Error hashing password');
  }
});

const User = mongoose.model('User', userSchema);

export default User;
