import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
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

export const reviewController = {
  createReview,
};
