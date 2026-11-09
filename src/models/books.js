
import { getDb } from '../db/connect.js';

// Retrieve all books from the database
const getAllBooks = async () => {
  const db = getDb();

  return await db
    .collection('books')
    .find({}, { projection: { _id: 0 } })
    .toArray();
};

// Retrieve a single book by custom ID
const getBookById = async (id) => {
  const db = getDb();

  return await db
    .collection('books')
    .findOne(
      { id },
      { projection: { _id: 0 } }
    );
};

// Create a new book
const createBook = async (book) => {
  const db = getDb();

  return await db
    .collection('books')
    .insertOne(book);
};

// Update an existing book
const updateBook = async (id, book) => {
  const db = getDb();

  return await db
    .collection('books')
    .updateOne(
      { id },
      {
        $set: book
      }
    );
};

// Delete a book
const deleteBook = async (id) => {
  const db = getDb();

  return await db
    .collection('books')
    .deleteOne({ id });
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
