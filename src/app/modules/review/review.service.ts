import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
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

export const reviewService = {
  createReviewInDB,
};
