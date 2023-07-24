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
exports.wishlistController = void 0;
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const wishlist_service_1 = require("./wishlist.service");
const createWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistData = req.body;
    const user = req.verifiedUser;
    const result = yield wishlist_service_1.wishlistService.createWishlistInDB(wishlistData, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `Book added to the wishlist as ${wishlistData.status}`,
        data: result,
    });
}));
const getWishlistByBookId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const user = req.verifiedUser;
    const result = yield wishlist_service_1.wishlistService.getWishlistByBookIdFromDB(bookId, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `Wishlist retrieved successfully`,
        data: result,
    });
}));
const getWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.verifiedUser;
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield wishlist_service_1.wishlistService.getWishlistFromDB(user.id, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `Wishlist retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
}));
exports.wishlistController = {
    createWishlist,
    getWishlistByBookId,
    getWishlist,
};
