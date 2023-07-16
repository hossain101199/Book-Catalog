import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookFilterableFields } from './book.constant';
import { IBook } from './book.interface';
import { bookService } from './book.service';

const createBook: RequestHandler = catchAsync(async (req, res) => {
  const book = req.body;
  const user = req.verifiedUser as JwtPayload;

  const result = await bookService.createBookInDb(book, user);

  sendResponse<IBook>(res, {
    statusCode: 200,
    success: true,
    message: 'Book created successfully',
    data: result,
  });
});

const getAllBooks: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await bookService.getAllBooksFromDb(
    filters,
    paginationOptions
  );

  sendResponse<IBook[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const bookController = {
  createBook,
  getAllBooks,
};
