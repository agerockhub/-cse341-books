
import { getDb } from '../db/connect.js';

// Retrieve all books from the database
const getAllBooks = async () => {
  const db = getDb();

  return await db
    .collection('books')
    .find({})
    .toArray();
};

// Retrieve a single book by its ID
const getBookById = async (id) => {
  const db = getDb();

  return await db
    .collection('books')
    .findOne({ id: id });
};

export { getAllBooks, getBookById };
