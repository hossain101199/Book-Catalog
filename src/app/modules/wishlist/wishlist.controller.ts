import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IWishlist } from './wishlist.interface';
import { wishlistService } from './wishlist.service';

const createWishlist: RequestHandler = catchAsync(async (req, res) => {
  const wishlistData = req.body;
  const user = req.verifiedUser as JwtPayload;

  const result = await wishlistService.createWishlistInDB(wishlistData, user);

  sendResponse<IWishlist>(res, {
    statusCode: 200,
    success: true,
    message: `Book added to the wishlist as ${wishlistData.status}`,
    data: result,
  });
});

const getWishlistByBookId: RequestHandler = catchAsync(async (req, res) => {
  const bookId = req.params.id;
  const user = req.verifiedUser as JwtPayload;

  const result = await wishlistService.getWishlistByBookIdFromDB(
    bookId,
    user.id
  );

  sendResponse<IWishlist>(res, {
    statusCode: 200,
    success: true,
    message: `Wishlist retrieved successfully`,
    data: result,
  });
});

const getWishlist: RequestHandler = catchAsync(async (req, res) => {
  const user = req.verifiedUser as JwtPayload;

  const paginationOptions = pick(req.query, paginationFields);

  const result = await wishlistService.getWishlistFromDB(
    user.id,
    paginationOptions
  );

  sendResponse<IWishlist[]>(res, {
    statusCode: 200,
    success: true,
    message: `Wishlist retrieved successfully`,
    meta: result.meta,
    data: result.data,
  });
});

export const wishlistController = {
  createWishlist,
  getWishlistByBookId,
  getWishlist,
};
