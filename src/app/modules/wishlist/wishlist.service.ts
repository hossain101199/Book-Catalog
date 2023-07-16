import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../book/book.model';
import { IWishlist } from './wishlist.interface';
import { Wishlist } from './wishlist.model';

const createWishlistInDB = async (
  payload: IWishlist,
  user: JwtPayload
): Promise<IWishlist> => {
  const book = await Book.findById(payload.book);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  // Check if the book already exists in the user's wishlist
  const existingWishlist = await Wishlist.findOne({
    book: payload.book,
    user: user.id,
  });

  if (existingWishlist) {
    throw new ApiError(
      409,
      `Book already exists in the user wishlist as ${existingWishlist.status}`
    );
  }

  if (book.createdBy.toString() === user.id) {
    throw new ApiError(
      403,
      `Forbidden: You are not allowed to add your own book as ${payload.status}.`
    );
  }

  payload.user = user.id;

  const createdWishlist = (await Wishlist.create(payload)).populate([
    { path: 'book', populate: { path: 'createdBy' } },
    { path: 'user' },
  ]);

  return createdWishlist;
};

const getWishlistByBookIdFromDB = async (
  bookId: string,
  userId: string
): Promise<IWishlist | null> => {
  const result = await Wishlist.findOne({
    book: bookId,
    user: userId,
  }).populate([
    { path: 'book', populate: { path: 'createdBy' } },
    { path: 'user' },
  ]);

  return result;
};

const getWishlistFromDB = async (
  id: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWishlist[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Wishlist.find({ user: id })
    .populate([
      { path: 'book', populate: { path: 'createdBy' } },
      { path: 'user' },
    ])
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Wishlist.countDocuments({ user: id });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const wishlistService = {
  createWishlistInDB,
  getWishlistByBookIdFromDB,
  getWishlistFromDB,
};
