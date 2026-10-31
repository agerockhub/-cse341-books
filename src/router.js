import express from 'express';

import {
  getAllBooksController,
  getBookByIdController
} from './controllers/books.js';

const router = express.Router();

// GET /books - Retrieve all books
router.get('/books', getAllBooksController);

// GET /books/:id - Retrieve a single book by ID
router.get('/books/:id', getBookByIdController);

export default router;