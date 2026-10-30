
import express from 'express';
import { getAllBooksController } from './controllers/books.js';

const router = express.Router();

// GET /books - Retrieve all books
router.get('/books', getAllBooksController);

export default router;
