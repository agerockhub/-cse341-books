
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../models/books.js';

import { getDb } from '../db/connect.js';

// Check that a request body contains only permitted fields
const hasOnlyAllowedFields = (body, allowedFields) => {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    return false;
  }

  return Object.keys(body).every((field) => {
    return allowedFields.includes(field);
  });
};

// Validate book information
const validateBook = (book) => {
  return (
    typeof book.authorId === 'string' &&
    book.authorId.trim() !== '' &&
    typeof book.title === 'string' &&
    book.title.trim() !== '' &&
    typeof book.publicationDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(book.publicationDate) &&
    !Number.isNaN(Date.parse(book.publicationDate)) &&
    new Date(book.publicationDate).toISOString().slice(0, 10) ===
      book.publicationDate
  );
};

// Check whether an author exists
const authorExists = async (authorId) => {
  const db = getDb();

  return await db
    .collection('authors')
    .findOne({ id: authorId });
};

// GET /books - Retrieve all books
const getAllBooksController = async (req, res) => {
  try {
    const books = await getAllBooks();

    return res.status(200).json(books);
  } catch (error) {
    console.error('Error retrieving books:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// GET /books/:id - Retrieve one book
const getBookByIdController = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Error retrieving book:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// POST /books - Create a new book
const createBookController = async (req, res) => {
  try {
    const allowedFields = [
      'id',
      'authorId',
      'title',
      'publicationDate'
    ];

    if (!hasOnlyAllowedFields(req.body, allowedFields)) {
      return res.status(400).json({
        message: 'Request contains invalid or unexpected fields.'
      });
    }

    const { id, authorId, title, publicationDate } = req.body;

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      !validateBook({ authorId, title, publicationDate })
    ) {
      return res.status(400).json({
        message: 'Valid id, authorId, title, and publicationDate are required.'
      });
    }

    const bookId = id.trim();
    const authorIdValue = authorId.trim();

    // Check whether the book ID already exists
    const existingBook = await getBookById(bookId);

    if (existingBook) {
      return res.status(400).json({
        message: 'A book with this ID already exists.'
      });
    }

    // Confirm that the referenced author exists
    const author = await authorExists(authorIdValue);

    if (!author) {
      return res.status(400).json({
        message: 'The specified author does not exist.'
      });
    }

    const book = {
      id: bookId,
      authorId: authorIdValue,
      title: title.trim(),
      publicationDate
    };

    await createBook(book);

    // Return only the permitted book fields
    return res.status(201).json({
      id: book.id,
      authorId: book.authorId,
      title: book.title,
      publicationDate: book.publicationDate
    });

  } catch (error) {
    console.error('Error creating book:', error.message);

    // Handle MongoDB duplicate-key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A book with this ID already exists.'
      });
    }

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// PUT /books/:id - Update an existing book
const updateBookController = async (req, res) => {
  try {
    const allowedFields = [
      'authorId',
      'title',
      'publicationDate'
    ];

    if (!hasOnlyAllowedFields(req.body, allowedFields)) {
      return res.status(400).json({
        message: 'Request contains invalid or unexpected fields. The book ID cannot be changed.'
      });
    }

    const id = req.params.id;

    const { authorId, title, publicationDate } = req.body;

    if (!validateBook({ authorId, title, publicationDate })) {
      return res.status(400).json({
        message: 'Valid authorId, title, and publicationDate are required.'
      });
    }

    // Check whether the book exists
    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    // Confirm that the referenced author exists
    const author = await authorExists(authorId.trim());

    if (!author) {
      return res.status(400).json({
        message: 'The specified author does not exist.'
      });
    }

    const book = {
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate
    };

    await updateBook(id, book);

    return res.status(200).json({
      id,
      ...book
    });

  } catch (error) {
    console.error('Error updating book:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// DELETE /books/:id - Delete an existing book
const deleteBookController = async (req, res) => {
  try {
    const id = req.params.id;

    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    await deleteBook(id);

    return res.status(204).send();

  } catch (error) {
    console.error('Error deleting book:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export {
  getAllBooksController,
  getBookByIdController,
  createBookController,
  updateBookController,
  deleteBookController
};
