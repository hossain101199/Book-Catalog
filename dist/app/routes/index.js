"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const book_route_1 = require("../modules/book/book.route");
const review_route_1 = require("../modules/review/review.route");
const wishlist_route_1 = require("../modules/wishlist/wishlist.route");
const routes = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/books',
        route: book_route_1.bookRoutes,
    },
    {
        path: '/reviews',
        route: review_route_1.reviewRoutes,
    },
    {
        path: '/wishlist',
        route: wishlist_route_1.wishlistRoutes,
    },
];
moduleRoutes.forEach(route => routes.use(route.path, route.route));
exports.default = routes;
