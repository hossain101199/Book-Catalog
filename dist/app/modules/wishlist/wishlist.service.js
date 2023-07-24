"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const book_model_1 = require("../book/book.model");
const wishlist_model_1 = require("./wishlist.model");
const createWishlistInDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(payload.book);
    if (!book) {
        throw new ApiError_1.default(404, 'Book not found');
    }
    // Check if the book already exists in the user's wishlist
    const existingWishlist = yield wishlist_model_1.Wishlist.findOne({
        book: payload.book,
        user: user.id,
    });
    if (existingWishlist) {
        throw new ApiError_1.default(409, `Book already exists in the user wishlist as ${existingWishlist.status}`);
    }
    if (book.createdBy.toString() === user.id) {
        throw new ApiError_1.default(403, `Forbidden: You are not allowed to add your own book as ${payload.status}.`);
    }
    payload.user = user.id;
    const createdWishlist = (yield wishlist_model_1.Wishlist.create(payload)).populate([
        { path: 'book', populate: { path: 'createdBy' } },
        { path: 'user' },
    ]);
    return createdWishlist;
});
const getWishlistByBookIdFromDB = (bookId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wishlist_model_1.Wishlist.findOne({
        book: bookId,
        user: userId,
    }).populate([
        { path: 'book', populate: { path: 'createdBy' } },
        { path: 'user' },
    ]);
    return result;
});
const getWishlistFromDB = (id, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield wishlist_model_1.Wishlist.find({ user: id })
        .populate([
        { path: 'book', populate: { path: 'createdBy' } },
        { path: 'user' },
    ])
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield wishlist_model_1.Wishlist.countDocuments({ user: id });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.wishlistService = {
    createWishlistInDB,
    getWishlistByBookIdFromDB,
    getWishlistFromDB,
};
