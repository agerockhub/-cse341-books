
import express from 'express';

import {
  getAllBooksController,
  getBookByIdController
} from './controllers/books.js';

import {
  getAllAuthorsController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController
} from './controllers/authors.js';

const router = express.Router();

// BOOKS ROUTES

router.get('/books', getAllBooksController);
router.get('/books/:id', getBookByIdController);

// AUTHORS ROUTES

router.get('/authors', getAllAuthorsController);
router.get('/authors/:id', getAuthorByIdController);
router.post('/authors', createAuthorController);
router.put('/authors/:id', updateAuthorController);
router.delete('/authors/:id', deleteAuthorController);

export default router;
