import express from 'express';

import {
  getAllBooksController,
  getBookByIdController
} from './controllers/books.js';

const router = express.Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     description: Returns a list of all books in the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved all books.
 *       500:
 *         description: Internal server error.
 */
router.get('/books', getAllBooksController);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve a single book by ID
 *     description: Returns a book matching the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the book.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the requested book.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/books/:id', getBookByIdController);

export default router;