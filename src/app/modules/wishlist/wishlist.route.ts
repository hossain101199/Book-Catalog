import express from 'express';
import verifyAuthToken from '../../middlewares/verifyAuthToken';
import { wishlistController } from './wishlist.controller';

const router = express.Router();

router.post('/', verifyAuthToken, wishlistController.createWishlist);

router.get('/:id', verifyAuthToken, wishlistController.getWishlistByBookId);

router.get('/', verifyAuthToken, wishlistController.getWishlist);

export const wishlistRoutes = router;
