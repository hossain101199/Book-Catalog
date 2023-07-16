import express from 'express';

import verifyAuthToken from '../../middlewares/verifyAuthToken';
import { reviewController } from './review.controller';

const router = express.Router();

router.post('/', verifyAuthToken, reviewController.createReview);

export const reviewRoutes = router;
