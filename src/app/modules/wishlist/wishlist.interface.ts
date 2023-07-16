import { Types } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../user/user.interface';

export enum WishlistStatus {
  wishlist = 'wishlist',
  reading = 'reading',
  finished = 'finished',
}

export type IWishlist = {
  book: Types.ObjectId | IBook;
  user: Types.ObjectId | IUser;
  status: WishlistStatus;
};
