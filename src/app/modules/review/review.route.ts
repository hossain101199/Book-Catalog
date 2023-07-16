import express from 'express';

import verifyAuthToken from '../../middlewares/verifyAuthToken';
import { reviewController } from './review.controller';

const router = express.Router();

router.post('/', verifyAuthToken, reviewController.createReview);
router.get('/:id', reviewController.getReviewsByBookId);

export const reviewRoutes = router;
