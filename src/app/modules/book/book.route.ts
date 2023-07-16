import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import verifyAuthToken from '../../middlewares/verifyAuthToken';
import { bookController } from './book.controller';
import { bookValidation } from './book.validation';

const router = express.Router();

router.post(
  '/',
  verifyAuthToken,
  validateRequest(bookValidation.createBookZodSchema),
  bookController.createBook
);

router.get('/:id', bookController.getSingleBook);

router.get('/', bookController.getAllBooks);

export const bookRoutes = router;
