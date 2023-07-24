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
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const book_model_1 = require("../modules/book/book.model");
const verifyBookOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = req.verifiedUser;
        const book = yield book_model_1.Book.findOne({ _id: id });
        if (!book) {
            throw new ApiError_1.default(404, 'Book not found');
        }
        if (user.id.toString() !== book.createdBy.toString()) {
            throw new ApiError_1.default(403, 'Forbidden: You are not the owner of the book');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = verifyBookOwner;
