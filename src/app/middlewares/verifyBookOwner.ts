import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { Book } from '../modules/book/book.model';

const verifyBookOwner: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.verifiedUser as JwtPayload;

    const book = await Book.findOne({ _id: id });

    if (!book) {
      throw new ApiError(404, 'Book not found');
    }

    if (user.id.toString() !== book.createdBy.toString()) {
      throw new ApiError(403, 'Forbidden: You are not the owner of the book');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyBookOwner;
