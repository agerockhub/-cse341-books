
import { getDb } from '../db/connect.js';

// Retrieve all authors from the database
const getAllAuthors = async () => {
  const db = getDb();

  return await db
    .collection('authors')
    .find({})
    .toArray();
};

// Retrieve a single author by custom ID
const getAuthorById = async (id) => {
  const db = getDb();

  return await db
    .collection('authors')
    .findOne({ id: id });
};

// Create a new author
const createAuthor = async (author) => {
  const db = getDb();

  return await db
    .collection('authors')
    .insertOne(author);
};

// Update an existing author
const updateAuthor = async (id, author) => {
  const db = getDb();

  return await db
    .collection('authors')
    .updateOne(
      { id: id },
      { $set: author }
    );
};

// Delete an author
const deleteAuthor = async (id) => {
  const db = getDb();

  return await db
    .collection('authors')
    .deleteOne({ id: id });
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
