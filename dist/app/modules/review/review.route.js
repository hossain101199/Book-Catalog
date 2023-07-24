"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const verifyAuthToken_1 = __importDefault(require("../../middlewares/verifyAuthToken"));
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post('/', verifyAuthToken_1.default, review_controller_1.reviewController.createReview);
router.get('/:id', review_controller_1.reviewController.getReviewsByBookId);
exports.reviewRoutes = router;
