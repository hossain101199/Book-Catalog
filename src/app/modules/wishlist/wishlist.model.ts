import { Schema, model } from 'mongoose';
import { IWishlist, WishlistStatus } from './wishlist.interface';

const wishlistSchema = new Schema<IWishlist>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(WishlistStatus),
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Wishlist = model<IWishlist>('Wishlist', wishlistSchema);
