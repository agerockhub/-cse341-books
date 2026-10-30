
import { getDb } from '../db/connect.js';

// Retrieve all books from the database
const getAllBooks = async () => {
  const db = getDb();

  return await db
    .collection('books')
    .find({})
    .toArray();
};

export { getAllBooks };
