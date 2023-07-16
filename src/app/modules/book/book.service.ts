import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';

const createBookInDB = async (
  payload: IBook,
  user: JwtPayload
): Promise<IBook> => {
  payload.createdBy = user.id;
  payload.publicationDate = new Date();

  const createdBook = (await Book.create(payload)).populate('createdBy');
  return createdBook;
};

const getSingleBookFromDB = async (payload: string): Promise<IBook | null> => {
  const result = await Book.findOne({ _id: payload }).populate('createdBy');
  return result;
};

const updateBookBookInDB = async (
  id: string,
  payload: IBook
): Promise<IBook | null> => {
  if (payload.createdBy) {
    throw new ApiError(
      403,
      'Forbidden: You are not allowed to update the createdBy field.'
    );
  }

  const result = await Book.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('createdBy');

  return result;
};

const deleteBookFromDB = async (payload: string): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete(payload).populate('createdBy');
  return result;
};

const getAllBooksFromDB = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Book.find(whereConditions)
    .populate('createdBy')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const bookService = {
  createBookInDB,
  getSingleBookFromDB,
  updateBookBookInDB,
  deleteBookFromDB,
  getAllBooksFromDB,
};
