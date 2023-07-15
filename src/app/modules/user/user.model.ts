import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

// This code is executed before saving a user document to the database
userSchema.pre('save', async function (next) {
  // Hash the password using bcrypt
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Call the next middleware or save the document
  next();
});

export const User = model<IUser>('User', userSchema);
