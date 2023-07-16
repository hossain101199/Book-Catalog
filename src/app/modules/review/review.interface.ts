import { Types } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../user/user.interface';

export type IReview = {
  book: Types.ObjectId | IBook;
  user: Types.ObjectId | IUser;
  comment: string;
};
