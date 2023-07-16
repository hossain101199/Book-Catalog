import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IReview } from './review.interface';
import { reviewService } from './review.service';

const createReview: RequestHandler = catchAsync(async (req, res) => {
  const review = req.body;
  const user = req.verifiedUser as JwtPayload;

  const result = await reviewService.createReviewInDB(review, user);

  sendResponse<IReview>(res, {
    statusCode: 200,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getReviewsByBookId: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await reviewService.getReviewsByBookIdFromDB(
    id,
    paginationOptions
  );

  sendResponse<IReview[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Review retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const reviewController = {
  createReview,
  getReviewsByBookId,
};
