"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const verifyAuthToken_1 = __importDefault(require("../../middlewares/verifyAuthToken"));
const verifyBookOwner_1 = __importDefault(require("../../middlewares/verifyBookOwner"));
const book_controller_1 = require("./book.controller");
const book_validation_1 = require("./book.validation");
const router = express_1.default.Router();
router.post('/', verifyAuthToken_1.default, (0, validateRequest_1.default)(book_validation_1.bookValidation.createBookZodSchema), book_controller_1.bookController.createBook);
router.get('/:id', book_controller_1.bookController.getSingleBook);
router.patch('/:id', verifyAuthToken_1.default, verifyBookOwner_1.default, book_controller_1.bookController.updateBook);
router.delete('/:id', verifyAuthToken_1.default, verifyBookOwner_1.default, book_controller_1.bookController.deleteBook);
router.get('/', book_controller_1.bookController.getAllBooks);
exports.bookRoutes = router;
