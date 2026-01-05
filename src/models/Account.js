import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    accountNumber: {
      type: String,
      unique: true
    },
    type: {
      type: String,
      enum: ['SAVINGS', 'CURRENT'],
      default: 'SAVINGS'
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

accountSchema.pre('save', function () {
  if (this.accountNumber) return;

  const randomPart = Math.floor(100000 + Math.random() * 900000);
  const timePart = Date.now().toString().slice(-6);

  this.accountNumber = `${randomPart}${timePart}`;
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
