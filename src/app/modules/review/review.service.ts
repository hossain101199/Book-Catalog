import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../book/book.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReviewInDB = async (
  payload: IReview,
  user: JwtPayload
): Promise<IReview> => {
  const book = await Book.findById(payload.book);
  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  if (book.createdBy.toString() === user.id) {
    throw new ApiError(
      403,
      'Forbidden: You are not allowed to comment on your own book.'
    );
  }

  payload.user = user.id;

  const createdReview = (await Review.create(payload)).populate([
    { path: 'book', populate: { path: 'createdBy' } },
    { path: 'user' },
  ]);

  return createdReview;
};

const getReviewsByBookIdFromDB = async (
  id: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IReview[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Review.find({ book: id })
    .populate([
      { path: 'book', populate: { path: 'createdBy' } },
      { path: 'user' },
    ])
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({ book: id });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const reviewService = {
  createReviewInDB,
  getReviewsByBookIdFromDB,
};
